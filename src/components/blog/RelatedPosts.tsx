import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { BlogPost } from '../../types/blog';
import BlogCard from './BlogCard';

interface RelatedPostsProps {
  posts: BlogPost[];
  currentSlug: string;
}

const RelatedPosts = ({ posts, currentSlug }: RelatedPostsProps) => {
  const { t } = useTranslation();
  
  const filteredPosts = posts
    .filter((post) => post.slug !== currentSlug)
    .slice(0, 3);

  if (filteredPosts.length === 0) return null;

  return (
    <div className="mt-16 pt-12 border-t border-[var(--divider)]/20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-[var(--text-1)]">
          {t('blog.relatedPosts')}
        </h2>
        <Link 
          to="/blog"
          className="inline-flex items-center gap-1 text-sm text-[var(--brand)] hover:underline"
        >
          {t('blog.allPosts')}
          <ArrowRight size={14} />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;
