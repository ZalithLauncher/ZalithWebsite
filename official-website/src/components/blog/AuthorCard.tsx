import { ExternalLink } from 'lucide-react';
import GithubIcon from '../icons/GithubIcon';
import type { Author } from '../../types/blog';

interface AuthorCardProps {
  author: Author;
  size?: 'sm' | 'md' | 'lg';
}

const AuthorCard = ({ author, size = 'md' }: AuthorCardProps) => {
  const sizeClasses = {
    sm: {
      avatar: 'w-8 h-8',
      name: 'text-sm font-medium',
      title: 'text-xs',
    },
    md: {
      avatar: 'w-12 h-12',
      name: 'text-base font-bold',
      title: 'text-sm',
    },
    lg: {
      avatar: 'w-16 h-16',
      name: 'text-lg font-bold',
      title: 'text-sm',
    },
  };

  const classes = sizeClasses[size];

  return (
    <div className="flex items-center gap-3">
      {author.image_url ? (
        <img 
          src={author.image_url} 
          alt={author.name}
          className={`${classes.avatar} rounded-full object-cover ring-2 ring-[var(--divider)]/30`}
        />
      ) : (
        <div className={`${classes.avatar} rounded-full bg-[var(--brand)]/20 flex items-center justify-center text-[var(--brand)] font-bold`}>
          {author.name[0].toUpperCase()}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`${classes.name} text-[var(--text-1)] truncate`}>
            {author.name}
          </span>
          {author.url && (
            <a 
              href={author.url}
              target="_blank"
              rel="noreferrer"
              className="text-[var(--text-2)] hover:text-[var(--brand)] transition-colors"
            >
              {author.socials?.github ? <GithubIcon size={14} /> : <ExternalLink size={14} />}
            </a>
          )}
        </div>
        {author.title && (
          <p className={`${classes.title} text-[var(--text-2)]`}>{author.title}</p>
        )}
      </div>
    </div>
  );
};

export default AuthorCard;
