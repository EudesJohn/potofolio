import { useId } from 'react';

export interface ChartPoint {
  label: string;
  value: number;
}

/**
 * Graphique SVG léger (aire + ligne) — aucune dépendance.
 * S'adapte au conteneur, couleurs du thème via props.
 */
export default function AreaChart({
  data,
  height = 180,
  color = '#22c55e',
  area = true,
}: {
  data: ChartPoint[];
  height?: number;
  color?: string;
  area?: boolean;
}) {
  const gradientId = useId();
  const W = 600;
  const H = height;
  const PAD = 14;

  if (data.length === 0) {
    return <p className="py-8 text-center text-sm text-fog">Pas encore de données.</p>;
  }

  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value));
  const span = max - min || 1;

  const xAt = (i: number) =>
    data.length === 1 ? W / 2 : PAD + (i / (data.length - 1)) * (W - PAD * 2);
  const yAt = (v: number) => H - PAD - ((v - min) / span) * (H - PAD * 2);

  const points = data.map((d, i) => `${xAt(i).toFixed(1)},${yAt(d.value).toFixed(1)}`);
  const linePath = `M${points.join(' L')}`;
  const areaPath = `${linePath} L${xAt(data.length - 1).toFixed(1)},${H - PAD} L${xAt(0).toFixed(1)},${H - PAD} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Graphique d'évolution">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Grille horizontale */}
      {[0.25, 0.5, 0.75].map(f => (
        <line
          key={f}
          x1={PAD}
          x2={W - PAD}
          y1={PAD + f * (H - PAD * 2)}
          y2={PAD + f * (H - PAD * 2)}
          stroke="#22322a"
          strokeDasharray="4 6"
          strokeWidth="1"
        />
      ))}

      {area && <path d={areaPath} fill={`url(#${gradientId})`} />}
      <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {data.map((d, i) => (
        <circle key={i} cx={xAt(i)} cy={yAt(d.value)} r="3" fill={color}>
          <title>{`${d.label} : ${d.value}`}</title>
        </circle>
      ))}

      {/* Libellés min / max */}
      <text x={PAD} y={PAD + 2} fill="#9db3a6" fontSize="11" textAnchor="start">
        max {max}
      </text>
      <text x={W - PAD} y={H - 2} fill="#9db3a6" fontSize="11" textAnchor="end">
        min {min}
      </text>
    </svg>
  );
}
