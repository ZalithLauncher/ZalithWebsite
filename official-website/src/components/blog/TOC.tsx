import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { TOCItem } from '../../types/blog';

interface TOCProps {
  items: TOCItem[];
}

const TOC = ({ items }: TOCProps) => {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState<string>('');

  const scrollToHeading = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0% -80% 0%',
        threshold: 0,
      }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <h4 className="text-sm font-bold text-[var(--text-1)] uppercase tracking-wider mb-4">
        {t('blog.toc')}
      </h4>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => scrollToHeading(item.id)}
              className={`w-full text-left text-sm py-1 px-2 rounded transition-colors ${
                item.level === 3 ? 'pl-4' : ''
              } ${
                activeId === item.id
                  ? 'text-[var(--brand)] bg-[var(--brand)]/10'
                  : 'text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--bg-alt)]'
              }`}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TOC;
