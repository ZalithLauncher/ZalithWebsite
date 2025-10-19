import { createContentLoader, type ContentData } from 'vitepress'

// 加载博客文章数据
export const data = createContentLoader(['/blog/*.md', '/en/blog/*.md'], {
  includeSrc: false,
  render: true,
  excerpt: true,
  transform(rawData): ContentData[] {
    return rawData
      .filter(item => !item.url.endsWith('/index'))
      .map(item => ({
        ...item,
        frontmatter: {
          ...item.frontmatter,
          date: item.frontmatter.date ? new Date(item.frontmatter.date).toISOString() : new Date().toISOString()
        }
      }))
      .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())
  }
})