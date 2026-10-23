import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import BlogCard from '../components/blog/BlogCard';
import { getPostsByLang } from '../lib/blog';
import type { BlogPost } from '../types/blog';

const BlogListPage = () => {
  const { t, i18n } = useTranslation();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const langPosts = useMemo(() => getPostsByLang(i18n.language), [i18n.language]);

  const filteredPosts = useMemo(() => {
    let posts = langPosts;
    
    if (selectedTag) {
      posts = posts.filter((post) => post.tags.includes(selectedTag));
    }
    
    if (debouncedQuery) {
      const query = debouncedQuery.toLowerCase();
      posts = posts.filter((post) => 
        post.title.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return posts;
  }, [langPosts, selectedTag, debouncedQuery]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    langPosts.forEach((post) => {
      post.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, [langPosts]);

  return (
    <div className="pb-20 min-h-screen bg-[var(--bg)]/70 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm text-[var(--text-2)] hover:text-[var(--brand)] transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          {t('common.backToHome')}
        </Link>
        
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-[var(--text-1)]">{t('blog.title')}</h1>
        <p className="text-[var(--text-2)] mb-8 sm:mb-12">{t('blog.subtitle')}</p>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="glass-card p-4 lg:sticky lg:top-24">
              <div className="relative mb-6">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-2)]" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={t('blog.searchPlaceholder') || 'Search...'}
                  aria-label={t('blog.searchPlaceholder') || 'Search'}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--divider)]/30 text-sm text-[var(--text-1)] placeholder:text-[var(--text-2)]/60 focus:outline-none focus:border-[var(--brand)]/50 transition-colors"
                />
              </div>
              
              {allTags.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-1)] uppercase tracking-wider mb-3">
                    {t('blog.tags')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                        className={`px-3 py-1 rounded-full text-xs transition-colors ${
                          selectedTag === tag
                            ? 'bg-[var(--brand)] text-white'
                            : 'bg-[var(--bg)] text-[var(--text-2)] hover:text-[var(--text-1)]'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          <main className="flex-1">
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts.map((post: BlogPost) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <div className="glass-card p-12 text-center">
                <p className="text-[var(--text-2)]">{t('blog.noPosts')}</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default BlogListPage;
