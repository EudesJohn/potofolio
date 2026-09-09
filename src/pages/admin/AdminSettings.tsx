import { useEffect, useState, type FormEvent } from 'react';
import { getSiteSettings, updateSiteSettings } from '../../lib/api';
import { SITE_TEXT_DEFAULTS } from '../../lib/siteText';

const FIELDS: { key: string; label: string; multiline?: boolean }[] = [
  { key: 'home_badge', label: 'Badge d’accueil (héro)' },
  { key: 'hero_title', label: 'Titre du héro (retour à la ligne possible)', multiline: true },
  { key: 'hero_subtitle', label: 'Sous-titre du héro' },
  { key: 'cta_title', label: 'Titre de l’appel à l’action' },
  { key: 'footer_note', label: 'Note du pied de page' },
  { key: 'contact_email', label: 'Email de contact' },
  { key: 'contact_github', label: 'Lien GitHub' },
  { key: 'contact_linkedin', label: 'Lien LinkedIn' },
  { key: 'contact_location', label: 'Localisation' },
];

export default function AdminSettings() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    getSiteSettings()
      .then(s => {
        const merged: Record<string, string> = { ...SITE_TEXT_DEFAULTS };
        Object.entries(s).forEach(([k, v]) => {
          // En base les chaînes sont stockées en JSON : retirer les guillemets externes
          merged[k] = v.replace(/^"(.*)"$/s, '$1').replace(/\\n/g, '\n');
        });
        setValues(merged);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('saving');
    setErrorMsg('');
    try {
      await updateSiteSettings(values);
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2500);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Erreur');
    }
  }

  const inputCls =
    'w-full rounded-xl border border-edge bg-panel2 px-4 py-2.5 text-sm outline-none transition focus:border-benin-bright';

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Réglages</h1>
      <p className="mt-1 text-sm text-fog">
        Modifiez les textes et liens du site — appliqués immédiatement côté public.
      </p>

      {loading ? (
        <p className="mt-8 animate-pulse text-fog">Chargement…</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 max-w-2xl space-y-4">
          {FIELDS.map(f => (
            <div key={f.key}>
              <label className="mb-1 block text-xs font-medium text-fog">{f.label}</label>
              {f.multiline ? (
                <textarea
                  rows={2}
                  value={values[f.key] ?? ''}
                  onChange={e => setValues({ ...values, [f.key]: e.target.value })}
                  className={inputCls}
                />
              ) : (
                <input
                  value={values[f.key] ?? ''}
                  onChange={e => setValues({ ...values, [f.key]: e.target.value })}
                  className={inputCls}
                />
              )}
            </div>
          ))}

          {status === 'error' && (
            <p className="rounded-xl border border-benin-red/40 bg-benin-red/10 p-3 text-sm text-benin-red">
              {errorMsg}
            </p>
          )}
          {status === 'saved' && (
            <p className="rounded-xl border border-benin-green/40 bg-benin-green/10 p-3 text-sm text-benin-bright">
              Modifications enregistrées.
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'saving'}
            className="rounded-xl bg-benin-green px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#00a462] disabled:opacity-50"
          >
            {status === 'saving' ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </form>
      )}
    </div>
  );
}
