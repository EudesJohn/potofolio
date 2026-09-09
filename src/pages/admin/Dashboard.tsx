import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, getMessages, type Project, type Message } from '../../lib/api';

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProjects({ includeUnpublished: true }), getMessages()])
      .then(([p, m]) => {
        setProjects(p);
        setMessages(m);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const unread = messages.filter(m => !m.is_read).length;

  const stats = [
    { label: 'Projets', value: projects.length, sub: `${projects.filter(p => p.published).length} publiés`, to: '/eudes/-/admin/projets' },
    { label: 'Messages', value: messages.length, sub: `${unread} non lu${unread > 1 ? 's' : ''}`, to: '/eudes/-/admin/messages' },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Tableau de bord</h1>
      <p className="mt-1 text-sm text-fog">Vue d'ensemble de votre portfolio.</p>

      {loading && <p className="mt-8 animate-pulse text-fog">Chargement…</p>}

      {!loading && (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {stats.map(s => (
              <Link
                key={s.label}
                to={s.to}
                className="rounded-2xl border border-edge bg-panel p-6 transition hover:border-benin-green"
              >
                <p className="text-sm text-fog">{s.label}</p>
                <p className="mt-1 font-display text-3xl font-bold text-benin-bright">{s.value}</p>
                <p className="mt-1 text-xs text-fog">{s.sub}</p>
              </Link>
            ))}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-edge bg-panel p-6">
              <h2 className="font-display font-semibold">Derniers projets</h2>
              <ul className="mt-4 space-y-2">
                {projects.slice(0, 5).map(p => (
                  <li key={p.id} className="flex items-center justify-between text-sm">
                    <span className="truncate text-fog">• {p.title}</span>
                    <span
                      className={`ml-3 shrink-0 rounded-full px-2 py-0.5 text-xs ${
                        p.published
                          ? 'bg-benin-green/15 text-benin-bright'
                          : 'bg-benin-yellow/15 text-benin-yellow'
                      }`}
                    >
                      {p.published ? 'publié' : 'brouillon'}
                    </span>
                  </li>
                ))}
                {projects.length === 0 && <li className="text-sm text-fog">Aucun projet.</li>}
              </ul>
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
            </div>
          </div>
        </>
      )}
    </div>
  );
}
