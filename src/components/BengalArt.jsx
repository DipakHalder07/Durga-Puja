import React from 'react';

// Hand-drawn style line sketches of Bengali Pujo motifs.
// All use currentColor, so colour them with a text-* class.

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const range = (n) => Array.from({ length: n }, (_, i) => i);

// Dhak drum with kash-feather plume
export function DhakSketch({ className = 'w-24 h-24', strokeWidth = 1.6 }) {
  return (
    <svg viewBox="0 0 120 120" className={className} strokeWidth={strokeWidth} {...base}>
      <g transform="rotate(-14 60 72)">
        <path d="M22 58 C16 72 16 86 22 100 L98 100 C104 86 104 72 98 58 Z" />
        <ellipse cx="22" cy="79" rx="7" ry="21" />
        <ellipse cx="98" cy="79" rx="7" ry="21" />
        <ellipse cx="98" cy="79" rx="3" ry="9" />
        <path d="M30 59 L42 99 M42 59 L30 99 M54 59 L66 99 M66 59 L54 99 M78 59 L90 99 M90 59 L78 99" strokeWidth={strokeWidth * 0.6} />
        <path d="M24 66 Q60 60 96 66 M24 92 Q60 98 96 92" strokeWidth={strokeWidth * 0.6} />
      </g>
      {/* kash-feather plume */}
      {range(5).map((i) => {
        const x = 36 + i * 9;
        const tipX = x - 12 + i * 5;
        const tipY = 10 + (i % 2) * 7;
        return (
          <g key={i}>
            <path d={`M${x} 58 C${x - 9} 42 ${tipX - 9} ${tipY + 16} ${tipX} ${tipY} C${tipX + 9} ${tipY + 16} ${x + 9} 42 ${x} 58`} />
            <path d={`M${x} 58 Q${(x + tipX) / 2} 36 ${tipX} ${tipY + 4}`} strokeWidth={strokeWidth * 0.5} />
          </g>
        );
      })}
    </svg>
  );
}

// Kash phool — autumn grass that announces Pujo
export function KashSketch({ className = 'w-24 h-32', strokeWidth = 1.4 }) {
  const stalks = [
    { x: 20, bend: -14, h: 120 },
    { x: 34, bend: 10, h: 140 },
    { x: 48, bend: 22, h: 118 },
    { x: 60, bend: -6, h: 132 },
  ];
  return (
    <svg viewBox="0 0 80 160" className={className} strokeWidth={strokeWidth} {...base}>
      {stalks.map(({ x, bend, h }, i) => {
        const tipX = x + bend;
        const tipY = 158 - h;
        return (
          <g key={i}>
            <path d={`M${x} 158 Q${x + bend * 0.2} ${158 - h * 0.5} ${tipX} ${tipY}`} />
            {range(9).map((k) => {
              const t = 0.45 + k * 0.065;
              const px = x + (tipX - x) * t + bend * 0.1 * (1 - t);
              const py = 158 + (tipY - 158) * t;
              return (
                <path
                  key={k}
                  d={`M${px} ${py} q${-7 - k * 0.4} -3 ${-10 - k * 0.4} -10 M${px} ${py} q${7 + k * 0.4} -3 ${10 + k * 0.4} -10`}
                  strokeWidth={strokeWidth * 0.55}
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

// Shankha (conch shell)
export function ShankhaSketch({ className = 'w-16 h-16', strokeWidth = 1.6 }) {
  return (
    <svg viewBox="0 0 100 100" className={className} strokeWidth={strokeWidth} {...base}>
      {/* spire */}
      <path d="M6 52 L30 38 L30 64 Z" />
      <path d="M12 49 L24 56 M16 45 L28 53 M21 42 L30 47" strokeWidth={strokeWidth * 0.6} />
      {/* body + siphonal tail */}
      <path d="M30 38 C46 16 82 18 92 44 C96 56 92 64 84 68 L96 86 L76 74 C60 82 40 78 30 64 Z" />
      {/* aperture lip */}
      <path d="M62 30 C78 38 84 54 80 68" />
      {/* ridges */}
      <path d="M42 32 C48 44 48 58 42 70 M54 26 C60 42 60 60 54 76" strokeWidth={strokeWidth * 0.6} />
    </svg>
  );
}

// Trinayani — Durga's three eyes, the most recognisable line in Bengali Pujo art
export function DurgaEyesSketch({ className = 'w-40 h-16', strokeWidth = 1.8 }) {
  return (
    <svg viewBox="0 0 200 80" className={className} strokeWidth={strokeWidth} {...base}>
      {/* brows */}
      <path d="M22 30 C44 14 72 14 90 26" />
      <path d="M178 30 C156 14 128 14 110 26" />
      {/* eyes */}
      <path d="M14 48 C36 30 70 30 92 44 C70 58 38 60 14 48 Z" />
      <path d="M186 48 C164 30 130 30 108 44 C130 58 162 60 186 48 Z" />
      <path d="M14 48 L2 42 M186 48 L198 42" />
      <circle cx="58" cy="44" r="8" />
      <circle cx="142" cy="44" r="8" />
      <circle cx="58" cy="44" r="2.5" fill="currentColor" />
      <circle cx="142" cy="44" r="2.5" fill="currentColor" />
      {/* third eye + bindi */}
      <path d="M100 2 C108 10 108 20 100 28 C92 20 92 10 100 2 Z" />
      <circle cx="100" cy="15" r="2.5" fill="currentColor" />
      <circle cx="100" cy="40" r="3" />
    </svg>
  );
}

// Dhunuchi (incense burner) with curling smoke
export function DhunuchiSketch({ className = 'w-16 h-24', strokeWidth = 1.6 }) {
  return (
    <svg viewBox="0 0 80 120" className={className} strokeWidth={strokeWidth} {...base}>
      <path d="M16 70 C16 90 64 90 64 70 Z" />
      <path d="M14 70 L66 70" />
      <path d="M34 86 L30 104 L50 104 L46 86" />
      <path d="M24 104 L56 104" />
      <path d="M40 66 C30 54 50 46 40 34 C30 22 48 14 42 4" strokeWidth={strokeWidth * 0.8} />
      <path d="M50 64 C46 56 58 50 54 40" strokeWidth={strokeWidth * 0.6} />
      <path d="M30 64 C26 58 34 52 30 46" strokeWidth={strokeWidth * 0.6} />
    </svg>
  );
}

// Do-chala temple / pandal roof outline
export function PandalSketch({ className = 'w-32 h-24', strokeWidth = 1.6 }) {
  return (
    <svg viewBox="0 0 160 120" className={className} strokeWidth={strokeWidth} {...base}>
      <path d="M8 52 Q80 4 152 52 L144 60 Q80 18 16 60 Z" />
      <path d="M80 10 L80 2 M76 6 L84 6" />
      <path d="M22 60 L22 114 M138 60 L138 114 M8 114 L152 114" />
      <path d="M58 114 L58 78 Q80 56 102 78 L102 114" />
      <path d="M30 114 L30 88 Q40 78 50 88 L50 114 M110 114 L110 88 Q120 78 130 88 L130 114" strokeWidth={strokeWidth * 0.8} />
      {range(9).map((i) => (
        <circle key={i} cx={24 + i * 14} cy={66} r="1.6" fill="currentColor" stroke="none" />
      ))}
    </svg>
  );
}

// Lotus
export function LotusSketch({ className = 'w-16 h-12', strokeWidth = 1.6 }) {
  return (
    <svg viewBox="0 0 100 70" className={className} strokeWidth={strokeWidth} {...base}>
      <path d="M50 8 C40 22 40 44 50 58 C60 44 60 22 50 8 Z" />
      <path d="M50 58 C36 54 26 38 28 20 C40 26 48 40 50 58" />
      <path d="M50 58 C64 54 74 38 72 20 C60 26 52 40 50 58" />
      <path d="M50 58 C30 60 14 50 8 36 C24 34 40 44 50 58" />
      <path d="M50 58 C70 60 86 50 92 36 C76 34 60 44 50 58" />
      <path d="M20 64 Q50 70 80 64" />
    </svg>
  );
}

// Alpana — white rice-paste floor art; meant for use on red backgrounds
export function AlpanaSketch({ className = 'w-64 h-64', strokeWidth = 1.4 }) {
  return (
    <svg viewBox="-120 -120 240 240" className={className} strokeWidth={strokeWidth} {...base}>
      <circle r="10" />
      <circle r="4" fill="currentColor" />
      {range(8).map((i) => (
        <g key={`p${i}`} transform={`rotate(${i * 45})`}>
          <path d="M0 -14 C-12 -26 -12 -42 0 -54 C12 -42 12 -26 0 -14 Z" />
          <path d="M0 -20 C-6 -28 -6 -38 0 -46 C6 -38 6 -28 0 -20" strokeWidth={strokeWidth * 0.6} />
        </g>
      ))}
      <circle r="60" strokeDasharray="1 5" strokeWidth={strokeWidth * 1.4} />
      {range(16).map((i) => (
        <g key={`s${i}`} transform={`rotate(${i * 22.5})`}>
          {/* curling tendril */}
          <path d="M0 -66 C-10 -76 -4 -90 8 -88 C16 -86 14 -76 6 -78" />
          <circle cx="0" cy="-100" r="2.4" fill="currentColor" stroke="none" />
        </g>
      ))}
      <circle r="108" />
      {range(36).map((i) => (
        <path key={`e${i}`} transform={`rotate(${i * 10})`} d="M-9.4 -108 Q0 -118 9.4 -108" />
      ))}
    </svg>
  );
}

// Laal-paar divider (red-and-gold saree border)
export function LaalPaar({ className = '', style }) {
  return <div className={`laal-paar w-full ${className}`} style={style} aria-hidden="true" />;
}

// Short ornamental rule: line • lotus • line
export function OrnamentRule({ className = 'text-brand-gold' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-current opacity-60" />
      <LotusSketch className="w-8 h-6" strokeWidth={2} />
      <span className="h-px flex-1 bg-current opacity-60" />
    </div>
  );
}
