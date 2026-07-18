export interface Author {
  id?: string;
  name: string;
  title?: string;
  url?: string;
  image_url?: string;
  socials?: Record<string, string>;
}

export interface BlogPostFrontmatter {
  title: string;
  slug: string;
  date: string;
  authors: string[];
  tags: string[];
  category: string;
  description: string;
  image?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  authors: Author[];
  tags: string[];
  category: string;
  description: string;
  image?: string;
  content: string;
  excerpt: string;
  readingTime: number;
  lang: string;
}

export interface BlogIndex {
  posts: BlogPost[];
  authors: Record<string, Author>;
  categories: string[];
  tags: string[];
}

export interface BuildInfo {
  commitHash: string;
  commitDate: string;
  branch: string;
  buildTime: string;
  repoUrl: string;
}

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}
