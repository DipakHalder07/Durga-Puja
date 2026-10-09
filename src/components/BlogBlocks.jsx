import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, Car, Ban, MapPin, Lightbulb } from 'lucide-react';
import Photo from './Photo';
import PandalsMap from './PandalsMap';
import { DhunuchiSketch } from './BengalArt';
import pandalsData from '../data/pandals.json';
import eventsData from '../data/events.json';
import { queryPandals, zoneTable, fillTokens, blogStats } from '../lib/blogQueries';

export const STATS = blogStats(pandalsData);

const EVENT_BN = { mahalaya: 'মহালয়া', shashti: 'ষষ্ঠী', saptami: 'সপ্তমী', ashtami: 'অষ্টমী', navami: 'নবমী', dashami: 'দশমী' };

// **bold** and [label](/path) → React nodes; {{tokens}} filled from live data
export function RichText({ text }) {
  const filled = fillTokens(text, STATS);
  const parts = filled.split(/(\*\*.+?\*\*|\[[^\]]+\]\([^)]+\))/g).filter(Boolean);
  return parts.map((part, i) => {
    const bold = part.match(/^\*\*(.+)\*\*$/);
    if (bold) return <strong key={i} className="font-semibold text-brand-ink">{bold[1]}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const cls = 'font-medium text-brand-crimson underline decoration-brand-crimson/30 underline-offset-[3px] hover:decoration-brand-crimson';
      return link[2].startsWith('/') ? (
        <Link key={i} to={link[2]} className={cls}>{link[1]}</Link>
      ) : (
        <a key={i} href={link[2]} className={cls} target="_blank" rel="noopener noreferrer">{link[1]}</a>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

export function PostCover({ post, className = '', sizes, eager = false }) {
  if (post.cover?.photo) {
    return <Photo slug={post.cover.photo} alt={post.coverAlt} sizes={sizes} eager={eager} className={className} />;
  }
  return (
    <div className={`relative overflow-hidden bg-brand-maroon ${className}`}>
      <img src={post.cover?.src} alt={post.coverAlt} loading={eager ? 'eager' : 'lazy'} decoding="async" className="w-full h-full object-cover" />
    </div>
  );
}

function PandalList({ query, note, map }) {
  const list = useMemo(() => queryPandals(pandalsData, query), [query]);
  if (!list.length) return null;
  return (
    <div className="not-prose my-6 space-y-4">
      {map && <PandalsMap pandals={list} />}
      <ol className="divide-y divide-brand-border rounded-2xl border border-brand-border bg-brand-card overflow-hidden">
        {list.map((p, i) => (
          <li key={p.id}>
            <Link to={`/pandals/${p.slug}`} className="group flex gap-3 sm:gap-4 p-4 sm:p-5 hover:bg-brand-ivory transition-colors">
              <span className="font-display text-2xl font-semibold text-brand-crimson/80 w-8 shrink-0 leading-none pt-0.5 tabular-nums">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <span className="font-semibold text-brand-ink group-hover:text-brand-crimson leading-snug">{p.name}</span>
                  <span className="shrink-0 inline-flex items-center gap-1 text-sm font-semibold text-brand-ink">
                    <Star className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" />
                    {p.pujo_songi_score}
                  </span>
                </div>
                <p className="text-sm text-brand-muted mt-1">
                  {p.area_name} · {p.category}
                  {note === 'distance' && p.distanceKm != null && <> · <strong className="text-brand-ink">{p.distanceKm.toFixed(1)} km</strong> away</>}
                </p>
                {note === 'theme' && p.theme && <p className="text-sm text-brand-ink/80 mt-1 italic">“{p.theme}”</p>}
                {note === 'parking' && p.parking_notes && (
                  <p className="text-sm text-brand-ink/80 mt-1 flex gap-1.5">
                    {p.parking_available ? <Car className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" /> : <Ban className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />}
                    <span>{p.parking_notes}</span>
                  </p>
                )}
                {note === 'access' && p.access_notes && (
                  <p className="text-sm text-brand-ink/80 mt-1 flex gap-1.5"><MapPin className="w-4 h-4 text-brand-crimson shrink-0 mt-0.5" /><span>{p.access_notes}</span></p>
                )}
                <p className="text-sm text-brand-muted mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />~{p.estimated_visit_minutes} min visit</span>
                  <span className={p.parking_available ? 'text-emerald-700' : 'text-rose-700'}>{p.parking_available ? 'Parking nearby' : 'Walk-in only'}</span>
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ZonesTable() {
  const rows = zoneTable(pandalsData);
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-brand-border bg-brand-card">
      <table className="w-full text-sm">
        <thead className="bg-brand-paper text-left">
          <tr>
            <th className="px-4 py-3 font-semibold">Zone</th>
            <th className="px-4 py-3 font-semibold text-right">Pandals</th>
            <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">With parking</th>
            <th className="px-4 py-3 font-semibold hidden sm:table-cell">Key areas</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-border">
          {rows.map((z) => (
            <tr key={z.name}>
              <td className="px-4 py-3 font-medium text-brand-ink">{z.name}</td>
              <td className="px-4 py-3 text-right tabular-nums">{z.count}</td>
              <td className="px-4 py-3 text-right tabular-nums">{z.parking}</td>
              <td className="px-4 py-3 text-brand-muted hidden sm:table-cell">{z.areas.slice(0, 4).join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ScheduleList() {
  return (
    <ol className="not-prose my-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
      {eventsData.map((e) => (
        <li key={e.id} className="rounded-2xl border border-brand-border bg-brand-card p-4">
          <p className="font-bengali-serif text-brand-crimson text-lg leading-none">{EVENT_BN[e.event_type]}</p>
          <p className="font-semibold text-brand-ink mt-2 leading-snug">{e.event_name}</p>
          <p className="text-sm text-brand-muted mt-0.5">
            {new Date(e.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </li>
      ))}
    </ol>
  );
}

export default function BlogBlocks({ blocks }) {
  return blocks.map((b, i) => {
    switch (b.type) {
      case 'p':
        return <p key={i} className="my-5"><RichText text={b.text} /></p>;
      case 'h2':
        return (
          <h2 key={i} id={b.id} className="scroll-mt-28 mt-14 mb-5 text-h2 font-bold text-brand-ink">
            <RichText text={b.text} />
          </h2>
        );
      case 'h3':
        return <h3 key={i} className="mt-10 mb-3 font-display text-h3 sm:text-[1.375rem] font-semibold text-brand-ink">{b.text}</h3>;
      case 'ul':
        return (
          <ul key={i} className="my-6 space-y-3">
            {b.items.map((it, k) => (
              <li key={k} className="relative pl-6">
                <span className="absolute left-0 top-[0.6em] w-2 h-2 rotate-45 bg-brand-crimson/80" aria-hidden="true" />
                <RichText text={it} />
              </li>
            ))}
          </ul>
        );
      case 'ol':
        return (
          <ol key={i} className="my-6 space-y-3.5">
            {b.items.map((it, k) => (
              <li key={k} className="relative pl-10">
                <span className="absolute left-0 top-0 w-7 h-7 rounded-full bg-brand-vermilion-light text-brand-crimson text-sm font-bold flex items-center justify-center">{k + 1}</span>
                <RichText text={it} />
              </li>
            ))}
          </ol>
        );
      case 'tip':
        return (
          <aside key={i} className="not-prose my-8 relative overflow-hidden rounded-2xl border border-brand-gold/40 bg-[#FDF6E7] p-5 pl-6 sm:p-6 sm:pl-7">
            <span className="absolute inset-y-0 left-0 w-1.5 bg-brand-gold" aria-hidden="true" />
            <DhunuchiSketch className="absolute -right-2 -bottom-2 w-16 h-20 text-brand-gold/40" />
            <p className="flex items-center gap-2 font-semibold text-brand-ink"><Lightbulb className="w-4 h-4 text-brand-gold" />{b.title}</p>
            <p className="text-base text-brand-ink/85 mt-1.5 pr-10"><RichText text={b.text} /></p>
          </aside>
        );
      case 'facts':
        return (
          <dl key={i} className="not-prose my-8 flex flex-wrap gap-px overflow-hidden rounded-2xl border border-brand-border bg-brand-border">
            {b.items.map(([k, v]) => (
              <div key={k} className="flex-1 basis-[45%] sm:basis-[22%] bg-brand-card px-4 py-4 sm:px-5">
                <dt className="text-xs font-medium text-brand-muted">{k}</dt>
                <dd className="font-display text-lg font-semibold text-brand-ink mt-1 leading-snug">{fillTokens(v, STATS)}</dd>
              </div>
            ))}
          </dl>
        );
      case 'pandals':
        return <PandalList key={i} query={b.query} note={b.note} map={b.map} />;
      case 'zones':
        return <ZonesTable key={i} />;
      case 'schedule':
        return <ScheduleList key={i} />;
      case 'table':
        return (
          <div key={i} className="not-prose my-6 overflow-x-auto rounded-2xl border border-brand-border bg-brand-card">
            <table className="w-full text-sm">
              <thead className="bg-brand-paper text-left">
                <tr>{b.head.map((h, k) => <th key={k} className="px-4 py-3 font-semibold whitespace-nowrap">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {b.rows.map((r, k) => (
                  <tr key={k}>{r.map((c, j) => <td key={j} className={`px-4 py-3 align-top ${j === 0 ? 'font-medium text-brand-ink' : 'text-brand-ink/80'}`}>{c}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'cta':
        return (
          <Link
            key={i}
            to={b.to}
            className="not-prose group my-8 flex items-center gap-4 rounded-2xl bg-brand-crimson text-white p-5 sm:p-6 shadow-songi hover:bg-brand-vermilion-hover transition-colors"
          >
            <div className="flex-1">
              <p className="font-display text-lg font-semibold">{b.label}</p>
              {b.text && <p className="text-sm text-white/80 mt-0.5">{b.text}</p>}
            </div>
            <span className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-5 h-5" />
            </span>
          </Link>
        );
      case 'photo':
        return (
          <figure key={i} className="not-prose my-8">
            <Photo slug={b.slug} alt={b.caption} className="w-full aspect-[16/9] rounded-2xl" sizes="(max-width: 768px) 100vw, 720px" />
            {b.caption && <figcaption className="text-sm text-brand-muted mt-3">{b.caption}</figcaption>}
          </figure>
        );
      default:
        return null;
    }
  });
}
