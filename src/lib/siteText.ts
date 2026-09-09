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
  about_title: 'Entre atelier de maintenance\net création numérique',
  about_paragraphs:
    "**Technicien de maintenance biomédicale**, je m'intéresse de près à la sécurité électrique des équipements médicaux et aux normes qui les encadrent, comme la **CEI 62353** — un sujet au cœur de mon mémoire, porté par un prototype ESP32.\n\nEn parallèle, je suis **entrepreneur digital** : je conçois des produits web complets, des plateformes éducatives, des funnels de vente et des contenus — en restant attaché à ma culture béninoise, que j'explore aussi à travers des projets technologiques comme la traduction **français–fon**.\n\nCurieux de philosophie et défenseur d'une identité culturelle forte, je crois qu'un bon technicien, comme un bon entrepreneur, doit comprendre les systèmes avant de les réparer ou de les construire.\n\nCôté outils, je travaille malin sur une machine modeste (Intel i7-7500U, 16 Go RAM) : **Claude Code** dans VS Code au quotidien, comparé à Codex CLI, et des modèles locaux via **Ollama** (Gemma4:e2b, Qwen2.5-Coder:3b) — la preuve qu'on n'a pas besoin d'un matériel coûteux pour construire des choses sérieuses.",
  about_facts:
    'Formation : | 3ᵉ année MSI — INSTI Lokossa (Bénin)\nDiplômes : | Baccalauréat F3 · CAP\nSpécialité : | Maintenance biomédicale\nActivité : | Entrepreneur digital\nBase : | Cotonou / Lokossa, Bénin\nCentres d’intérêt : | Philosophie · Culture béninoise',
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
