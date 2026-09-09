import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';

const NAV_ITEMS = [
  { to: '/eudes/-/admin', label: 'Tableau de bord', end: true },
  { to: '/eudes/-/admin/projets', label: 'Projets', end: false },
  { to: '/eudes/-/admin/messages', label: 'Messages', end: false },
  { to: '/eudes/-/admin/progression', label: 'Progression', end: false },
  { to: '/eudes/-/admin/reglages', label: 'Réglages', end: false },
];

export default function AdminLayout() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/eudes/-/admin/login');
  }

  const navCls = ({ isActive }: { isActive: boolean }) =>
    `block rounded-xl px-4 py-2.5 text-sm font-medium transition ${
      isActive ? 'bg-benin-green/15 text-benin-bright' : 'text-fog hover:bg-panel2 hover:text-ink'
    }`;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-edge bg-panel2">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-lg">
              <Logo />
            </Link>
            <span className="rounded-full border border-edge px-2.5 py-0.5 text-xs text-fog">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-fog sm:block">{session?.user?.email}</span>
            <button
              onClick={handleSignOut}
              className="rounded-xl border border-edge px-4 py-1.5 text-sm transition hover:border-benin-red hover:text-benin-red"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-8 md:flex-row">
        <nav className="md:w-56 md:shrink-0">
          <ul className="flex gap-2 md:flex-col">
            {NAV_ITEMS.map(item => (
              <li key={item.to} className="flex-1 md:flex-none">
                <NavLink to={item.to} end={item.end} className={navCls}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
