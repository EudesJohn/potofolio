import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, getSkills, type Project, type Skill } from '../lib/api';
import Reveal from '../components/Reveal';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    getProjects().then(setProjects).catch(console.error);
    getSkills().then(setSkills).catch(console.error);
  }, []);

  const featured = projects.slice(0, 3);

  return (
    <div>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(600px 400px at 80% 20%, rgba(0,135,81,0.15), transparent), radial-gradient(500px 350px at 15% 80%, rgba(252,209,22,0.06), transparent)',
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-edge bg-panel2 px-4 py-1.5 text-xs text-fog">
              <span className="h-2 w-2 animate-pulse rounded-full bg-benin-bright" />
              Disponible pour collaborations · Cotonou / Lokossa, Bénin
            </span>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              Eudes Johnson
              <br />
              DJOGO<span className="text-benin-bright">.</span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-4 font-display text-lg font-medium text-benin-yellow md:text-2xl">
              Technicien de maintenance biomédicale &amp; Entrepreneur digital
            </p>
          </Reveal>

          <Reveal delay={300}>
            <p className="mt-5 max-w-2xl text-fog">
              Étudiant en 3ᵉ année de Maintenance des Systèmes Industriels (MSI) à l'INSTI Lokossa.
              Je relie deux mondes : la fiabilité des équipements — biomédicaux et industriels — et
              la création numérique, du développement full-stack aux outils IA en local.
            </p>
          </Reveal>

          <Reveal delay={400}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/projets"
                className="rounded-xl bg-benin-green px-6 py-3 font-semibold text-white shadow-lg shadow-benin-green/30 transition hover:-translate-y-0.5 hover:bg-[#00a462]"
              >
                Découvrir mes projets
              </Link>
              <Link
                to="/contact"
                className="rounded-xl border border-edge px-6 py-3 font-semibold transition hover:-translate-y-0.5 hover:border-benin-bright hover:text-benin-bright"
              >
                Me contacter
              </Link>
            </div>
          </Reveal>

          <Reveal delay={500}>
            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { b: `${projects.length || 6}+`, s: 'Projets menés de bout en bout' },
                { b: '126 000+', s: 'Paires de mots français–fon (Gbé Tché)' },
                { b: 'MSI', s: '3ᵉ année · INSTI Lokossa' },
                { b: 'Full-stack', s: 'React · Node.js · Supabase' },
              ].map(st => (
                <div key={st.s} className="rounded-xl border border-edge bg-panel2 p-4">
                  <b className="block font-display text-xl">{st.b}</b>
                  <span className="text-xs text-fog">{st.s}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- PROJETS EN VEDETTE ---------- */}
      <section className="border-t border-edge">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-benin-bright">
              Projets
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold">Réalisations récentes</h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <Link
                  to="/projets"
                  className="group flex h-full flex-col rounded-2xl border border-edge bg-panel p-6 transition hover:-translate-y-1 hover:border-benin-green"
                >
                  <span className="text-[11px] font-semibold tracking-widest text-benin-yellow">
                    {p.category}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-semibold">{p.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-fog">{p.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tags.slice(0, 3).map(t => (
                      <span
                        key={t}
                        className="rounded-full border border-edge bg-panel2 px-2.5 py-0.5 text-xs text-fog"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-10 text-center">
              <Link to="/projets" className="text-sm font-semibold text-benin-bright hover:underline">
                Voir tous les projets →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- COMPÉTENCES APERÇU ---------- */}
      <section className="border-t border-edge">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-benin-bright">
              Compétences
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold">Ce que je maîtrise</h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((s, i) => (
              <Reveal key={s.id} delay={i * 80}>
                <div className="h-full rounded-2xl border border-edge bg-panel p-6 transition hover:-translate-y-1 hover:border-benin-green">
                  <div className="text-2xl">{s.icon}</div>
                  <h3 className="mt-3 font-display font-semibold">{s.title}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {s.tags.map(t => (
                      <span
                        key={t}
                        className="rounded-full border border-edge bg-panel2 px-2.5 py-0.5 text-xs text-fog"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="border-t border-edge">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-bold">Travaillons ensemble</h2>
            <p className="mx-auto mt-3 max-w-xl text-fog">
              Stage, mission de maintenance, projet web ou collaboration sur l'IA appliquée aux
              langues locales — je suis à Cotonou / Lokossa, et toujours joignable en ligne.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-block rounded-xl bg-benin-green px-8 py-3 font-semibold text-white shadow-lg shadow-benin-green/30 transition hover:-translate-y-0.5 hover:bg-[#00a462]"
            >
              Me contacter
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
