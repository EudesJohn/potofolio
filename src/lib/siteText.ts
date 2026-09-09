import { useEffect, useState } from 'react';
import { getSiteSettings } from './api';

/** Valeurs par défaut, utilisées si la clé n'existe pas encore en base. */
export const SITE_TEXT_DEFAULTS: Record<string, string> = {
  home_badge: 'Disponible pour collaborations · Cotonou / Lokossa, Bénin',
  hero_title: "Eudes Johnson\nDJOGO.",
  hero_subtitle: 'Technicien de maintenance biomédicale & Entrepreneur digital',
  cta_title: 'Travaillons ensemble',
  footer_note: 'Cotonou / Lokossa, Bénin',
  contact_email: 'eudesjohn650@gmail.com',
  contact_github: 'https://github.com/EudesJohn',
  contact_linkedin: 'https://www.linkedin.com/in/eudes-johnson-djogo-15a316397',
  contact_location: 'Cotonou / Lokossa, Bénin',
  logo_text: 'EJD',
  logo_image: '',
  hero_slides: '["/bg/slide-1.svg","/bg/slide-2.svg","/bg/slide-3.svg","/bg/slide-4.svg"]',
};

let cache: Record<string, string> | null = null;

/**
 * Hook des textes éditables du site.
 * `t('cle')` renvoie la valeur en base, sinon la valeur par défaut.
 */
export function useSiteText() {
  const [texts, setTexts] = useState<Record<string, string>>(cache ?? {});

  useEffect(() => {
    if (cache) return;
    getSiteSettings()
      .then(s => {
        cache = s;
        setTexts(s);
      })
      .catch(() => {
        /* silencieux : les défauts suffisent */
      });
  }, []);

  return (key: string): string => texts[key] ?? SITE_TEXT_DEFAULTS[key] ?? '';
}
