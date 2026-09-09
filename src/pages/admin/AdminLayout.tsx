import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';

const NAV_ITEMS = [
  {
    to: '/eudes/-/admin',
    label: 'Tableau de bord',
    end: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </svg>
    ),
  },
  {
    to: '/eudes/-/admin/projets',
    label: 'Projets',
    end: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
      </svg>
    ),
  },
  {
    to: '/eudes/-/admin/messages',
    label: 'Messages',
    end: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m2 7 10 6 10-6" />
      </svg>
    ),
  },
  {
    to: '/eudes/-/admin/progression',
    label: 'Progression',
    end: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
        <path d="M3 3v18h18" />
        <path d="m7 14 4-4 3 3 5-6" />
      </svg>
    ),
  },
  {
    to: '/eudes/-/admin/reglages',
    label: 'Réglages',
    end: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h0a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55h0a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v0a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1z" />
      </svg>
    ),
  },
];

export default function AdminLayout() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/eudes/-/admin/login');
  }

  const navCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
      isActive
        ? 'border border-benin-green/30 bg-benin-green/15 text-benin-bright'
        : 'border border-transparent text-fog hover:bg-panel2 hover:text-ink'
    }`;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-edge bg-night/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-lg" title="Voir le site">
              <Logo />
            </Link>
            <span className="rounded-full border border-benin-green/40 bg-benin-green/10 px-2.5 py-0.5 text-xs font-semibold text-benin-bright">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-lg bg-panel2 px-3 py-1.5 text-xs text-fog sm:block">
              {session?.user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="rounded-xl border border-edge px-4 py-1.5 text-sm transition hover:border-benin-red hover:text-benin-red"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl gap-8 px-6 py-8">
        {/* Sidebar */}
        <aside className="sticky top-24 hidden h-fit w-60 shrink-0 md:block">
          <nav>
            <ul className="space-y-1.5">
              {NAV_ITEMS.map(item => (
                <li key={item.to}>
                  <NavLink to={item.to} end={item.end} className={navCls}>
                    {item.icon}
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-6 rounded-2xl border border-edge bg-panel p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-fog">Astuce</p>
            <p className="mt-1.5 text-xs leading-relaxed text-fog">
              Ajoutez cette page à vos favoris — elle n'apparaît nulle part sur le site public.
            </p>
          </div>
        </aside>

        {/* Onglets mobiles */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-edge bg-night/95 backdrop-blur-md md:hidden">
          <ul className="mx-auto flex max-w-lg">
            {NAV_ITEMS.map(item => (
              <li key={item.to} className="flex-1">
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition ${
                      isActive ? 'text-benin-bright' : 'text-fog'
                    }`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <main className="min-w-0 flex-1 pb-20 md:pb-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
