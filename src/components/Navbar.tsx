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
      <nav className="border-b border-edge/70 bg-night/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="text-lg" aria-label="Retour à l'accueil">
            <Logo />
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {links.map(l => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) => `nav-link text-sm font-medium ${isActive ? 'active' : ''}`}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Menu mobile — pop depuis le déclencheur (transform-origin top right) */}
          <details className="relative md:hidden">
            <summary
              className="cursor-pointer list-none rounded-lg p-1.5 transition-colors hover:bg-panel2 [&::-webkit-details-marker]:hidden"
              aria-label="Ouvrir le menu"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-6 w-6 text-ink" aria-hidden>
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </summary>
            <ul className="menu-pop absolute right-0 top-12 w-52 rounded-xl border border-edge bg-panel/95 p-2 shadow-2xl shadow-black/50 backdrop-blur-xl">
              {links.map(l => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.to === '/'}
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2 text-sm transition-colors ${
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
