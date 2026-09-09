import Reveal from '../components/Reveal';

const facts = [
  { b: 'Formation :', s: '3ᵉ année MSI — INSTI Lokossa (Bénin)' },
  { b: 'Diplômes :', s: 'Baccalauréat F3 · CAP' },
  { b: 'Spécialité :', s: 'Maintenance biomédicale' },
  { b: 'Activité :', s: 'Entrepreneur digital' },
  { b: 'Base :', s: 'Cotonou / Lokossa, Bénin' },
  { b: 'Centres d’intérêt :', s: 'Philosophie · Culture béninoise' },
];

export default function About() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-widest text-benin-bright">
          À propos
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold">
          Entre atelier de maintenance
          <br />
          et création numérique
        </h1>
      </Reveal>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <div className="space-y-4 text-fog">
            <p>
              <strong className="text-ink">Technicien de maintenance biomédicale</strong>, je
              m'intéresse de près à la sécurité électrique des équipements médicaux et aux normes
              qui les encadrent, comme la <strong className="text-ink">CEI 62353</strong> — un
              sujet au cœur de mon mémoire, porté par un prototype ESP32.
            </p>
            <p>
              En parallèle, je suis <strong className="text-ink">entrepreneur digital</strong> : je
              conçois des produits web complets, des plateformes éducatives, des funnels de vente
              et des contenus — en restant attaché à ma culture béninoise, que j'explore aussi à
              travers des projets technologiques comme la traduction{' '}
              <strong className="text-ink">français–fon</strong>.
            </p>
            <p>
              Curieux de philosophie et défenseur d'une identité culturelle forte, je crois qu'un
              bon technicien, comme un bon entrepreneur, doit comprendre les systèmes avant de les
              réparer ou de les construire.
            </p>
            <p>
              Côté outils, je travaille malin sur une machine modeste (Intel i7-7500U, 16 Go RAM) :
              <strong className="text-ink"> Claude Code</strong> dans VS Code au quotidien, comparé
              à Codex CLI, et des modèles locaux via <strong className="text-ink">Ollama</strong>{' '}
              (Gemma4:e2b, Qwen2.5-Coder:3b) — la preuve qu'on n'a pas besoin d'un matériel coûteux
              pour construire des choses sérieuses.
            </p>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <aside className="rounded-2xl border border-edge bg-panel p-6">
            <h2 className="font-display text-sm uppercase tracking-widest text-benin-yellow">
              Profil en bref
            </h2>
            <ul className="mt-4">
              {facts.map(f => (
                <li
                  key={f.b}
                  className="border-b border-dashed border-edge py-2.5 text-sm text-fog last:border-0"
                >
                  <b className="font-semibold text-ink">{f.b}</b> {f.s}
                </li>
              ))}
            </ul>
          </aside>
        </Reveal>
      </div>
    </div>
  );
}
