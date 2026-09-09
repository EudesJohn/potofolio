import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-edge py-8 text-center text-sm text-fog">
      <p>© {new Date().getFullYear()} Eudes Johnson DJOGO — Cotonou / Lokossa, Bénin</p>
      <p className="mt-2 text-base tracking-[0.3em]">🟩🟨🟥</p>
      <p className="mt-2">
        <Link to="/admin/login" className="text-xs text-fog/50 transition-colors hover:text-fog">
          Espace admin
        </Link>
      </p>
    </footer>
  );
}
