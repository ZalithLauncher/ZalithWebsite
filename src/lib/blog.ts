import blogIndexData from '../data/blog-index.json';
import type { BlogIndex, BlogPost } from '../types/blog';

export const blogIndex = blogIndexData as unknown as BlogIndex;

export type BlogLang = 'zh' | 'en';

/**
 * 将 i18n 检测到的原始语言码（如 zh-CN、zh-TW、en-US）
 * 归一化为博客内容支持的基础语言（zh / en）。
 */
export const resolveBlogLang = (language: string): BlogLang =>
  language.toLowerCase().startsWith('zh') ? 'zh' : 'en';

/** 当前语言的文章列表；该语言无文章时回退到全部文章。 */
export const getPostsByLang = (language: string): BlogPost[] => {
  const lang = resolveBlogLang(language);
  const posts = blogIndex.posts.filter((p) => p.lang === lang);
  return posts.length > 0 ? posts : blogIndex.posts;
};

/** 按 slug 查找文章，优先匹配当前语言版本。 */
export const findPost = (slug: string | undefined, language: string): BlogPost | undefined => {
  const lang = resolveBlogLang(language);
  return (
    blogIndex.posts.find((p) => p.slug === slug && p.lang === lang) ||
    blogIndex.posts.find((p) => p.slug === slug)
  );
};
