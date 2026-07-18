import { Link } from 'react-router-dom';
import { Calendar, Clock, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { BlogPost } from '../../types/blog';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  const { t, i18n } = useTranslation();
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(i18n.language === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Link 
      to={`/blog/${post.slug}`}
      className="group block glass-card overflow-hidden hover:shadow-xl hover:shadow-[var(--brand)]/10 transition-all duration-300"
    >
      {post.image && (
        <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent" />
        </div>
      )}
      
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-[var(--brand)]/10 text-[var(--brand)]"
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>
        
        <h3 className="text-xl font-bold text-[var(--text-1)] group-hover:text-[var(--brand)] transition-colors line-clamp-2">
          {post.title}
        </h3>
        
        <p className="text-[var(--text-2)] text-sm line-clamp-2">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between pt-2 border-t border-[var(--divider)]/20">
          <div className="flex items-center gap-2">
            {post.authors[0] && (
              <>
                {post.authors[0].image_url ? (
                  <img 
                    src={post.authors[0].image_url} 
                    alt={post.authors[0].name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[var(--brand)]/20 flex items-center justify-center text-xs text-[var(--brand)]">
                    {post.authors[0].name[0]}
                  </div>
                )}
                <span className="text-sm text-[var(--text-2)]">{post.authors[0].name}</span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-xs text-[var(--text-2)]">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {t('blog.readingTime', { minutes: post.readingTime })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
