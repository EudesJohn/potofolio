import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getProjects,
  getMessages,
  getPageViewsPerDay,
  getMetrics,
  getMetricPoints,
  getViewStats,
  type Project,
  type Message,
  type DailyCount,
  type Metric,
  type MetricPoint,
} from '../../lib/api';
import AreaChart, { Sparkline, type ChartPoint } from '../../components/AreaChart';

function dayLabel(day: string) {
  return new Date(day + 'T00:00:00').toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

function StatCard({
  label,
  value,
  sub,
  spark,
  color = '#22c55e',
  to,
}: {
  label: string;
  value: string | number;
  sub?: string;
  spark?: ChartPoint[];
  color?: string;
  to?: string;
}) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wider text-fog">{label}</p>
        {spark && <Sparkline data={spark} color={color} />}
      </div>
      <p className="mt-2 font-display text-3xl font-bold text-ink">{value}</p>
      {sub && <p className="mt-1 text-xs text-fog">{sub}</p>}
    </>
  );
  const cls =
    'stat-card block rounded-2xl border border-edge bg-panel p-5 transition hover:border-benin-green/60';
  return to ? (
    <Link to={to} className={cls}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [views, setViews] = useState<DailyCount[]>([]);
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getViewStats>> | null>(null);
  const [metricSummaries, setMetricSummaries] = useState<
    { metric: Metric; points: MetricPoint[] }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProjects({ includeUnpublished: true }),
      getMessages(),
      getPageViewsPerDay(30).catch(() => [] as DailyCount[]),
      getViewStats().catch(() => null),
      getMetrics().catch(() => [] as Metric[]),
    ])
      .then(async ([p, m, v, s, metrics]) => {
        setProjects(p);
        setMessages(m);
        setViews(v);
        setStats(s);
        // Derniers points de chaque métrique pour les mini-courbes du tableau de bord
        const withPoints = await Promise.all(
          metrics.slice(0, 4).map(async metric => ({
            metric,
            points: await getMetricPoints(metric.id).catch(() => [] as MetricPoint[]),
          }))
        );
        setMetricSummaries(withPoints);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const unread = messages.filter(m => !m.is_read).length;
  const last7 = views.slice(-7).reduce((s, v) => s + v.count, 0);
  const prev7 = views.slice(-14, -7).reduce((s, v) => s + v.count, 0);
  const trend =
    prev7 === 0
      ? last7 > 0
        ? '+100 %'
        : '—'
      : `${last7 >= prev7 ? '+' : ''}${Math.round(((last7 - prev7) / prev7) * 100)} %`;
  const trendUp = !trend.startsWith('—') && !trend.startsWith('-');

  const chartData: ChartPoint[] = views.map(v => ({ label: dayLabel(v.day), value: v.count }));
  const sparkViews: ChartPoint[] = views.slice(-14).map(v => ({ label: v.day, value: v.count }));

  // Messages : courbe par jour sur 30 jours
  const msgByDay = new Map<string, number>();
  messages.forEach(m => {
    const key = m.created_at.slice(0, 10);
    msgByDay.set(key, (msgByDay.get(key) ?? 0) + 1);
  });
  const msgData: ChartPoint[] = views.map(v => ({
    label: dayLabel(v.day),
    value: msgByDay.get(v.day) ?? 0,
  }));

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h1 className="font-display text-2xl font-bold">Tableau de bord</h1>
          <p className="mt-1 text-sm text-fog">
            Audience réelle du site et suivi de vos chiffres.
          </p>
        </div>
        <span className="rounded-full border border-edge bg-panel px-3 py-1 text-xs text-fog">
          Mis à jour en direct depuis Supabase
        </span>
      </div>

      {loading && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="h-28 animate-pulse rounded-2xl border border-edge bg-panel" />
          ))}
        </div>
      )}

      {!loading && (
        <>
          {/* ---------- Cartes de statistiques ---------- */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Visites aujourd'hui"
              value={stats?.today ?? 0}
              sub={`${stats?.week ?? 0} cette semaine`}
              spark={sparkViews}
            />
            <StatCard
              label="Visites (30 j)"
              value={stats?.month ?? totalFallback(views)}
              sub={`${trend} vs semaine précédente`}
            />
            <StatCard
              label="Visites (total)"
              value={stats?.total ?? 0}
              sub={`${stats?.uniquePaths ?? 0} pages différentes vues`}
            />
            <StatCard
              label="Messages non lus"
              value={unread}
              sub={`${messages.length} au total`}
              color="#fcd116"
              to="/eudes/-/admin/messages"
            />
          </div>

          {/* ---------- Courbes principales ---------- */}
          <div className="mt-6 grid gap-4 lg:grid-cols-5">
            <div className="chart-panel rounded-2xl border border-edge bg-panel p-6 lg:col-span-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display font-semibold">Visites par jour — 30 jours</h2>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    trendUp
                      ? 'bg-benin-green/15 text-benin-bright'
                      : 'bg-benin-red/15 text-benin-red'
                  }`}
                >
                  {trend}
                </span>
              </div>
              <div className="mt-4">
                <AreaChart data={chartData} color="#22c55e" mode="bars" />
              </div>
            </div>

            <div className="chart-panel rounded-2xl border border-edge bg-panel p-6 lg:col-span-2">
              <h2 className="font-display font-semibold">Tendance (courbe évolutive)</h2>
              <p className="text-xs text-fog">Cumul des visites — la pente montre la croissance.</p>
              <div className="mt-4">
                <AreaChart data={cumulative(chartData)} color="#fcd116" />
              </div>
            </div>
          </div>

          {/* ---------- Métriques saisies (progression) ---------- */}
          <div className="mt-10 flex items-baseline justify-between">
            <h2 className="font-display text-lg font-semibold">Vos chiffres saisis</h2>
            <Link
              to="/eudes/-/admin/progression"
              className="text-sm font-semibold text-benin-bright hover:underline"
            >
              Gérer dans Progression →
            </Link>
          </div>
          {metricSummaries.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-dashed border-edge bg-panel2 p-6 text-sm text-fog">
              Aucune métrique pour l'instant. Créez vos indicateurs (abonnés, revenus, clients…) dans
              l'onglet <b className="text-ink">Progression</b> — ils apparaîtront ici avec leurs
              courbes.
            </p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {metricSummaries.map(({ metric, points }) => {
                const latest = points.length > 0 ? Number(points[points.length - 1].value) : null;
                const first = points.length > 0 ? Number(points[0].value) : null;
                const delta =
                  latest !== null && first !== null && first !== 0
                    ? `${latest >= first ? '+' : ''}${Math.round(((latest - first) / Math.abs(first)) * 100)} %`
                    : null;
                return (
                  <div key={metric.id} className="chart-panel rounded-2xl border border-edge bg-panel p-5">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-display font-semibold">{metric.label}</h3>
                      {delta && (
                        <span className="rounded-full bg-benin-green/15 px-2.5 py-0.5 text-xs font-semibold text-benin-bright">
                          {delta}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 font-display text-2xl font-bold text-benin-bright">
                      {latest ?? '—'}
                      {metric.unit && <span className="ml-1 text-xs font-normal text-fog">{metric.unit}</span>}
                    </p>
                    <div className="mt-2">
                      <AreaChart
                        data={points.map(p => ({
                          label: new Date(p.point_date + 'T00:00:00').toLocaleDateString('fr-FR'),
                          value: Number(p.value),
                        }))}
                        color="#22c55e"
                        height={140}
                      />
                    </div>
                    <p className="mt-1 text-xs text-fog">
                      {points.length} valeur{points.length > 1 ? 's' : ''} enregistrée
                      {points.length > 1 ? 's' : ''}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* ---------- Pages les plus vues + messages ---------- */}
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-edge bg-panel p-6">
              <h2 className="font-display font-semibold">Pages les plus visitées</h2>
              <ul className="mt-4 space-y-2">
                {(stats?.topPages ?? []).map(pg => {
                  const maxCount = stats?.topPages[0]?.count || 1;
                  return (
                    <li key={pg.path} className="text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-fog">{pg.path}</span>
                        <b className="text-ink">{pg.count}</b>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-panel2">
                        <div
                          className="h-full rounded-full bg-benin-green"
                          style={{ width: `${(pg.count / maxCount) * 100}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
                {(stats?.topPages ?? []).length === 0 && (
                  <li className="text-sm text-fog">Pas encore de données de visite.</li>
                )}
              </ul>
            </div>

            <div className="rounded-2xl border border-edge bg-panel p-6">
              <div className="flex items-baseline justify-between">
                <h2 className="font-display font-semibold">Derniers messages</h2>
                <Link to="/eudes/-/admin/messages" className="text-xs font-semibold text-benin-bright hover:underline">
                  Tout voir →
                </Link>
              </div>
              <ul className="mt-4 space-y-2">
                {messages.slice(0, 5).map(m => (
                  <li
                    key={m.id}
                    className="flex items-center justify-between gap-3 rounded-xl bg-panel2 px-3 py-2 text-sm"
                  >
                    <span className="min-w-0 truncate">
                      <b className="text-ink">{m.name}</b>{' '}
                      <span className="text-fog">— {m.subject}</span>
                    </span>
                    {!m.is_read && (
                      <span className="shrink-0 rounded-full bg-benin-bright/15 px-2 py-0.5 text-xs font-semibold text-benin-bright">
                        nouveau
                      </span>
                    )}
                  </li>
                ))}
                {messages.length === 0 && <li className="text-sm text-fog">Aucun message.</li>}
              </ul>
              <div className="mt-4">
                <p className="text-xs text-fog">Messages par jour (30 jours)</p>
                <AreaChart data={msgData} color="#fcd116" height={110} mode="bars" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function totalFallback(views: DailyCount[]) {
  return views.reduce((s, v) => s + v.count, 0);
}

function cumulative(data: ChartPoint[]): ChartPoint[] {
  let sum = 0;
  return data.map(d => ({ label: d.label, value: (sum += d.value) }));
}
