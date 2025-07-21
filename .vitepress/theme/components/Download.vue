<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { marked, type MarkedOptions } from 'marked' // 从marked v4+开始支持具名导出

/*
  由于VitePress并不会解析该组件的latestRelease.body内容，故单独引入marked库解析为HTML后返回至页面
*/

const latestRelease = ref<any>(null)
const isLoading = ref(false)
const parsedBody = ref('')

// 获取最新版本
async function fetchLatestRelease() {
  isLoading.value = true
  try {
    const response = await fetch('https://gayhub.lemwood.cn/repos/ZalithLauncher/ZalithLauncher/releases/latest')
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    latestRelease.value = data
    // 显式等待marked解析完成
    parsedBody.value = data.body ? await marked.parse(data.body) : ''
  } catch (error) {
    console.error('Error fetching latest release:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchLatestRelease()
})

// 按规则拼接镜像加速链接
function generateMirrorUrl(assetName: string, tagName: string) {
  const version = tagName.replace('v', '').replace(/\./g, '')
  return `https://download.fishcpy.top/dl/zl/${version}/${assetName}`
}

// GitHub下载链接
function getOriginalGitHubUrl(asset: any) {
  return asset.browser_download_url
}
</script>

<template>
  <div>
    <h2>官方下载渠道</h2>
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
    </div>
    <div v-else-if="latestRelease">
      <p>最新版本: {{ latestRelease.tag_name }}</p>
      <p>{{ latestRelease.name }}</p>
      <div class="markdown-content" v-html="parsedBody"></div>
      <div class="download-container">
        <h3>官方 GitHub 下载</h3>
        <a
          v-for="asset in latestRelease.assets"
          :key="asset.id"
          :href="getOriginalGitHubUrl(asset)"
          class="download-button official"
        >
          <span class="download-icon">⬇️</span>
          <span class="download-text">下载 {{ asset.name }} (官方)</span>
        </a>
        <h3>第三方镜像加速下载</h3>
        <a
          v-for="asset in latestRelease.assets"
          :key="asset.id + '-mirror'"
          :href="generateMirrorUrl(asset.name, latestRelease.tag_name)"
          class="download-button mirror"
        >
          <span class="download-icon">⬇️</span>
          <span class="download-text">下载 {{ asset.name }} (加速)</span>
        </a>
      </div>
      <p>镜像加速由<a href="https://github.com/fishcpy">咬一口的鱼py(fishcpy)</a>友情提供</p>
    </div>
    <div v-else>
      <p>加载失败，请稍后重试</p>
    </div>
  </div>
</template>

<style scoped>
.download-container {
  text-align: center;
  margin: 30px 0;
}

.download-button {
  display: inline-block;
  color: white;
  padding: 12px 24px;
  text-align: center;
  text-decoration: none !important;
  font-size: 18px;
  border-radius: 4px;
  transition: background-color 0.3s;
  margin: 10px;
}

.download-button.official {
  background-color: rgba(56, 190, 150, 0.38);
}

.download-button.mirror {
  background-color: rgba(46, 187, 206, 0.38);
}

.download-button.official:hover {
  background-color: rgba(56, 190, 150, 0.5);
}

.download-button.mirror:hover {
  background-color: rgba(46, 187, 206, 0.5);
}

.download-icon {
  font-size: 20px;
  margin-right: 10px;
}

.download-text {
  vertical-align: middle;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #38be96;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.markdown-content {
  line-height: 1.6;
  font-size: 16px;
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3) {
  margin: 1em 0 0.5em;
}

.markdown-content :deep(p) {
  margin: 0.5em 0;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 0.5em 0;
  padding-left: 2em;
}

.markdown-content :deep(a) {
  color: #38be96;
  text-decoration: none;
}

.markdown-content :deep(a:hover) {
  text-decoration: underline;
}
</style>