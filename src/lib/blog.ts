import blogIndexData from '../data/blog-index.json';
import type { BlogIndex, BlogPost } from '../types/blog';

export const blogIndex = blogIndexData as unknown as BlogIndex;

// 站点只构建英文：中文文章（content/blog/zh）仍保留在仓库中，但不会进入 blog-index。
// Only English posts are built; the Chinese posts under content/blog/zh are kept in the
// repository but are no longer part of the blog index.
export type BlogLang = 'en';

/** Blog 内容目前只支持英文。 */
export const resolveBlogLang = (): BlogLang => 'en';

/** 英文文章列表。 */
export const getPostsByLang = (): BlogPost[] => blogIndex.posts;

/** 按 slug 查找文章。 */
export const findPost = (slug: string | undefined): BlogPost | undefined =>
  blogIndex.posts.find((p) => p.slug === slug);
