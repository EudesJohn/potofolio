import { useEffect, useState, type FormEvent } from 'react';
import {
  getMetrics,
  createMetric,
  deleteMetric,
  getMetricPoints,
  addMetricPoint,
  deleteMetricPoint,
  type Metric,
  type MetricPoint,
} from '../../lib/api';
import AreaChart, { type ChartPoint } from '../../components/AreaChart';

function MetricCard({ metric, onChanged }: { metric: Metric; onChanged: () => void }) {
  const [points, setPoints] = useState<MetricPoint[]>([]);
  const [value, setValue] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [open, setOpen] = useState(false);

  async function load() {
    try {
      setPoints(await getMetricPoints(metric.id));
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metric.id]);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!value) return;
    await addMetricPoint(metric.id, Number(value), date);
    setValue('');
    await load();
    onChanged();
  }

  async function handleDeletePoint(id: string) {
    await deleteMetricPoint(id);
    await load();
    onChanged();
  }

  const chartData: ChartPoint[] = points.map(p => ({
    label: new Date(p.point_date + 'T00:00:00').toLocaleDateString('fr-FR'),
    value: Number(p.value),
  }));

  const latest = points.length > 0 ? Number(points[points.length - 1].value) : null;
  const first = points.length > 0 ? Number(points[0].value) : null;
  const delta =
    latest !== null && first !== null && first !== 0
      ? `${latest >= first ? '+' : ''}${Math.round(((latest - first) / Math.abs(first)) * 100)} %`
      : null;

  const inputCls =
    'w-full rounded-xl border border-edge bg-panel2 px-3 py-2 text-sm outline-none transition focus:border-benin-bright';

  return (
    <div className="rounded-2xl border border-edge bg-panel p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-display font-semibold">{metric.label}</h3>
          {metric.unit && <p className="text-xs text-fog">Unité : {metric.unit}</p>}
        </div>
        <div className="flex items-center gap-2">
          {delta && (
            <span className="rounded-full bg-benin-green/15 px-2.5 py-0.5 text-xs text-benin-bright">
              {delta} depuis le début
            </span>
          )}
          {latest !== null && (
            <span className="font-display text-xl font-bold text-benin-bright">
              {latest}
              {metric.unit && <span className="ml-1 text-xs text-fog">{metric.unit}</span>}
            </span>
          )}
          <button
            onClick={() => setOpen(o => !o)}
            className="rounded-lg border border-edge px-3 py-1.5 text-xs transition hover:border-benin-bright hover:text-benin-bright"
          >
            {open ? 'Réduire' : 'Ajouter une valeur'}
          </button>
          <button
            onClick={async () => {
              if (confirm(`Supprimer la métrique « ${metric.label} » et toutes ses valeurs ?`)) {
                await deleteMetric(metric.id);
                onChanged();
              }
            }}
            className="rounded-lg border border-edge px-3 py-1.5 text-xs transition hover:border-benin-red hover:text-benin-red"
          >
            Supprimer
          </button>
        </div>
      </div>

      <div className="mt-4">
        <AreaChart data={chartData} color="#22c55e" />
      </div>

      {open && (
        <div className="mt-4">
          <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-2">
            <div>
              <label className="block text-xs text-fog">Valeur</label>
              <input
                type="number"
                step="any"
                required
                value={value}
                onChange={e => setValue(e.target.value)}
                className={`${inputCls} w-28`}
              />
            </div>
            <div>
              <label className="block text-xs text-fog">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className={`${inputCls} w-40`}
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-benin-green px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#00a462]"
            >
              Insérer
            </button>
          </form>

          {points.length > 0 && (
            <ul className="mt-4 max-h-40 space-y-1 overflow-y-auto">
              {[...points].reverse().map(p => (
                <li key={p.id} className="flex items-center justify-between rounded-lg bg-panel2 px-3 py-1.5 text-sm">
                  <span className="text-fog">
                    {new Date(p.point_date + 'T00:00:00').toLocaleDateString('fr-FR')} —{' '}
                    <b className="text-ink">{p.value}</b> {metric.unit}
                  </span>
                  <button
                    onClick={() => handleDeletePoint(p.id)}
                    className="text-xs text-fog/60 transition hover:text-benin-red"
                  >
                    retirer
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminProgress() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState('');
  const [unit, setUnit] = useState('');
  const [error, setError] = useState('');

  async function load() {
    try {
      setMetrics(await getMetrics());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await createMetric(label, unit);
      setLabel('');
      setUnit('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    }
  }

  const inputCls =
    'w-full rounded-xl border border-edge bg-panel2 px-4 py-2.5 text-sm outline-none transition focus:border-benin-bright';

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Progression</h1>
      <p className="mt-1 text-sm text-fog">
        Saisissez vos chiffres au fil du temps — chaque valeur insérée apparaît sur le graphique.
      </p>

      <form onSubmit={handleCreate} className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-edge bg-panel p-5">
        <div className="flex-1">
          <label className="block text-xs text-fog">Nouvelle métrique (ex. Abonnés TikTok, Clients, Revenus FCFA)</label>
          <input
            required
            value={label}
            onChange={e => setLabel(e.target.value)}
            placeholder="Nom de la métrique"
            className={inputCls}
          />
        </div>
        <div className="w-40">
          <label className="block text-xs text-fog">Unité (optionnel)</label>
          <input
            value={unit}
            onChange={e => setUnit(e.target.value)}
            placeholder="ex. FCFA, abonnés…"
            className={inputCls}
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-benin-green px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#00a462]"
        >
          Créer
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded-xl border border-benin-red/40 bg-benin-red/10 p-3 text-sm text-benin-red">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-8 animate-pulse text-fog">Chargement…</p>
      ) : (
        <div className="mt-6 space-y-5">
          {metrics.map(m => (
            <MetricCard key={m.id} metric={m} onChanged={load} />
          ))}
          {metrics.length === 0 && (
            <p className="text-fog">Aucune métrique. Créez-en une pour suivre votre évolution.</p>
          )}
        </div>
      )}
    </div>
  );
}
