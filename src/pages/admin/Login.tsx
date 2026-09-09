import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { signIn, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ??
    '/eudes/-/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (session) {
    return <Navigate to="/eudes/-/admin" replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Identifiants incorrects. Réessayez.'
      );
    } finally {
      setBusy(false);
    }
  }

  const inputCls =
    'field w-full rounded-xl border border-edge bg-panel2 px-4 py-3 font-mono text-sm outline-none placeholder:text-fog/50';

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link to="/" className="font-display text-2xl font-bold">
            EJD<span className="text-benin-bright">.</span>
          </Link>
          <h1 className="mt-4 font-display text-xl font-semibold">Espace admin</h1>
          <p className="mt-1 text-sm text-fog">Connectez-vous pour gérer le portfolio.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-edge bg-panel p-6">
          <input
            required
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            className={inputCls}
            autoComplete="username"
          />
          <input
            required
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className={inputCls}
            autoComplete="current-password"
          />
          {error && (
            <p className="rounded-xl border border-benin-red/40 bg-benin-red/10 p-3 text-sm text-benin-red">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-benin-green px-6 py-3 font-mono font-semibold text-night transition hover:bg-[#00a462] disabled:opacity-50"
          >
            {busy ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-fog/60">
          <Link to="/" className="hover:text-fog">← Retour au portfolio</Link>
        </p>
      </div>
    </div>
  );
}
