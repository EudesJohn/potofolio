import { useEffect, useState } from 'react';
import { getProjects, type Project } from '../lib/api';
import Reveal from '../components/Reveal';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-widest text-benin-bright">Projets</p>
        <h1 className="mt-2 font-display text-4xl font-bold">Réalisations &amp; expérimentations</h1>
        <p className="mt-3 max-w-2xl text-fog">
          Des projets qui traversent mes deux univers : la technologie appliquée au terrain et
          l'entrepreneuriat numérique ancré dans la culture béninoise.
        </p>
      </Reveal>

      {loading && <p className="mt-10 animate-pulse text-fog">Chargement des projets…</p>}
      {error && (
        <p className="mt-10 rounded-xl border border-benin-red/40 bg-benin-red/10 p-4 text-sm text-benin-red">
          Erreur : {error}
        </p>
      )}

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.id} delay={(i % 2) * 100}>
            <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-edge bg-panel p-6 transition hover:-translate-y-1 hover:border-benin-green">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-benin-green to-benin-yellow opacity-0 transition group-hover:opacity-100" />
              <span className="text-[11px] font-semibold tracking-widest text-benin-yellow">
                {String(i + 1).padStart(2, '0')} · {p.category}
              </span>
              <h2 className="mt-2 font-display text-xl font-semibold">{p.title}</h2>
              <p className="mt-2 flex-1 text-sm text-fog">{p.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map(t => (
                  <span
                    key={t}
                    className="rounded-full border border-edge bg-panel2 px-2.5 py-0.5 text-xs text-fog"
                  >
                    {t}
                  </span>
                ))}
              </div>
              {p.link && (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 text-sm font-semibold text-benin-bright hover:underline"
                >
                  Voir le projet →
                </a>
              )}
            </article>
          </Reveal>
        ))}
      </div>

      {!loading && !error && projects.length === 0 && (
        <p className="mt-10 text-fog">Aucun projet publié pour le moment.</p>
      )}
    </div>
  );
}
