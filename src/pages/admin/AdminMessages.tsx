import { useEffect, useState } from 'react';
import { getMessages, markMessageRead, deleteMessage, type Message } from '../../lib/api';

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    try {
      setMessages(await getMessages());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleRead(m: Message) {
    await markMessageRead(m.id, !m.is_read);
    await load();
  }

  async function handleDelete(m: Message) {
    if (!confirm(`Supprimer le message de ${m.name} ?`)) return;
    await deleteMessage(m.id);
    await load();
  }

  const unread = messages.filter(m => !m.is_read).length;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Messages</h1>
      <p className="mt-1 text-sm text-fog">
        {unread > 0 ? `${unread} message${unread > 1 ? 's' : ''} non lu${unread > 1 ? 's' : ''}.` : 'Tous les messages sont lus.'}
      </p>

      {error && (
        <p className="mt-6 rounded-xl border border-benin-red/40 bg-benin-red/10 p-3 text-sm text-benin-red">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-8 animate-pulse text-fog">Chargement…</p>
      ) : (
        <div className="mt-6 space-y-3">
          {messages.map(m => (
            <article
              key={m.id}
              className={`rounded-2xl border bg-panel p-5 ${
                m.is_read ? 'border-edge' : 'border-benin-bright/50'
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display font-semibold">{m.subject}</h3>
                {!m.is_read && (
                  <span className="rounded-full bg-benin-bright/15 px-2 py-0.5 text-xs text-benin-bright">
                    nouveau
                  </span>
                )}
                <span className="ml-auto text-xs text-fog/70">
                  {new Date(m.created_at).toLocaleString('fr-FR')}
                </span>
              </div>
              <p className="mt-1 text-sm text-fog">
                {m.name} ·{' '}
                <a href={`mailto:${m.email}`} className="text-benin-bright hover:underline">
                  {m.email}
                </a>
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm text-ink/90">{m.body}</p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => toggleRead(m)}
                  className="rounded-lg border border-edge px-4 py-1.5 text-sm transition hover:border-benin-bright hover:text-benin-bright"
                >
                  Marquer comme {m.is_read ? 'non lu' : 'lu'}
                </button>
                <button
                  onClick={() => handleDelete(m)}
                  className="rounded-lg border border-edge px-4 py-1.5 text-sm transition hover:border-benin-red hover:text-benin-red"
                >
                  Supprimer
                </button>
              </div>
            </article>
          ))}
          {messages.length === 0 && (
            <p className="text-fog">Aucun message reçu pour le moment.</p>
          )}
        </div>
      )}
    </div>
  );
}
