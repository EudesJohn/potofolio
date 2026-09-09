import { useSiteText } from '../lib/siteText';

/** Logo du site : image personnalisée si définie, sinon le texte (réglages admin). */
export default function Logo({ className = '' }: { className?: string }) {
  const t = useSiteText();
  const image = t('logo_image');
  const text = t('logo_text') || 'EJD';

  if (image) {
    return <img src={image} alt={text} className={`h-8 w-auto ${className}`} />;
  }
  return (
    <span className={`font-display font-bold tracking-tight ${className}`}>
      {text}
      <span className="text-benin-bright">.</span>
    </span>
  );
}
