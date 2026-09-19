import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface PageMetaOptions {
  title: string;
  description?: string;
}

const BRAND = 'Zalith Launcher';
const SITE_URL = 'https://zalithlauncher.cn';
const SITE_IMAGE = `${SITE_URL}/zl_icon.webp`;

/** Get or create a <meta> element. */
const ensureMeta = (key: string, attr: 'name' | 'property' | 'itemprop' = 'name') => {
  let meta = document.querySelector(`meta[${attr}="${key}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attr, key);
    document.head.appendChild(meta);
  }
  return meta;
};

/** Get or create a <link rel> element in <head>. */
const ensureLink = (rel: string) => {
  let link = document.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  return link;
};

export const usePageMeta = ({ title, description }: PageMetaOptions) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const fullTitle = title ? `${title} - ${BRAND}` : BRAND;
    document.title = fullTitle;

    const canonicalUrl = SITE_URL + window.location.pathname;

    // Canonical & og:url
    ensureLink('canonical').setAttribute('href', canonicalUrl);
    ensureMeta('og:url', 'property').setAttribute('content', canonicalUrl);

    if (description) {
      const meta = ensureMeta('description');
      meta.setAttribute('content', description);

      // Open Graph
      ensureMeta('og:title', 'property').setAttribute('content', fullTitle);
      ensureMeta('og:description', 'property').setAttribute('content', description);
      ensureMeta('og:image', 'property').setAttribute('content', SITE_IMAGE);

      // Twitter Card
      ensureMeta('twitter:title').setAttribute('content', fullTitle);
      ensureMeta('twitter:description').setAttribute('content', description);

      // QQ share card (itemprop)
      ensureMeta('name', 'itemprop').setAttribute('content', fullTitle);
      ensureMeta('image', 'itemprop').setAttribute('content', SITE_IMAGE);
      ensureMeta('description', 'itemprop').setAttribute('content', description);
    }
  }, [title, description, i18n.language]);
};
