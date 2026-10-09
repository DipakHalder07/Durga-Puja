import React from 'react';

const range = (n) => Array.from({ length: n }, (_, i) => i);

// Fine line-art mandala in the logo's style: crimson linework with gold accents.
// Drawn around (0,0) in a -250..250 box; stroke-only so it stays crisp and light behind content.
export function MandalaSvg({ className = '', line = '#820A14', accent = '#E8AE45' }) {
  return (
    <svg viewBox="-250 -250 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <g stroke={line} strokeWidth="1.1" strokeLinejoin="round" strokeLinecap="round">
        {/* Outer scalloped edge */}
        {range(36).map((i) => (
          <path key={`sc-${i}`} transform={`rotate(${i * 10})`} d="M-20.5,-234 Q0,-252 20.5,-234" />
        ))}
        <circle r="234" />
        <circle r="226" strokeDasharray="1 6" strokeWidth="1.6" />
        <circle r="218" />

        {/* Pointed lotus petals with a centre vein */}
        {range(24).map((i) => (
          <g key={`lp-${i}`} transform={`rotate(${i * 15})`}>
            <path d="M0,-216 C-16,-196 -22,-176 -24,-158 C-12,-162 -4,-166 0,-170 C4,-166 12,-162 24,-158 C22,-176 16,-196 0,-216Z" />
            <path d="M0,-206 L0,-176" strokeWidth="0.8" />
            <path d="M-10,-184 Q0,-196 10,-184" strokeWidth="0.8" />
          </g>
        ))}
        <circle r="156" />
        <circle r="150" strokeWidth="0.7" />

        {/* Ring of teardrops */}
        {range(48).map((i) => (
          <path key={`td-${i}`} transform={`rotate(${i * 7.5})`} d="M0,-147 C-4,-140 -4,-134 0,-131 C4,-134 4,-140 0,-147Z" strokeWidth="0.8" />
        ))}
        <circle r="128" />

        {/* Rounded double petals */}
        {range(16).map((i) => (
          <g key={`rp-${i}`} transform={`rotate(${i * 22.5})`}>
            <path d="M0,-126 C-26,-112 -26,-84 0,-74 C26,-84 26,-112 0,-126Z" />
            <path d="M0,-116 C-14,-106 -14,-90 0,-83 C14,-90 14,-106 0,-116Z" strokeWidth="0.8" />
          </g>
        ))}
        <circle r="72" />
        <circle r="66" strokeDasharray="3 4" strokeWidth="0.8" />

        {/* Eight-point star */}
        <rect x="-44" y="-44" width="88" height="88" />
        <rect x="-44" y="-44" width="88" height="88" transform="rotate(45)" />
        <circle r="40" />

        {/* Centre flower */}
        {range(12).map((i) => (
          <path key={`cf-${i}`} transform={`rotate(${i * 30})`} d="M0,-36 C-7,-28 -7,-20 0,-15 C7,-20 7,-28 0,-36Z" />
        ))}
        <circle r="12" />
      </g>

      {/* Gold accents */}
      <g fill={accent}>
        {range(36).map((i) => (
          <circle key={`ad-${i}`} transform={`rotate(${i * 10 + 5})`} cx="0" cy="-240" r="2.6" />
        ))}
        {range(24).map((i) => (
          <circle key={`ap-${i}`} transform={`rotate(${i * 15})`} cx="0" cy="-192" r="2.2" />
        ))}
        {range(16).map((i) => (
          <circle key={`ar-${i}`} transform={`rotate(${i * 22.5 + 11.25})`} cx="0" cy="-100" r="3" />
        ))}
        {range(8).map((i) => (
          <circle key={`as-${i}`} transform={`rotate(${i * 45})`} cx="0" cy="-58" r="2.4" />
        ))}
        <circle r="6" />
      </g>
    </svg>
  );
}

// Background mandalas for every page: two large corner pieces that frame the content
export default function MandalaDecorations() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* Warm ambient glow */}
      <div className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full bg-brand-gold/10 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-[520px] h-[520px] rounded-full bg-brand-crimson/[0.06] blur-3xl" />

      {/* Top-right corner */}
      <div className="absolute -top-[70px] -right-[160px] sm:-top-[220px] sm:-right-[220px] lg:-top-[260px] lg:-right-[260px] opacity-[0.2] sm:opacity-[0.22]">
        <MandalaSvg className="w-[340px] h-[340px] sm:w-[520px] sm:h-[520px] lg:w-[640px] lg:h-[640px] animate-mandala-spin" />
      </div>

      {/* Bottom-left corner */}
      <div className="absolute -bottom-[150px] -left-[150px] sm:-bottom-[220px] sm:-left-[220px] lg:-bottom-[260px] lg:-left-[260px] opacity-[0.2] sm:opacity-[0.22]">
        <MandalaSvg className="w-[340px] h-[340px] sm:w-[520px] sm:h-[520px] lg:w-[640px] lg:h-[640px] animate-mandala-spin-reverse" />
      </div>
    </div>
  );
}
