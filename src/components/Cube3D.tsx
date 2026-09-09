const FACES = [
  { cls: 'cube-face-front', text: 'MSI' },
  { cls: 'cube-face-back', text: 'DEV' },
  { cls: 'cube-face-right', text: 'IA' },
  { cls: 'cube-face-left', text: 'WEB' },
  { cls: 'cube-face-top', text: 'BENIN' },
  { cls: 'cube-face-bottom', text: 'EJD' },
];

/** Cube 3D en rotation continue : les six facettes du profil, en typographie. */
export default function Cube3D({ className = '' }: { className?: string }) {
  return (
    <div className={`cube-scene ${className}`} aria-hidden>
      <div className="cube">
        {FACES.map(f => (
          <div key={f.cls} className={`cube-face ${f.cls}`}>
            <span className="font-display text-lg font-bold tracking-widest text-benin-bright/80">
              {f.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
