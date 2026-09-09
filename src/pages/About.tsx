import Reveal from '../components/Reveal';
import { useSiteText } from '../lib/siteText';

/** Rend un paragraphe en interprétant les marqueurs **gras**. */
function renderWithBold(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((chunk, i) =>
    chunk.startsWith('**') && chunk.endsWith('**') ? (
      <strong key={i} className="font-semibold text-ink">
        {chunk.slice(2, -2)}
      </strong>
    ) : (
      chunk
    )
  );
}

export default function About() {
  const t = useSiteText();

  const title = t('about_title');

  const paragraphs = t('about_paragraphs')
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean);

  const facts = t('about_facts')
    .split('\n')
    .map(line => {
      const [label, ...rest] = line.split('|');
      return { b: label.trim(), s: rest.join('|').trim() };
    })
    .filter(f => f.b && f.s);

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-widest text-benin-bright">
          À propos
        </p>
        <h1 className="gradient-text mt-2 whitespace-pre-line font-display text-4xl font-bold">
          {title}
        </h1>
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <div className="space-y-5 leading-relaxed text-fog">
            {paragraphs.map((p, i) => (
              <p key={i}>{renderWithBold(p)}</p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <aside className="glow-card rounded-2xl border border-edge bg-panel p-6 lg:sticky lg:top-24">
            <h2 className="font-display text-sm uppercase tracking-widest text-benin-yellow">
              Profil en bref
            </h2>
            <ul className="mt-4">
              {facts.map(f => (
                <li
                  key={f.b}
                  className="border-b border-dashed border-edge py-3 text-sm last:border-0"
                >
                  <b className="font-semibold text-ink">{f.b}</b>{' '}
                  <span className="text-fog">{f.s}</span>
                </li>
              ))}
            </ul>
          </aside>
        </Reveal>
      </div>
    </div>
  );
}
