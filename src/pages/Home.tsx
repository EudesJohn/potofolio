import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, getSkills, type Project, type Skill } from '../lib/api';
import { useSiteText } from '../lib/siteText';
import Reveal from '../components/Reveal';
import BgSlideshow from '../components/BgSlideshow';
import TiltCard from '../components/TiltCard';
import Cube3D from '../components/Cube3D';
import SkillIcon from '../components/SkillIcon';

const tagCls =
  'rounded-full border border-edge bg-panel2 px-2.5 py-0.5 font-mono text-xs text-fog transition-colors hover:border-benin-bright/50 hover:text-benin-bright';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const t = useSiteText();

  const slides: string[] | undefined = (() => {
    const raw = t('hero_slides');
    if (!raw) return undefined;
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : undefined;
    } catch {
      return undefined;
    }
  })();

  useEffect(() => {
    getProjects().then(setProjects).catch(console.error);
    getSkills().then(setSkills).catch(console.error);
  }, []);

  const featured = projects.slice(0, 3);

  return (
    <div>
      {/* ---------- HERO : fenêtre terminal ---------- */}
      <section className="hero-glow relative overflow-hidden">
        <BgSlideshow slides={slides} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-night/60 via-transparent to-night" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <Reveal>
                <div className="term-window rounded-2xl border border-edge bg-panel/90 backdrop-blur">
                  {/* Barre de titre terminal */}
                  <div className="term-dots flex items-center gap-2 border-b border-edge px-5 py-3">
                    <span className="bg-benin-red/80" />
                    <span className="bg-benin-yellow/80" />
                    <span className="bg-benin-bright/80" />
                    <span className="ml-3 font-mono text-xs text-fog">eudes@ejd:~</span>
                  </div>

                  <div className="space-y-2 p-6 font-mono text-sm md:p-7">
                    <p className="text-fog">
                      <span className="text-benin-bright">$</span> whoami
                    </p>
                    <p className="text-ink">{t('home_badge')}</p>

                    <p className="pt-3 text-fog">
                      <span className="text-benin-bright">$</span> cat presentation.txt
                    </p>
                    <h1 className="gradient-text whitespace-pre-line font-display text-3xl font-bold leading-tight tracking-tight md:text-5xl">
                      {t('hero_title')}
                    </h1>
                    <p className="font-display text-base font-medium text-benin-yellow md:text-xl">
                      {t('hero_subtitle')}
                    </p>
                    <p className="max-w-xl leading-relaxed text-fog">
                      Étudiant en 3ᵉ année de Maintenance des Systèmes Industriels (MSI) à l'INSTI
                      Lokossa. Je relie deux mondes : la fiabilité des équipements — biomédicaux et
                      industriels — et la création numérique, du développement full-stack aux
                      outils IA en local.
                    </p>

                    <p className="pt-3 text-fog">
                      <span className="text-benin-bright">$</span> ./lancer_le_portfolio
                      <span className="cursor-blink ml-2" aria-hidden />
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to="/projets"
                    className="btn-primary rounded-xl bg-benin-green px-6 py-3 font-mono font-semibold text-night shadow-lg shadow-benin-green/25"
                  >
                    Découvrir mes projets
                  </Link>
                  <Link
                    to="/contact"
                    className="btn-primary rounded-xl border border-edge bg-panel/60 px-6 py-3 font-mono font-semibold text-ink backdrop-blur transition-colors hover:border-benin-bright hover:text-benin-bright"
                  >
                    Me contacter
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* Cube 3D décoratif */}
            <Reveal delay={200} className="hidden shrink-0 lg:block">
              <Cube3D />
            </Reveal>
          </div>

          {/* Statistiques façon readout système */}
          <Reveal delay={300}>
            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { b: `${projects.length || 6}+`, s: 'Projets menés de bout en bout' },
                { b: '126 000+', s: 'Paires de mots français–fon (Gbé Tché)' },
                { b: 'MSI', s: '3ᵉ année · INSTI Lokossa' },
                { b: 'Full-stack', s: 'React · Node.js · Supabase' },
              ].map(st => (
                <div
                  key={st.s}
                  className="stat-card rounded-xl border border-edge bg-panel2/80 p-4 backdrop-blur"
                >
                  <b className="block font-mono text-xl tabular-nums text-benin-bright">
                    &gt; {st.b}
                  </b>
                  <span className="font-mono text-xs leading-relaxed text-fog">{st.s}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- PROJETS EN VEDETTE ---------- */}
      <section className="border-t border-edge/70">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Reveal>
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-benin-bright">
              <span className="text-benin-yellow">$</span> ls ./projets
            </p>
            <h2 className="gradient-text mt-2 font-display text-3xl font-bold">
              Réalisations récentes
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 70}>
                <TiltCard className="h-full">
                  <article className="glow-card group flex h-full flex-col overflow-hidden rounded-2xl border border-edge bg-panel">
                    <div className="aspect-[16/9] overflow-hidden border-b border-edge bg-panel2">
                      {p.preview ? (
                        <img
                          src={p.preview}
                          alt={`Aperçu du projet ${p.title}`}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-300 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center font-mono text-4xl text-benin-bright/40">
                          {p.title.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <span className="font-mono text-[11px] uppercase tracking-widest text-benin-yellow">
                        {p.category}
                      </span>
                      <h3 className="mt-2 font-display text-lg font-semibold">{p.title}</h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-fog">
                        {p.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {p.tags.slice(0, 3).map(tag => (
                          <span key={tag} className={tagCls}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      {p.link && (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="arrow-link mt-4 font-mono text-sm font-semibold text-benin-bright hover:underline"
                        >
                          Voir le projet
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="arrow h-3.5 w-3.5" aria-hidden>
                            <path d="M2 8h11M9 4l4 4-4 4" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </article>
                </TiltCard>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-10 text-center">
              <Link
                to="/projets"
                className="arrow-link font-mono text-sm font-semibold text-benin-bright hover:underline"
              >
                Voir tous les projets
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="arrow h-3.5 w-3.5" aria-hidden>
                  <path d="M2 8h11M9 4l4 4-4 4" />
                </svg>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- COMPÉTENCES APERÇU ---------- */}
      <section className="border-t border-edge/70">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Reveal>
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-benin-bright">
              <span className="text-benin-yellow">$</span> ls ./competences
            </p>
            <h2 className="gradient-text mt-2 font-display text-3xl font-bold">
              Ce que je maîtrise
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((s, i) => (
              <Reveal key={s.id} delay={(i % 3) * 60}>
                <TiltCard className="h-full">
                  <div className="glow-card h-full rounded-2xl border border-edge bg-panel p-6">
                    <SkillIcon name={s.icon} />
                    <h3 className="mt-3 font-display font-semibold">{s.title}</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {s.tags.map(tag => (
                        <span key={tag} className={tagCls}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="border-t border-edge/70">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <Reveal>
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-benin-bright">
              <span className="text-benin-yellow">$</span> ping eudes
            </p>
            <h2 className="gradient-text mt-2 font-display text-3xl font-bold">{t('cta_title')}</h2>
            <p className="mx-auto mt-3 max-w-xl leading-relaxed text-fog">
              Stage, mission de maintenance, projet web ou collaboration sur l'IA appliquée aux
              langues locales — je suis à Cotonou / Lokossa, et toujours joignable en ligne.
            </p>
            <Link
              to="/contact"
              className="btn-primary mt-8 inline-block rounded-xl bg-benin-green px-8 py-3 font-mono font-semibold text-night shadow-lg shadow-benin-green/25"
            >
              Me contacter
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
