import { useState, type FormEvent } from 'react';
import { sendMessage } from '../lib/api';
import { useSiteText } from '../lib/siteText';
import Reveal from '../components/Reveal';

export default function Contact() {
  const t = useSiteText();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      await sendMessage({
        name,
        email,
        subject: subject || 'Message du portfolio',
        body,
      });
      setStatus('sent');
      setName('');
      setEmail('');
      setSubject('');
      setBody('');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Une erreur est survenue.');
    }
  }

  const inputCls =
    'field w-full rounded-xl border border-edge bg-panel2 px-4 py-3 text-sm text-ink outline-none placeholder:text-fog/50';

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-widest text-benin-bright">Contact</p>
        <h1 className="gradient-text mt-2 font-display text-4xl font-bold">{t('cta_title')}</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-fog">
          Stage, mission de maintenance, projet web, collaboration sur l'IA appliquée aux langues
          locales ? Laissez-moi un message — je réponds rapidement.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <div className="space-y-4">
            <a
              href={`mailto:${t('contact_email')}`}
              className="glow-card block rounded-2xl border border-edge bg-panel p-5"
            >
              <b className="font-display">Email</b>
              <p className="mt-1 break-all text-sm text-fog">{t('contact_email')}</p>
            </a>
            <a
              href={t('contact_github')}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-card arrow-link block rounded-2xl border border-edge bg-panel p-5"
            >
              <b className="font-display">GitHub</b>
              <p className="mt-1 text-sm text-fog">
                {t('contact_github').replace('https://', '')}
              </p>
            </a>
            <a
              href={t('contact_linkedin')}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-card block rounded-2xl border border-edge bg-panel p-5"
            >
              <b className="font-display">LinkedIn</b>
              <p className="mt-1 break-all text-sm text-fog">
                {t('contact_linkedin').replace('https://www.linkedin.com/in/', '')}
              </p>
            </a>
            <div className="rounded-2xl border border-edge bg-panel p-5">
              <b className="font-display">Localisation</b>
              <p className="mt-1 text-sm text-fog">{t('contact_location')}</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          {status === 'sent' ? (
            <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-benin-green/40 bg-benin-green/10 p-10 text-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-benin-bright" aria-hidden>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <h2 className="mt-4 font-display text-xl font-semibold">Message envoyé</h2>
              <p className="mt-2 text-sm text-fog">Merci, je vous répondrai très vite.</p>
              <button
                onClick={() => setStatus('idle')}
                className="btn-primary mt-6 rounded-xl border border-edge px-5 py-2 text-sm"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Votre nom"
                  className={inputCls}
                />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Votre email"
                  className={inputCls}
                />
              </div>
              <input
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Sujet (optionnel)"
                className={inputCls}
              />
              <textarea
                required
                rows={6}
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder="Votre message…"
                className={`${inputCls} resize-y`}
              />
              {status === 'error' && (
                <p className="rounded-xl border border-benin-red/40 bg-benin-red/10 p-3 text-sm text-benin-red">
                  Erreur : {errorMsg}
                </p>
              )}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn-primary w-full rounded-xl bg-benin-green px-6 py-3 font-mono font-semibold text-night shadow-lg shadow-benin-green/25 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === 'sending' ? 'Envoi…' : 'Envoyer le message'}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </div>
  );
}
