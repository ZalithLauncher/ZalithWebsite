import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface PageMetaOptions {
  title: string;
  description?: string;
}

const BRAND = 'Zalith Launcher';

/** Get or create a <meta> element. */
const ensureMeta = (key: string, attr: 'name' | 'property' = 'name') => {
  let meta = document.querySelector(`meta[${attr}="${key}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attr, key);
    document.head.appendChild(meta);
  }
  return meta;
};

export const usePageMeta = ({ title, description }: PageMetaOptions) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const fullTitle = title ? `${title} - ${BRAND}` : BRAND;
    document.title = fullTitle;

    if (description) {
      const meta = ensureMeta('description');
      meta.setAttribute('content', description);

      // Open Graph
      ensureMeta('og:title', 'property').setAttribute('content', fullTitle);
      ensureMeta('og:description', 'property').setAttribute('content', description);

      // Twitter Card
      ensureMeta('twitter:title').setAttribute('content', fullTitle);
      ensureMeta('twitter:description').setAttribute('content', description);
    }
  }, [title, description, i18n.language]);
};
