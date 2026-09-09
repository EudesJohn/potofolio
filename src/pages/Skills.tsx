import { useEffect, useState } from 'react';
import { getSkills, type Skill } from '../lib/api';
import Reveal from '../components/Reveal';
import SkillIcon from '../components/SkillIcon';

const tagCls =
  'rounded-full border border-edge bg-panel2 px-2.5 py-0.5 text-xs text-fog transition-colors hover:border-benin-bright/50 hover:text-benin-bright';

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSkills()
      .then(setSkills)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-widest text-benin-bright">
          Compétences
        </p>
        <h1 className="gradient-text mt-2 font-display text-4xl font-bold">Ce que je maîtrise</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-fog">
          Un profil hybride : de la carte électronique au produit numérique, avec une vraie
          pratique des outils IA en local sur machine contrainte.
        </p>
      </Reveal>

      {loading && (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-40 animate-pulse rounded-2xl border border-edge bg-panel2/60" />
          ))}
        </div>
      )}

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((s, i) => (
          <Reveal key={s.id} delay={(i % 3) * 60}>
            <div className="glow-card h-full rounded-2xl border border-edge bg-panel p-6">
              <SkillIcon name={s.icon} />
              <h2 className="mt-3 font-display text-lg font-semibold">{s.title}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {s.tags.map(tag => (
                  <span key={tag} className={tagCls}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-12 grid gap-6 rounded-2xl border border-edge bg-gradient-to-br from-panel2 to-panel p-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-4">
            <h2 className="font-display text-lg">
              <span className="text-benin-yellow">Mon setup</span> — travailler malin sur une
              machine modeste
            </h2>
          </div>
          {[
            { b: 'Machine', s: 'Intel i7-7500U · GPU 940MX · 16 Go RAM' },
            { b: 'Assistant IA', s: 'Claude Code dans VS Code, comparé à Codex CLI' },
            { b: 'Modèles locaux', s: 'Ollama : Gemma4:e2b & Qwen2.5-Coder:3b (100 % CPU)' },
            { b: 'Approche', s: 'Outils efficaces, pas de matériel coûteux : le logiciel compense' },
          ].map(item => (
            <div key={item.b}>
              <b className="block text-sm text-benin-bright">{item.b}</b>
              <span className="text-sm leading-relaxed text-fog">{item.s}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
