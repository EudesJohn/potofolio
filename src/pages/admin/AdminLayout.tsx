import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/admin/login');
  }

  const navCls = ({ isActive }: { isActive: boolean }) =>
    `block rounded-xl px-4 py-2.5 text-sm font-medium transition ${
      isActive ? 'bg-benin-green/15 text-benin-bright' : 'text-fog hover:bg-panel2 hover:text-ink'
    }`;

  return (
    <div className="flex min-h-screen flex-col">
      <div className="tricolor" />
      <header className="border-b border-edge bg-panel2">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-display font-bold">
              EJD<span className="text-benin-bright">.</span>
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
            <li className="flex-1 md:flex-none">
              <NavLink to="/admin" end className={navCls}>
                📊 Tableau de bord
              </NavLink>
            </li>
            <li className="flex-1 md:flex-none">
              <NavLink to="/admin/projets" className={navCls}>
                📁 Projets
              </NavLink>
            </li>
            <li className="flex-1 md:flex-none">
              <NavLink to="/admin/messages" className={navCls}>
                ✉️ Messages
              </NavLink>
            </li>
          </ul>
        </nav>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
