import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getProjects,
  getMessages,
  getPageViewsPerDay,
  type Project,
  type Message,
  type DailyCount,
} from '../../lib/api';
import AreaChart, { type ChartPoint } from '../../components/AreaChart';

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [views, setViews] = useState<DailyCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProjects({ includeUnpublished: true }),
      getMessages(),
      getPageViewsPerDay(30).catch(() => [] as DailyCount[]),
    ])
      .then(([p, m, v]) => {
        setProjects(p);
        setMessages(m);
        setViews(v);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const unread = messages.filter(m => !m.is_read).length;
  const totalViews = views.reduce((s, v) => s + v.count, 0);
  const last7 = views.slice(-7).reduce((s, v) => s + v.count, 0);
  const prev7 = views.slice(-14, -7).reduce((s, v) => s + v.count, 0);
  const trend = prev7 === 0 ? (last7 > 0 ? '+100 %' : '—') : `${last7 >= prev7 ? '+' : ''}${Math.round(((last7 - prev7) / prev7) * 100)} %`;

  const chartData: ChartPoint[] = views.map(v => ({
    label: new Date(v.day + 'T00:00:00').toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
    value: v.count,
  }));

  // Messages : courbe cumulative sur 30 jours
  const msgByDay = new Map<string, number>();
  messages.forEach(m => {
    const key = m.created_at.slice(0, 10);
    msgByDay.set(key, (msgByDay.get(key) ?? 0) + 1);
  });
  const msgData: ChartPoint[] = views.map(v => ({
    label: new Date(v.day + 'T00:00:00').toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
    value: msgByDay.get(v.day) ?? 0,
  }));

  const stats = [
    { label: 'Visites (30 j)', value: totalViews, sub: `${trend} vs semaine précédente`, to: undefined as string | undefined },
    { label: 'Projets', value: projects.length, sub: `${projects.filter(p => p.published).length} publiés`, to: '/eudes/-/admin/projets' },
    { label: 'Messages', value: messages.length, sub: `${unread} non lu${unread > 1 ? 's' : ''}`, to: '/eudes/-/admin/messages' },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Tableau de bord</h1>
      <p className="mt-1 text-sm text-fog">Audience réelle du site et activité du portfolio.</p>

      {loading && <p className="mt-8 animate-pulse text-fog">Chargement…</p>}

      {!loading && (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {stats.map(s => {
              const inner = (
                <>
                  <p className="text-sm text-fog">{s.label}</p>
                  <p className="mt-1 font-display text-3xl font-bold text-benin-bright">{s.value}</p>
                  <p className="mt-1 text-xs text-fog">{s.sub}</p>
                </>
              );
              return s.to ? (
                <Link key={s.label} to={s.to} className="rounded-2xl border border-edge bg-panel p-6 transition hover:border-benin-green">
                  {inner}
                </Link>
              ) : (
                <div key={s.label} className="rounded-2xl border border-edge bg-panel p-6">
                  {inner}
                </div>
              );
            })}
          </div>

          <div className="mt-8 rounded-2xl border border-edge bg-panel p-6">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display font-semibold">Visites par jour (30 jours)</h2>
              <span className="text-xs text-fog">suivi réel depuis la base</span>
            </div>
            <div className="mt-4">
              <AreaChart data={chartData} color="#22c55e" />
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-edge bg-panel p-6">
              <h2 className="font-display font-semibold">Messages par jour (30 jours)</h2>
              <div className="mt-4">
                <AreaChart data={msgData} color="#fcd116" />
              </div>
            </div>

            <div className="rounded-2xl border border-edge bg-panel p-6">
              <h2 className="font-display font-semibold">Derniers messages</h2>
              <ul className="mt-4 space-y-2">
                {messages.slice(0, 5).map(m => (
                  <li key={m.id} className="flex items-center justify-between text-sm">
                    <span className="truncate text-fog">• {m.name} — {m.subject}</span>
                    {!m.is_read && (
                      <span className="ml-3 shrink-0 rounded-full bg-benin-bright/15 px-2 py-0.5 text-xs text-benin-bright">
                        nouveau
                      </span>
                    )}
                  </li>
                ))}
                {messages.length === 0 && <li className="text-sm text-fog">Aucun message.</li>}
              </ul>
              <Link to="/eudes/-/admin/messages" className="mt-4 inline-block text-sm font-semibold text-benin-bright hover:underline">
                Tous les messages →
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
