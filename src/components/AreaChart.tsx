import { useId, useState, type MouseEvent } from 'react';

export interface ChartPoint {
  label: string;
  value: number;
}

const PAD = 16;

/**
 * Graphique SVG léger — aucune dépendance.
 * mode 'area' : courbe avec aire et animation de tracé.
 * mode 'bars' : barres (idéal pour des comptages quotidiens).
 * Survol : réticule + infobulle avec la valeur exacte.
 */
export default function AreaChart({
  data,
  height = 220,
  color = '#22c55e',
  mode = 'area',
  animate = true,
}: {
  data: ChartPoint[];
  height?: number;
  color?: string;
  mode?: 'area' | 'bars';
  animate?: boolean;
}) {
  const gradientId = useId();
  const [hover, setHover] = useState<number | null>(null);
  const W = 600;
  const H = height;

  if (data.length === 0) {
    return <p className="py-8 text-center text-sm text-fog">Pas encore de données.</p>;
  }

  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value));
  const span = max - min || 1;

  const step = data.length > 1 ? (W - PAD * 2) / (data.length - 1) : 0;
  const xAt = (i: number) => (data.length === 1 ? W / 2 : PAD + i * step);
  const yAt = (v: number) => H - PAD - ((v - min) / span) * (H - PAD * 2);

  const points = data.map((d, i) => [xAt(i), yAt(d.value)] as const);
  const linePath = points.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${xAt(data.length - 1).toFixed(1)},${H - PAD} L${xAt(0).toFixed(1)},${H - PAD} Z`;

  function onMove(e: MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const i = data.length === 1 ? 0 : Math.round((x - PAD) / step);
    setHover(Math.max(0, Math.min(data.length - 1, i)));
  }

  const hp = hover !== null ? points[hover] : null;
  const flipTooltip = hp !== null && hp[0] > W - 150;
  const bw = data.length > 1 ? Math.min(18, step * 0.55) : 18;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full touch-none"
      role="img"
      aria-label="Graphique d'évolution"
      onMouseMove={onMove}
      onMouseLeave={() => setHover(null)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.32" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Grille */}
      {[0, 0.25, 0.5, 0.75, 1].map(f => (
        <line
          key={f}
          x1={PAD}
          x2={W - PAD}
          y1={PAD + f * (H - PAD * 2)}
          y2={PAD + f * (H - PAD * 2)}
          stroke="#22322a"
          strokeDasharray={f === 0 || f === 1 ? undefined : '4 6'}
          strokeWidth="1"
        />
      ))}

      {mode === 'bars'
        ? data.map((d, i) => {
            const x = xAt(i);
            const y = yAt(d.value);
            const active = hover === i;
            return (
              <rect
                key={i}
                x={x - bw / 2}
                y={y}
                width={bw}
                height={Math.max(1, H - PAD - y)}
                rx={Math.min(4, bw / 2)}
                fill={color}
                opacity={hover === null || active ? 0.9 : 0.35}
              >
                <title>{`${d.label} : ${d.value}`}</title>
              </rect>
            );
          })
        : (
          <>
            <path d={areaPath} fill={`url(#${gradientId})`} />
            <path
              d={linePath}
              fill="none"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={animate ? 'chart-line' : undefined}
            />
          </>
        )}

      {/* Réticule + infobulle au survol */}
      {hover !== null && hp && (
        <g>
          <line x1={hp[0]} y1={PAD} x2={hp[0]} y2={H - PAD} stroke={color} strokeOpacity="0.35" strokeDasharray="3 4" />
          <circle cx={hp[0]} cy={hp[1]} r="4.5" fill={color} stroke="#0a0f0c" strokeWidth="2" />
          <g transform={`translate(${flipTooltip ? hp[0] - 132 : hp[0] + 12}, ${Math.max(PAD, hp[1] - 44)})`}>
            <rect width="120" height="36" rx="8" fill="#0f1611" stroke="#22322a" />
            <text x="10" y="14" fill="#9db3a6" fontSize="10">{data[hover].label}</text>
            <text x="10" y="28" fill="#e8efe9" fontSize="12" fontWeight="600">{data[hover].value}</text>
          </g>
        </g>
      )}

      {/* Repères min / max quand pas de survol */}
      {hover === null && (
        <>
          <text x={PAD} y={PAD + 8} fill="#9db3a6" fontSize="10">max {max}</text>
          <text x={W - PAD} y={H - 4} fill="#9db3a6" fontSize="10" textAnchor="end">min {min}</text>
        </>
      )}
    </svg>
  );
}

/** Mini-courbe sans axes, pour les cartes de statistiques. */
export function Sparkline({
  data,
  color = '#22c55e',
  height = 36,
}: {
  data: ChartPoint[];
  color?: string;
  height?: number;
}) {
  const W = 120;
  const H = height;
  const P = 3;

  if (data.length === 0) return <div style={{ width: W, height: H }} aria-hidden />;

  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value));
  const span = max - min || 1;

  const xAt = (i: number) => P + (i / (data.length - 1 || 1)) * (W - P * 2);
  const yAt = (v: number) => H - P - ((v - min) / span) * (H - P * 2);

  const d = data.map((pt, i) => `${i ? 'L' : 'M'}${xAt(i).toFixed(1)},${yAt(pt.value).toFixed(1)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} aria-hidden className="overflow-visible">
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={xAt(data.length - 1)} cy={yAt(data[data.length - 1].value)} r="2.5" fill={color} />
    </svg>
  );
}
