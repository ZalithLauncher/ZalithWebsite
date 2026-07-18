import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft, Tag, Search } from 'lucide-react';
import BlogCard from '../components/blog/BlogCard';
import type { BlogPost, BlogIndex } from '../types/blog';
import blogIndexData from '../data/blog-index.json';

const blogIndex: BlogIndex = blogIndexData;

const BlogListPage = () => {
  const { t, i18n } = useTranslation();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    let posts = blogIndex.posts.filter((post) => post.lang === i18n.language);
    
    if (selectedTag) {
      posts = posts.filter((post) => post.tags.includes(selectedTag));
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }
    
    return posts;
  }, [i18n.language, selectedTag, searchQuery]);

  const tags = blogIndex.tags;

  return (
    <div className="pb-20 min-h-screen bg-[var(--bg)]/70 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-[var(--text-2)] hover:text-[var(--brand)] transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          {t('common.backToHome')}
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-1)] mb-4">
            {t('blog.title')}
          </h1>
          <p className="text-lg text-[var(--text-2)] max-w-2xl">
            {t('blog.subtitle')}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0 space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="glass-card p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-2)]" size={18} />
                <input
                  type="text"
                  placeholder={t('blog.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[var(--bg-alt)] border border-[var(--divider)]/30 rounded-lg text-[var(--text-1)] placeholder:text-[var(--text-2)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/50"
                />
              </div>
            </div>

            {tags.length > 0 && (
              <div className="glass-card p-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-[var(--text-1)] uppercase tracking-wider mb-3">
                  <Tag size={14} />
                  {t('blog.tags')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                      className={`px-2 py-1 text-xs rounded-full transition-colors ${
                        selectedTag === tag
                          ? 'bg-[var(--brand)] text-white'
                          : 'bg-[var(--bg-alt)] text-[var(--text-2)] hover:bg-[var(--brand)]/10 hover:text-[var(--brand)]'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
