import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface PageMetaOptions {
  title: string;
  description?: string;
}

export const usePageMeta = ({ title, description }: PageMetaOptions) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const suffix = i18n.language.startsWith('zh')
      ? 'Zalith Launcher'
      : 'Zalith Launcher';
    document.title = title ? `${title} - ${suffix}` : suffix;

    if (description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute('content', description);
      }
    }
  }, [title, description, i18n.language]);
};
