import { NavLink, Link } from 'react-router-dom';
import Logo from './Logo';

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/projets', label: 'Projets' },
  { to: '/competences', label: 'Compétences' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="border-b border-edge bg-night/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="text-lg">
            <Logo />
          </Link>

          <ul className="hidden items-center gap-7 md:flex">
            {links.map(l => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive ? 'text-benin-bright' : 'text-fog hover:text-benin-bright'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Menu mobile */}
          <details className="relative md:hidden">
            <summary className="cursor-pointer list-none" aria-label="Menu">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-6 w-6 text-ink" aria-hidden>
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </summary>
            <ul className="absolute right-0 top-10 w-48 rounded-xl border border-edge bg-panel p-2 shadow-xl">
              {links.map(l => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2 text-sm ${
                        isActive
                          ? 'bg-panel2 text-benin-bright'
                          : 'text-fog hover:bg-panel2 hover:text-ink'
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </nav>
    </header>
  );
}
