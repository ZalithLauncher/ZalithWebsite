---
layout: home
---

<script setup>
import { useData } from 'vitepress'
import { computed } from 'vue'

// 使用VitePress的数据钩子获取所有页面数据
const { theme } = useData()

// 动态获取博客文章数据
const posts = computed(() => {
  // 临时使用静态数据，确保页面正常显示
  return [
    {
      url: '/blog/1',
      frontmatter: {
        title: '播客功能开发',
        date: '2025-10-19',
        author: 'lemwood',
        tags: ['发布', '新功能', '开发日志'],
        description: '这是一项测试中的功能，欢迎测试并提供反馈。'
      },
      excerpt: '这是一项测试中的功能，欢迎测试并提供反馈。'
    }
  ].sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))
})

// 作者信息映射
const authorMap = {
  'zalith_team': { name: 'Zalith团队', avatar: '/zl_icon.webp', link: 'https://github.com/ZalithLauncher' },
  'lemwood': { name: '柠枺', avatar: '/author/lemwood.webp', link: 'https://lemwood.cn' },
}

// 根据作者ID获取作者信息
function getAuthorInfo(authorId) {
  return authorMap[authorId] || { name: '未知作者', avatar: '/zl_icon.webp', link: '#' }
}

// 格式化日期
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

# 博客

欢迎来到 Zalith Launcher 官方博客！这里我们会分享最新的开发进展、技术文章和社区动态。

<div class="blog-posts">
  <div v-for="post in posts" :key="post.url" class="blog-post-card">
    <a :href="post.url" class="post-link">
      <h2>{{ post.frontmatter.title }}</h2>
      <div class="post-meta">
        <span class="post-date">{{ formatDate(post.frontmatter.date) }}</span>
        <span class="post-author">
          <img :src="getAuthorInfo(post.frontmatter.author).avatar" :alt="getAuthorInfo(post.frontmatter.author).name" class="author-avatar" />
          {{ getAuthorInfo(post.frontmatter.author).name }}
        </span>
      </div>
      <p class="post-excerpt">{{ post.frontmatter.description || post.excerpt }}</p>
      <div class="post-tags">
        <span v-for="tag in post.frontmatter.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </a>
  </div>
</div>

<style scoped>
.blog-posts {
  display: grid;
  gap: 2rem;
  margin-top: 2rem;
}

.blog-post-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.blog-post-card:hover {
  border-color: var(--vp-c-brand);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.post-link {
  text-decoration: none;
  color: inherit;
}

.post-link h2 {
  margin: 0 0 1rem 0;
  color: var(--vp-c-text-1);
  font-size: 1.5rem;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.post-date {
  font-weight: 500;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.post-excerpt {
  margin: 0 0 1rem 0;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.post-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-2);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .blog-post-card {
    padding: 1rem;
  }
  
  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>