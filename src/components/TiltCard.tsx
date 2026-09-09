import { useRef, type MouseEvent, type ReactNode } from 'react';

const MAX_DEG = 9;

/**
 * Carte à effet 3D : s'incline subtilement vers le curseur.
 * Désactivé sur écrans tactiles et si mouvement réduit.
 */
export default function TiltCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * MAX_DEG).toFixed(2)}deg) rotateY(${(px * MAX_DEG).toFixed(2)}deg) translateY(-4px)`;
  }

  function handleLeave() {
    const el = ref.current;
    if (el) el.style.transform = '';
  }

  return (
    <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} className={`tilt-card ${className}`}>
      {children}
    </div>
  );
}
