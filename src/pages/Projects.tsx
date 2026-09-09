import { useEffect, useState } from 'react';
import { getProjects, type Project } from '../lib/api';
import Reveal from '../components/Reveal';
import TiltCard from '../components/TiltCard';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-widest text-benin-bright">
          Projets
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold">
          Réalisations &amp; expérimentations
        </h1>
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

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.id} delay={(i % 2) * 100}>
            <TiltCard className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-edge bg-panel transition hover:border-benin-green">
                <div className="aspect-[16/9] overflow-hidden border-b border-edge bg-panel2">
                  {p.link ? (
                    <img
                      src={p.link}
                      alt={`Aperçu du projet ${p.title}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl">📁</div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
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
                      className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-benin-bright hover:underline"
                    >
                      Voir le projet →
                    </a>
                  )}
                </div>
              </article>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      {!loading && !error && projects.length === 0 && (
        <p className="mt-10 text-fog">Aucun projet publié pour le moment.</p>
      )}
    </div>
  );
}
