import { useEffect, useState } from 'react';

const DEFAULT_SLIDES = ['/bg/slide-1.svg', '/bg/slide-2.svg', '/bg/slide-3.svg', '/bg/slide-4.svg'];

/** Diaporama d'images en arrière-plan : fondu enchaîné + zoom lent. */
export default function BgSlideshow({
  slides,
  intervalMs = 6000,
}: {
  slides?: string[];
  intervalMs?: number;
}) {
  const list = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (list.length < 2) return;
    const id = setInterval(() => setIndex(i => (i + 1) % list.length), intervalMs);
    return () => clearInterval(id);
  }, [list.length, intervalMs]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {list.map((src, i) => (
        <div
          key={src + i}
          className={`bg-slide ${i === index ? 'bg-slide-active' : ''}`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
    </div>
  );
}
