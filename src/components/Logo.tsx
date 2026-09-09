import { useSiteText } from '../lib/siteText';

/** Logo terminal : `eudes@ejd:~$` avec curseur clignotant, ou image personnalisée. */
export default function Logo({ className = '' }: { className?: string }) {
  const t = useSiteText();
  const image = t('logo_image');
  const text = t('logo_text') || 'EJD';

  if (image) {
    return <img src={image} alt={text} className={`h-8 w-auto ${className}`} />;
  }
  return (
    <span className={`items-center font-mono text-base font-bold tracking-tight ${className}`}>
      <span className="text-benin-bright">~</span>
      <span className="text-fog">/</span>
      <span className="text-ink">{text}</span>
      <span className="ml-2 inline-block h-3.5 w-2 animate-pulse bg-benin-bright align-middle" aria-hidden />
    </span>
  );
}
