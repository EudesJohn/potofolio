import { useEffect, useState, type FormEvent } from 'react';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImage,
  type Project,
} from '../../lib/api';

interface Draft {
  title: string;
  category: string;
  description: string;
  tags: string;
  link: string;
  preview: string;
  display_order: number;
  published: boolean;
}

const emptyDraft: Draft = {
  title: '',
  category: 'Projet',
  description: '',
  tags: '',
  link: '',
  preview: '',
  display_order: 10,
  published: true,
};

function toDraft(p: Project): Draft {
  return {
    title: p.title,
    category: p.category,
    description: p.description,
    tags: p.tags.join(', '),
    link: p.link ?? '',
    preview: p.preview ?? '',
    display_order: p.display_order,
    published: p.published,
  };
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function load() {
    try {
      setProjects(await getProjects({ includeUnpublished: true }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function startCreate() {
    setEditingId(null);
    setDraft(emptyDraft);
    setShowForm(true);
    setError('');
  }

  function startEdit(p: Project) {
    setEditingId(p.id);
    setDraft(toDraft(p));
    setShowForm(true);
    setError('');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const payload = {
      title: draft.title,
      category: draft.category,
      description: draft.description,
      tags: draft.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
      link: draft.link || null,
      preview: draft.preview || null,
      display_order: Number(draft.display_order) || 0,
      published: draft.published,
    };
    try {
      if (editingId) {
        await updateProject(editingId, payload);
      } else {
        await createProject(payload);
      }
      setShowForm(false);
      setEditingId(null);
      setDraft(emptyDraft);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l’enregistrement');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(p: Project) {
    if (!confirm(`Supprimer « ${p.title} » ? Cette action est définitive.`)) return;
    try {
      await deleteProject(p.id);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  }

  async function handleUpload(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadProjectImage(file);
      setDraft(d => ({ ...d, preview: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec de l’envoi de l’image');
    } finally {
      setUploading(false);
    }
  }

  const inputCls =
    'w-full rounded-xl border border-edge bg-panel2 px-4 py-2.5 text-sm outline-none transition focus:border-benin-bright';

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Projets</h1>
          <p className="mt-1 text-sm text-fog">Gérez les projets affichés sur le portfolio.</p>
        </div>
        <button
          onClick={startCreate}
          className="rounded-xl bg-benin-green px-5 py-2.5 font-mono text-sm font-semibold text-night transition hover:bg-[#00a462]"
        >
          + Nouveau projet
        </button>
      </div>

      {error && !showForm && (
        <p className="mt-6 rounded-xl border border-benin-red/40 bg-benin-red/10 p-3 text-sm text-benin-red">
          {error}
        </p>
      )}

      {/* ---------- Formulaire ---------- */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 rounded-2xl border border-edge bg-panel p-6"
        >
          <h2 className="font-display font-semibold">
            {editingId ? 'Modifier le projet' : 'Nouveau projet'}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              required
              value={draft.title}
              onChange={e => setDraft({ ...draft, title: e.target.value })}
              placeholder="Titre du projet"
              className={inputCls}
            />
            <input
              required
              value={draft.category}
              onChange={e => setDraft({ ...draft, category: e.target.value })}
              placeholder="Catégorie (ex. MÉMOIRE, OUTIL…)"
              className={inputCls}
            />
          </div>
          <textarea
            required
            rows={4}
            value={draft.description}
            onChange={e => setDraft({ ...draft, description: e.target.value })}
            placeholder="Description"
            className={inputCls}
          />
          <input
            value={draft.tags}
            onChange={e => setDraft({ ...draft, tags: e.target.value })}
            placeholder="Tags séparés par des virgules (ex. React, ESP32, Python)"
            className={inputCls}
          />

          {/* Image d'aperçu */}
          <div className="rounded-xl border border-edge bg-panel2 p-4">
            <label className="mb-2 block text-xs font-medium text-fog">Image d'aperçu du projet</label>
            <div className="flex flex-wrap items-center gap-4">
              <div className="h-24 w-40 overflow-hidden rounded-lg border border-edge bg-night">
                {draft.preview ? (
                  <img src={draft.preview} alt="Aperçu" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center font-display text-2xl text-benin-bright/40">
                    {draft.title.charAt(0) || '—'}
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={e => handleUpload(e.target.files?.[0])}
                  className="block w-full text-xs text-fog file:mr-3 file:rounded-lg file:border-0 file:bg-benin-green file:px-4 file:py-2 file:text-xs file:font-semibold file:text-night hover:file:bg-[#00a462]"
                />
                <input
                  value={draft.preview}
                  onChange={e => setDraft({ ...draft, preview: e.target.value })}
                  placeholder="…ou collez une URL d'image"
                  className={`${inputCls} text-xs`}
                />
                {uploading && <p className="text-xs text-benin-yellow">Envoi de l'image…</p>}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <input
              value={draft.link}
              onChange={e => setDraft({ ...draft, link: e.target.value })}
              placeholder="Lien réel du projet (GitHub, démo…)"
              className={inputCls}
            />
            <input
              type="number"
              value={draft.display_order}
              onChange={e => setDraft({ ...draft, display_order: Number(e.target.value) })}
              placeholder="Ordre"
              className={inputCls}
            />
            <label className="flex items-center gap-3 rounded-xl border border-edge bg-panel2 px-4 py-2.5 text-sm">
              <input
                type="checkbox"
                checked={draft.published}
                onChange={e => setDraft({ ...draft, published: e.target.checked })}
                className="h-4 w-4 accent-[#008751]"
              />
              Publié
            </label>
          </div>
          {error && (
            <p className="rounded-xl border border-benin-red/40 bg-benin-red/10 p-3 text-sm text-benin-red">
              {error}
            </p>
          )}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={busy}
              className="rounded-xl bg-benin-green px-6 py-2.5 font-mono text-sm font-semibold text-night transition hover:bg-[#00a462] disabled:opacity-50"
            >
              {busy ? 'Enregistrement…' : 'Enregistrer'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setError('');
              }}
              className="rounded-xl border border-edge px-6 py-2.5 text-sm transition hover:border-fog"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* ---------- Liste ---------- */}
      {loading ? (
        <p className="mt-8 animate-pulse text-fog">Chargement…</p>
      ) : (
        <div className="mt-6 space-y-3">
          {projects.map(p => (
            <div
              key={p.id}
              className="flex flex-wrap items-center gap-3 rounded-2xl border border-edge bg-panel p-5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-display font-semibold">{p.title}</h3>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
                      p.published
                        ? 'bg-benin-green/15 text-benin-bright'
                        : 'bg-benin-yellow/15 text-benin-yellow'
                    }`}
                  >
                    {p.published ? 'publié' : 'brouillon'}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-fog">{p.description}</p>
                <p className="mt-1 text-xs text-fog/70">
                  {p.category} · ordre {p.display_order} · {p.tags.length} tags
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => startEdit(p)}
                  className="rounded-lg border border-edge px-4 py-1.5 text-sm transition hover:border-benin-bright hover:text-benin-bright"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(p)}
                  className="rounded-lg border border-edge px-4 py-1.5 text-sm transition hover:border-benin-red hover:text-benin-red"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
          {projects.length === 0 && <p className="text-fog">Aucun projet. Créez-en un !</p>}
        </div>
      )}
    </div>
  );
}
