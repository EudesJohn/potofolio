import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useSiteText } from '../lib/siteText';

const nav = [
  { to: '/a-propos', label: 'À propos' },
  { to: '/projets', label: 'Projets' },
  { to: '/competences', label: 'Compétences' },
  { to: '/contact', label: 'Contact' },
];

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5" aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 2.89-.39c.98 0 1.97.13 2.89.39 2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.26 5.66.41.36.78 1.06.78 2.14 0 1.54-.02 2.79-.02 3.17 0 .31.21.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5" aria-hidden>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5" aria-hidden>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}

export default function Footer() {
  const t = useSiteText();
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-edge bg-panel2/60">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Marque */}
          <div className="max-w-xs">
            <Link to="/" className="text-xl">
              <Logo />
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-fog">{t('footer_note')}</p>
          </div>

          {/* Navigation */}
          <nav aria-label="Pied de page">
            <p className="text-xs font-semibold uppercase tracking-widest text-fog/70">Navigation</p>
            <ul className="mt-4 space-y-2.5">
              {nav.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-fog transition-colors hover:text-benin-bright">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-fog/70">Contact</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href={`mailto:${t('contact_email')}`}
                  className="inline-flex items-center gap-2 text-fog transition-colors hover:text-benin-bright"
                >
                  <MailIcon />
                  {t('contact_email')}
                </a>
              </li>
              <li>
                <a
                  href={t('contact_github')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-fog transition-colors hover:text-benin-bright"
                >
                  <GithubIcon />
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={t('contact_linkedin')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-fog transition-colors hover:text-benin-bright"
                >
                  <LinkedinIcon />
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-edge/60 pt-6 text-xs text-fog/70 sm:flex-row">
          <p>
            © {year} Eudes Johnson DJOGO — Tous droits réservés
          </p>
          <p className="tabular-nums">{t('contact_location')}</p>
        </div>
      </div>
    </footer>
  );
}
