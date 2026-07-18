import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import AuthorCard from '../components/blog/AuthorCard';
import TOC from '../components/blog/TOC';
import RelatedPosts from '../components/blog/RelatedPosts';
import blogIndexData from '../data/blog-index.json';
import type { BlogIndex, TOCItem } from '../types/blog';

const blogIndex: BlogIndex = blogIndexData as unknown as BlogIndex;

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const [buildInfo, setBuildInfo] = useState<{ buildTime: string } | null>(null);

  useEffect(() => {
    fetch('/build-info.json')
      .then((res) => res.json())
      .then(setBuildInfo)
      .catch(() => {});
  }, []);

  const post = useMemo(() => {
    return blogIndex.posts.find(
      (p) => p.slug === slug && p.lang === i18n.language
    ) || blogIndex.posts.find((p) => p.slug === slug);
  }, [slug, i18n.language]);

  const tocItems = useMemo((): TOCItem[] => {
    if (!post) return [];
    
    const headingRegex = /<h([2-3]) id="([^"]+)">([^<]+)<\/h\1>/g;
    const items: TOCItem[] = [];
    let match;
    
    while ((match = headingRegex.exec(post.content)) !== null) {
      items.push({
        level: parseInt(match[1]),
        id: match[2],
        text: match[3],
      });
    }
    
    return items;
  }, [post]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <div className="pb-20 min-h-screen bg-[var(--bg)]/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-[var(--text-2)] hover:text-[var(--brand)] transition-colors mb-8"
          >
            <ArrowLeft size={18} />
            {t('common.backToHome')}
          </Link>
          <div className="glass-card p-12 text-center">
            <p className="text-[var(--text-2)]">{t('blog.notFound')}</p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(i18n.language === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="pb-20 min-h-screen bg-[var(--bg)]/70 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-[var(--text-2)] hover:text-[var(--brand)] transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          {t('blog.backToList')}
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          <article className="flex-1 min-w-0">
            {post.image && (
              <div className="relative h-64 md:h-96 -mx-4 sm:-mx-6 lg:-mx-8 mb-8 overflow-hidden rounded-2xl">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent" />
              </div>
            )}

            <header className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-[var(--brand)]/10 text-[var(--brand)]"
                  >
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-1)] mb-4">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-2)]">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {formatDate(post.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {t('blog.readingTime', { minutes: post.readingTime })}
                </span>
              </div>

              {post.authors.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-[var(--divider)]/20">
                  {post.authors.map((author) => (
                    <AuthorCard key={author.id} author={author} size="md" />
                  ))}
                </div>
              )}
            </header>

            <div 
              className="prose-custom max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {buildInfo && (
              <div className="mt-12 pt-6 border-t border-[var(--divider)]/20 text-xs text-[var(--text-2)] opacity-60">
                {t('blog.lastBuild')}: {new Date(buildInfo.buildTime).toLocaleString()}
              </div>
            )}
          </article>

          {tocItems.length > 0 && (
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <TOC items={tocItems} />
            </aside>
          )}
        </div>

        <RelatedPosts posts={blogIndex.posts} currentSlug={post.slug} />
      </div>
    </div>
  );
};

export default BlogPostPage;
