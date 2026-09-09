import { useEffect, useState, type FormEvent } from 'react';
import { getSiteSettings, updateSiteSettings, uploadProjectImage } from '../../lib/api';
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

function parseSlides(raw: string | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === 'string') : [];
  } catch {
    return [];
  }
}

function unquote(v: string): string {
  return v.replace(/^"(.*)"$/s, '$1').replace(/\\n/g, '\n');
}

export default function AdminSettings() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [uploading, setUploading] = useState<'logo' | 'slide' | null>(null);
  const [newSlide, setNewSlide] = useState('');

  useEffect(() => {
    getSiteSettings()
      .then(s => {
        const merged: Record<string, string> = { ...SITE_TEXT_DEFAULTS };
        Object.entries(s).forEach(([k, v]) => {
          merged[k] = typeof v === 'string' ? unquote(v) : JSON.stringify(v);
        });
        setValues(merged);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function upload(file: File | undefined, target: 'logo' | 'slide') {
    if (!file) return;
    setUploading(target);
    setErrorMsg('');
    try {
      const url = await uploadProjectImage(file);
      if (target === 'logo') {
        setValues(v => ({ ...v, logo_image: url }));
      } else {
        setValues(v => {
          const slides = parseSlides(v.hero_slides);
          return { ...v, hero_slides: JSON.stringify([...slides, url]) };
        });
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Échec de l’envoi');
    } finally {
      setUploading(null);
    }
  }

  function removeSlide(index: number) {
    setValues(v => {
      const slides = parseSlides(v.hero_slides);
      return { ...v, hero_slides: JSON.stringify(slides.filter((_, i) => i !== index)) };
    });
  }

  function addSlideUrl() {
    if (!newSlide.trim()) return;
    setValues(v => {
      const slides = parseSlides(v.hero_slides);
      return { ...v, hero_slides: JSON.stringify([...slides, newSlide.trim()]) };
    });
    setNewSlide('');
  }

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

  const slides = parseSlides(values.hero_slides);
  const inputCls =
    'w-full rounded-xl border border-edge bg-panel2 px-4 py-2.5 text-sm outline-none transition focus:border-benin-bright';

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Réglages</h1>
      <p className="mt-1 text-sm text-fog">
        Modifiez les textes, le logo et le diaporama — appliqués immédiatement côté public.
      </p>

      {loading ? (
        <p className="mt-8 animate-pulse text-fog">Chargement…</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 max-w-2xl space-y-8">
          {/* ---------- Apparence : logo ---------- */}
          <section className="rounded-2xl border border-edge bg-panel p-6">
            <h2 className="font-display font-semibold">Logo du site</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-fog">
                  Texte du logo (si aucune image)
                </label>
                <input
                  value={values.logo_text ?? ''}
                  onChange={e => setValues({ ...values, logo_text: e.target.value })}
                  placeholder="EJD"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-fog">
                  Image du logo (remplace le texte si définie)
                </label>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex h-16 w-32 items-center justify-center overflow-hidden rounded-lg border border-edge bg-night">
                    {values.logo_image ? (
                      <img src={values.logo_image} alt="Logo" className="h-full w-full object-contain" />
                    ) : (
                      <span className="font-display font-bold text-benin-bright/50">
                        {values.logo_text || 'EJD'}.
                      </span>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      onChange={e => upload(e.target.files?.[0], 'logo')}
                      className="block w-full text-xs text-fog file:mr-3 file:rounded-lg file:border-0 file:bg-benin-green file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-[#00a462]"
                    />
                    <input
                      value={values.logo_image ?? ''}
                      onChange={e => setValues({ ...values, logo_image: e.target.value })}
                      placeholder="…ou collez une URL d'image (vide = logo texte)"
                      className={`${inputCls} text-xs`}
                    />
                  </div>
                </div>
                {uploading === 'logo' && <p className="mt-2 text-xs text-benin-yellow">Envoi…</p>}
              </div>
            </div>
          </section>

          {/* ---------- Apparence : diaporama du héro ---------- */}
          <section className="rounded-2xl border border-edge bg-panel p-6">
            <h2 className="font-display font-semibold">Diaporama d'arrière-plan (héro)</h2>
            <p className="mt-1 text-xs text-fog">
              Les images défilent en fondu derrière la page d'accueil. Ordre = ordre d'affichage.
            </p>

            <ul className="mt-4 space-y-2">
              {slides.map((src, i) => (
                <li key={src + i} className="flex items-center gap-3 rounded-xl bg-panel2 p-2">
                  <img src={src} alt={`Diapositive ${i + 1}`} className="h-12 w-20 rounded-lg object-cover" />
                  <span className="min-w-0 flex-1 truncate text-xs text-fog">{src}</span>
                  <button
                    type="button"
                    onClick={() => removeSlide(i)}
                    className="rounded-lg border border-edge px-3 py-1 text-xs transition hover:border-benin-red hover:text-benin-red"
                  >
                    Retirer
                  </button>
                </li>
              ))}
              {slides.length === 0 && (
                <li className="text-sm text-fog">Aucune image — les diapositives par défaut seront utilisées.</li>
              )}
            </ul>

            <div className="mt-4 space-y-2">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={e => upload(e.target.files?.[0], 'slide')}
                className="block w-full text-xs text-fog file:mr-3 file:rounded-lg file:border-0 file:bg-benin-green file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-[#00a462]"
              />
              <div className="flex gap-2">
                <input
                  value={newSlide}
                  onChange={e => setNewSlide(e.target.value)}
                  placeholder="…ou collez une URL d'image"
                  className={`${inputCls} text-xs`}
                />
                <button
                  type="button"
                  onClick={addSlideUrl}
                  className="shrink-0 rounded-xl border border-edge px-4 py-2 text-xs transition hover:border-benin-bright hover:text-benin-bright"
                >
                  Ajouter
                </button>
              </div>
              {uploading === 'slide' && <p className="text-xs text-benin-yellow">Envoi…</p>}
            </div>
          </section>

          {/* ---------- Textes ---------- */}
          <section className="space-y-4">
            <h2 className="font-display font-semibold">Textes du site</h2>
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
          </section>

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
