import { useEffect, useState } from 'react';
import { getSkills, type Skill } from '../lib/api';
import Reveal from '../components/Reveal';
import SkillIcon from '../components/SkillIcon';

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
        <h1 className="mt-2 font-display text-4xl font-bold">Ce que je maîtrise</h1>
        <p className="mt-3 max-w-2xl text-fog">
          Un profil hybride : de la carte électronique au produit numérique, avec une vraie
          pratique des outils IA en local sur machine contrainte.
        </p>
      </Reveal>

      {loading && <p className="mt-10 animate-pulse text-fog">Chargement…</p>}

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((s, i) => (
          <Reveal key={s.id} delay={(i % 3) * 100}>
            <div className="h-full rounded-2xl border border-edge bg-panel p-6 transition hover:-translate-y-1 hover:border-benin-green">
              <SkillIcon name={s.icon} />
              <h2 className="mt-3 font-display text-lg font-semibold">{s.title}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {s.tags.map(tag => (
                  <span
                    key={tag}
                    className="rounded-full border border-edge bg-panel2 px-2.5 py-0.5 text-xs text-fog"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-12 grid gap-5 rounded-2xl border border-dashed border-edge bg-panel2 p-8 sm:grid-cols-2 lg:grid-cols-4">
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
              <span className="text-sm text-fog">{item.s}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
