---
layout: home
---

<script setup>
import { useData } from 'vitepress'
import { computed } from 'vue'

// Use VitePress data hook to get all page data
const { theme } = useData()

// Dynamically get blog posts data
const posts = computed(() => {
  // Temporary static data to ensure page displays correctly
  return [
    {
      url: '/en/blog/1',
      frontmatter: {
        title: 'blog Functional Testing',
        date: '2025-01-15',
        author: 'lemwood',
        tags: ['Testing', 'Functional'],
        description: 'Functional testing of the Zalith Launcher blog.'
      },
      excerpt: 'Functional testing of the Zalith Launcher blog.'
    }
  ].sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))
})

// Author information mapping
const authorMap = {
  'zalith_team': { name: 'Zalith Team', avatar: '/zl_icon.webp', link: 'https://github.com/ZalithLauncher' },
  'lemwood': { name: 'lemwood', avatar: '/author/lemwood.webp', link: 'https://lemwood.cn' },
}

// Get author info by ID
function getAuthorInfo(authorId) {
  return authorMap[authorId] || { name: 'Unknown Author', avatar: '/zl_icon.webp', link: '#' }
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

# Blog

Welcome to the Zalith Launcher official blog! Here we share the latest development progress, technical articles, and community updates.

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