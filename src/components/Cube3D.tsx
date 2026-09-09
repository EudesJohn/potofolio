const FACES = [
  { cls: 'cube-face-front', icon: '⚙️' },
  { cls: 'cube-face-back', icon: '🩺' },
  { cls: 'cube-face-right', icon: '💻' },
  { cls: 'cube-face-left', icon: '🌐' },
  { cls: 'cube-face-top', icon: '🐍' },
  { cls: 'cube-face-bottom', icon: '🤖' },
];

/** Cube 3D en rotation continue : les six facettes du profil. */
export default function Cube3D({ className = '' }: { className?: string }) {
  return (
    <div className={`cube-scene ${className}`} aria-hidden>
      <div className="cube">
        {FACES.map(f => (
          <div key={f.cls} className={`cube-face ${f.cls}`}>
            {f.icon}
          </div>
        ))}
      </div>
    </div>
  );
}
