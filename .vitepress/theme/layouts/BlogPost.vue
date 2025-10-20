<template>
  <div class="blog-post">
    <!-- 返回文章列表按钮 -->
    <div class="back-to-list">
      <a :href="getBlogListUrl()" class="back-link">
        <span class="back-icon">←</span>
        {{ t('backToList') }}
      </a>
    </div>
    
    <!-- 文章头部信息 -->
    <div class="blog-post-header">
      <h1 class="blog-post-title">{{ frontmatter.title }}</h1>
      <div class="blog-post-meta">
        <!-- 作者信息（带图片和链接） -->
        <div class="meta-item author-info">
          <span class="meta-label">{{ t('author') }}:</span>
          <div class="author-content">
            <img 
              v-if="authorInfo.avatar" 
              :src="authorInfo.avatar" 
              :alt="authorInfo.name"
              class="author-avatar"
            />
            <a 
              v-if="authorInfo.link" 
              :href="authorInfo.link" 
              target="_blank" 
              rel="noopener noreferrer"
              class="author-link"
            >
              {{ authorInfo.name }}
            </a>
            <span v-else class="author-name">{{ authorInfo.name }}</span>
          </div>
        </div>
        
        <!-- 发布日期 -->
        <div class="meta-item">
          <span class="meta-label">{{ t('publishDate') }}:</span>
          <span class="meta-value">{{ formatDate(frontmatter.date) }}</span>
        </div>
        
        <!-- 标签 -->
        <div class="meta-item" v-if="frontmatter.tags && frontmatter.tags.length > 0">
          <span class="meta-label">{{ t('tags') }}:</span>
          <div class="tags">
            <span v-for="tag in frontmatter.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 文章内容 -->
    <div class="blog-post-content">
      <Content />
    </div>

    <!-- 文章底部信息 -->
    <div class="blog-post-footer">
      <div class="post-navigation">
        <div class="nav-item prev" v-if="prevPost">
          <span class="nav-label">{{ t('prevPost') }}:</span>
          <a :href="prevPost.url" class="nav-link">{{ prevPost.title }}</a>
        </div>
        <div class="nav-item next" v-if="nextPost">
          <span class="nav-label">{{ t('nextPost') }}:</span>
          <a :href="nextPost.url" class="nav-link">{{ nextPost.title }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useData } from 'vitepress'
import { computed } from 'vue'

const { frontmatter, page, theme, localePath } = useData()

// 获取当前语言（SSR安全）
const getCurrentLanguage = () => {
  // 使用多种SSR安全的方法检测当前语言
  // 1. 首先尝试使用page.value.path（最可靠）
  const path = page.value?.path || ''
  
  // 2. 如果page.path可用，优先使用它
  if (path && path.startsWith('/en/')) {
    return 'en'
  }
  
  // 3. 回退到localePath（需要检查是否存在）
  if (localePath && localePath.value && localePath.value === '/en/') {
    return 'en'
  }
  
  // 4. 最后检查window.location（仅在客户端可用）
  if (typeof window !== 'undefined' && window.location?.pathname?.startsWith('/en/')) {
    return 'en'
  }
  
  // 默认返回中文
  return 'zh-CN'
}

// 国际化翻译函数
const t = (key) => {
  const translations = {
    'zh-CN': {
      author: '作者',
      publishDate: '发布日期',
      tags: '标签',
      prevPost: '上一篇',
      nextPost: '下一篇',
      backToList: '返回文章列表'
    },
    'en': {
      author: 'Author',
      publishDate: 'Publish Date',
      tags: 'Tags',
      prevPost: 'Previous',
      nextPost: 'Next',
      backToList: 'Back to Blog List'
    }
  }
  
  // 根据当前语言环境获取翻译
  const currentLang = getCurrentLanguage()
  return translations[currentLang]?.[key] || key
}

// 获取作者信息
const authorInfo = computed(() => {
  const authorId = frontmatter.value?.author || page.value?.frontmatter?.author
  
  if (!authorId) return { name: 'Unknown', avatar: null, link: null }
  
  // 获取当前语言
  const currentLang = getCurrentLanguage()
  
  // 硬编码作者信息（临时解决方案）
  const authors = {
    'zh-CN': [
      { id: 'zalith_team', name: 'Zalith团队', link: 'https://github.com/ZalithLauncher', avatar: '/zl_icon.webp' },
      { id: 'lemwood', name: '柠枺', link: 'https://lemwood.cn', avatar: '/author/lemwood.webp' }
    ],
    'en': [
      { id: 'zalith_team', name: 'Zalith Team', link: 'https://github.com/ZalithLauncher', avatar: '/zl_icon.webp' },
      { id: 'lemwood', name: 'lemwood', link: 'https://lemwood.cn', avatar: '/author/lemwood.webp' }
    ]
  }
  
  const langAuthors = authors[currentLang] || []
  const author = langAuthors.find(a => a.id === authorId)
  
  if (author) {
    return {
      name: author.name || authorId,
      avatar: author.avatar || null,
      link: author.link || null
    }
  }
  
  // 如果没有找到配置，返回默认信息
  return { name: authorId, avatar: null, link: null }
})

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const currentLang = getCurrentLanguage()
  
  if (currentLang === 'en') {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 获取前后文章（简化实现）
const prevPost = computed(() => {
  // 这里可以扩展为动态获取前后文章
  return null
})

const nextPost = computed(() => {
  // 这里可以扩展为动态获取前后文章
  return null
})

// 获取博客列表页面URL
const getBlogListUrl = () => {
  const currentLang = getCurrentLanguage()
  if (currentLang === 'en') {
    return '/en/blog/'
  }
  return '/blog/'
}
</script>

<style scoped>
.back-to-list {
  margin-bottom: 1.5rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--vp-c-brand);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.5rem;
  background: var(--vp-c-bg-soft);
  transition: all 0.2s ease;
}

.back-link:hover {
  color: var(--vp-c-brand-dark);
  background: var(--vp-c-bg-soft-up);
  border-color: var(--vp-c-brand);
  text-decoration: none;
}

.back-icon {
  font-size: 1.1rem;
  font-weight: bold;
}

.blog-post {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.blog-post-header {
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 1.5rem;
  margin-bottom: 2rem;
}

.blog-post-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
}

.blog-post-meta {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.meta-item.author-info {
  align-items: flex-start;
}

.meta-label {
  font-weight: 600;
  color: var(--vp-c-text-2);
  min-width: 60px;
}

.meta-value {
  color: var(--vp-c-text-1);
}

.author-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--vp-c-divider);
}

.author-link {
  color: var(--vp-c-brand);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.author-link:hover {
  color: var(--vp-c-brand-dark);
  text-decoration: underline;
}

.author-name {
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  border: 1px solid var(--vp-c-divider);
}

.blog-post-content {
  line-height: 1.7;
  font-size: 1.1rem;
}

.blog-post-footer {
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 2rem;
  margin-top: 3rem;
}

.post-navigation {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
}

.nav-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-label {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

.nav-link {
  color: var(--vp-c-brand);
  text-decoration: none;
  font-weight: 500;
}

.nav-link:hover {
  color: var(--vp-c-brand-dark);
}

@media (max-width: 768px) {
  .blog-post {
    padding: 1rem 0.5rem;
  }
  
  .blog-post-title {
    font-size: 2rem;
  }
  
  .blog-post-meta {
    gap: 0.5rem;
  }
  
  .meta-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .post-navigation {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>