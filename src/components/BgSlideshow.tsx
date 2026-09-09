import { useEffect, useState } from 'react';

const SLIDES = ['/bg/slide-1.svg', '/bg/slide-2.svg', '/bg/slide-3.svg', '/bg/slide-4.svg'];

/** Diaporama d'images en arrière-plan : fondu enchaîné + zoom lent. */
export default function BgSlideshow({ intervalMs = 6000 }: { intervalMs?: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % SLIDES.length), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {SLIDES.map((src, i) => (
        <div
          key={src}
          className={`bg-slide ${i === index ? 'bg-slide-active' : ''}`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
    </div>
  );
}
