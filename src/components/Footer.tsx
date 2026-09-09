import { useSiteText } from '../lib/siteText';

export default function Footer() {
  const t = useSiteText();
  return (
    <footer className="border-t border-edge py-8 text-center text-sm text-fog">
      <p>
        © {new Date().getFullYear()} Eudes Johnson DJOGO — {t('footer_note')}
      </p>
    </footer>
  );
}
