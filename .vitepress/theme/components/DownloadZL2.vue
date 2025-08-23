<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { marked, type MarkedOptions } from 'marked'

/*
  ZalithLauncher2专用下载组件
  基于原Download组件修改，指向ZL2仓库
*/

interface DeviceType {
  id: string
  name: string
  icon: string
  description: string
  patterns: string[]
}

interface DownloadSource {
  id: string
  name: string
  description: string
  speed: string
  contributor?: {
    name: string
    url: string
  }
}

const latestRelease = ref<any>(null)
const isLoading = ref(false)
const hasError = ref(false)
const errorMessage = ref('')
const parsedBody = ref('')
const selectedDeviceType = ref('all')
const selectedDownloadSource = ref('github')
const isDeviceDropdownOpen = ref(false)
const isSourceDropdownOpen = ref(false)

// 基础设备类型定义
const baseDeviceTypes: DeviceType[] = [
  { 
    id: 'all', 
    name: '全部文件', 
    icon: '', 
    description: '显示所有下载文件',
    patterns: ['*']
  },
  { 
    id: 'windows', 
    name: 'Windows', 
    icon: '', 
    description: 'Windows 电脑',
    patterns: ['windows', 'win', '.exe', '.msi']
  },
  { 
    id: 'macos', 
    name: 'macOS', 
    icon: '', 
    description: 'Mac 电脑',
    patterns: ['macos', 'mac', 'darwin', '.dmg']
  },
  { 
    id: 'linux', 
    name: 'Linux', 
    icon: '', 
    description: 'Linux 系统',
    patterns: ['linux', '.appimage', '.deb', '.rpm', '.tar.gz']
  },
  { 
    id: 'android', 
    name: 'Android', 
    icon: '', 
    description: 'Android 设备',
    patterns: ['android', '.apk']
  }
]

// 下载源定义（ZL2暂时只支持GitHub官方）
const downloadSources: DownloadSource[] = [
  { id: 'github', name: 'GitHub 官方', description: '官方发布渠道', speed: '海外较快' }
]

// 动态设备类型（基于API返回的文件）
const dynamicDeviceTypes = computed(() => {
  if (!latestRelease.value?.assets) return baseDeviceTypes

  const assets = latestRelease.value.assets
  const detectedTypes = new Set<string>()
  
  // 分析文件名，提取设备类型
  assets.forEach((asset: any) => {
    const fileName = asset.name.toLowerCase()
    
    baseDeviceTypes.forEach(type => {
      if (type.id !== 'all' && type.patterns.some(pattern => 
        pattern === '*' || fileName.includes(pattern.toLowerCase())
      )) {
        detectedTypes.add(type.id)
      }
    })
  })

  // 构建动态设备类型列表
  const result = [baseDeviceTypes[0]] // 始终包含 "全部文件"
  
  // 添加检测到的基础平台类型
  baseDeviceTypes.slice(1).forEach(type => {
    if (detectedTypes.has(type.id)) {
      result.push(type)
    }
  })
  
  return result
})

// 自动检测用户设备类型
function detectUserDeviceType(): string {
  const userAgent = navigator.userAgent.toLowerCase()
  
  if (/android/.test(userAgent)) {
    return 'android'
  } else if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'ios'
  } else if (/mac/.test(userAgent)) {
    return 'macos'
  } else if (/win/.test(userAgent)) {
    return 'windows'
  } else if (/linux/.test(userAgent)) {
    return 'linux'
  }
  
  return 'all' // 默认显示全部
}

// ZL2 API配置
const API_CONFIGS = [
  {
    name: '代理API',
    url: 'https://gayhub.lemwood.cn/repos/ZalithLauncher/ZalithLauncher2/releases/latest',
    timeout: 5000
  },
  {
    name: '官方API',
    url: 'https://api.github.com/repos/ZalithLauncher/ZalithLauncher2/releases/latest',
    timeout: 10000
  }
]

// 从指定API获取数据
async function fetchFromApi(apiConfig: any): Promise<any> {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), apiConfig.timeout)
  
  try {
    const response = await fetch(apiConfig.url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'ZalithLauncher-Website/1.0'
      },
      signal: controller.signal
    })
    
    window.clearTimeout(timeoutId)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    window.clearTimeout(timeoutId)
    throw error
  }
}

// 获取最新版本
async function fetchLatestRelease() {
  isLoading.value = true
  hasError.value = false
  errorMessage.value = ''
  
  try {
    console.log('开始获取ZL2最新版本信息...')
    
    // 依次尝试每个API
    for (const apiConfig of API_CONFIGS) {
      try {
        console.log(`尝试使用 ${apiConfig.name}...`)
        
        const data = await fetchFromApi(apiConfig)
        
        console.log(`✅ ${apiConfig.name} 请求成功`)
        latestRelease.value = data
        parsedBody.value = data.body ? await marked.parse(data.body) : ''
        
        // 数据加载完成后自动检测设备类型
        autoSelectDeviceType()
        return
        
      } catch (error) {
        console.warn(`❌ ${apiConfig.name} 请求失败:`, error)
        
        if (apiConfig !== API_CONFIGS[API_CONFIGS.length - 1]) {
          console.log('尝试下一个API...')
          continue
        }
        
        throw new Error('所有API都无法访问')
      }
    }
    
  } catch (error) {
    console.error('获取ZL2最新版本失败:', error)
    hasError.value = true
    errorMessage.value = '无法获取版本信息，请检查网络连接或稍后重试'
  } finally {
    isLoading.value = false
  }
}

// 在数据加载完成后自动检测设备类型
function autoSelectDeviceType() {
  if (dynamicDeviceTypes.value.length > 1) {
    const detectedType = detectUserDeviceType()
    const availableType = dynamicDeviceTypes.value.find(type => type.id === detectedType)
    if (availableType) {
      selectedDeviceType.value = detectedType
    }
  }
}

// GitHub下载链接
function getDownloadUrl(asset: any) {
  return asset.browser_download_url
}

// 根据设备类型过滤资源
const filteredAssets = computed(() => {
  if (!latestRelease.value?.assets) return []
  
  const assets = latestRelease.value.assets
  
  if (selectedDeviceType.value === 'all') {
    return assets
  }
  
  const currentType = dynamicDeviceTypes.value.find(type => type.id === selectedDeviceType.value)
  if (!currentType) return assets
  
  return assets.filter((asset: any) => {
    const fileName = asset.name.toLowerCase()
    return currentType.patterns.some(pattern => {
      if (pattern === '*') return true
      return fileName.includes(pattern.toLowerCase())
    })
  })
})

// 获取当前选择的设备类型信息
const currentDeviceType = computed(() => {
  return dynamicDeviceTypes.value.find(type => type.id === selectedDeviceType.value) || dynamicDeviceTypes.value[0]
})

// 获取当前选择的下载源信息
const currentDownloadSource = computed(() => {
  return downloadSources.find(source => source.id === selectedDownloadSource.value) || downloadSources[0]
})

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 处理下拉菜单的blur事件
function handleDeviceDropdownBlur() {
  if (typeof window !== 'undefined' && window.setTimeout) {
    window.setTimeout(() => {
      isDeviceDropdownOpen.value = false
    }, 200)
  }
}

function handleSourceDropdownBlur() {
  if (typeof window !== 'undefined' && window.setTimeout) {
    window.setTimeout(() => {
      isSourceDropdownOpen.value = false
    }, 200)
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchLatestRelease()
})
</script>

<template>
  <div class="download-container">
    <div v-if="isLoading" class="loading">
      <div class="loading-spinner"></div>
      <p>正在获取最新版本信息...</p>
    </div>
    
    <div v-else-if="hasError" class="error">
      <div class="error-content">
        <span class="error-icon">⚠️</span>
        <h3>无法获取版本信息</h3>
        <p>{{ errorMessage }}</p>
        <button class="retry-btn" @click="fetchLatestRelease()">重新加载</button>
      </div>
    </div>
    
    <div v-else-if="latestRelease" class="release-info">
      <!-- 版本信息头部 -->
      <div class="release-header">
        <h2>{{ latestRelease.name }}</h2>
        <div class="version-info">
          <span class="version-tag">{{ latestRelease.tag_name }}</span>
          <span class="release-date">{{ new Date(latestRelease.published_at).toLocaleDateString('zh-CN') }}</span>
        </div>
      </div>
      
      <!-- 智能下载选择器 -->
      <div class="download-selector">
        <div class="selector-header">
          <h3>智能下载</h3>
          <p>已自动检测您的设备类型，您也可以手动选择</p>
        </div>
        
        <div class="selector-controls">
          <!-- 设备类型选择器 -->
          <div class="dropdown-container">
            <label class="dropdown-label">设备类型</label>
            <div class="dropdown" :class="{ 'is-open': isDeviceDropdownOpen }">
              <button 
                class="dropdown-trigger" 
                @click="isDeviceDropdownOpen = !isDeviceDropdownOpen"
                @blur="handleDeviceDropdownBlur"
              >
                <span class="dropdown-content">
                  <span v-if="currentDeviceType.icon" class="device-icon">{{ currentDeviceType.icon }}</span>
                  <span class="device-info">
                    <span class="device-name">{{ currentDeviceType.name }}</span>
                    <span class="device-desc">{{ currentDeviceType.description }}</span>
                  </span>
                </span>
                <span class="dropdown-arrow">▼</span>
              </button>
              
              <div class="dropdown-menu">
                <button 
                  v-for="device in dynamicDeviceTypes" 
                  :key="device.id"
                  class="dropdown-item"
                  :class="{ 'is-selected': selectedDeviceType === device.id }"
                  @click="selectedDeviceType = device.id; isDeviceDropdownOpen = false"
                >
                  <span v-if="device.icon" class="device-icon">{{ device.icon }}</span>
                  <span class="device-info">
                    <span class="device-name">{{ device.name }}</span>
                    <span class="device-desc">{{ device.description }}</span>
                  </span>
                  <span v-if="selectedDeviceType === device.id" class="check-icon">✓</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 下载文件列表 -->
      <div class="download-section">
        <h3>下载文件</h3>
        
        <div v-if="filteredAssets && filteredAssets.length > 0" class="assets-list">
          <div v-for="asset in filteredAssets" :key="asset.id" class="asset-item">
            <div class="asset-info">
              <div class="asset-header">
                <h4 class="asset-name">{{ asset.name }}</h4>
                <span class="asset-size">{{ formatFileSize(asset.size) }}</span>
              </div>
              <div class="asset-meta">
                <span class="download-count">{{ asset.download_count.toLocaleString() }} 次下载</span>
              </div>
            </div>
            
            <div class="download-action">
              <a :href="getDownloadUrl(asset)" 
                 class="download-btn primary-btn" 
                 target="_blank" 
                 rel="noopener noreferrer">
                <span class="btn-text">立即下载</span>
              </a>
            </div>
          </div>
        </div>
        
        <div v-else class="no-assets">
          <div class="no-assets-content">
            <h4>暂无适用于 {{ currentDeviceType.name }} 的下载文件</h4>
            <p>请尝试选择其他设备类型，或查看完整的发布说明</p>
          </div>
        </div>
      </div>
      
      <!-- 发布说明 -->
      <div class="release-notes-section">
        <h3>发布说明</h3>
        <div class="release-notes" v-html="parsedBody"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.download-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 12px;
  font-family: var(--vp-font-family-base);
  color: var(--vp-c-text-1);
}

/* 加载和错误状态 */
.loading, .error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--vp-c-divider);
  border-top: 3px solid var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading p, .error-content p {
  color: var(--vp-c-text-2);
  margin: 0;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.error-icon {
  font-size: 48px;
}

.retry-btn {
  padding: 8px 16px;
  background-color: var(--vp-c-brand-1);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.retry-btn:hover {
  background-color: var(--vp-c-brand-2);
}

/* 版本信息头部 */
.release-header {
  text-align: center;
  margin-bottom: 32px;
  padding: 24px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
}

.release-header h2 {
  margin: 0 0 12px 0;
  font-size: 28px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.version-info {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.version-tag {
  background: var(--vp-c-brand-1);
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
}

.release-date {
  color: var(--vp-c-text-2);
  font-size: 14px;
}

/* 下载选择器 */
.download-selector {
  margin-bottom: 32px;
  padding: 24px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
}

.selector-header {
  margin-bottom: 20px;
}

.selector-header h3, .download-section h3, .release-notes-section h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.selector-header p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.selector-controls {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.dropdown-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dropdown-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.dropdown {
  position: relative;
}

.dropdown-trigger {
  width: 100%;
  padding: 12px 16px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: border-color 0.3s;
}

.dropdown-trigger:hover {
  border-color: var(--vp-c-brand-1);
}

.dropdown.is-open .dropdown-trigger {
  border-color: var(--vp-c-brand-1);
}

.dropdown-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  text-align: left;
}

.device-info, .source-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.device-name, .source-name {
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.device-desc, .source-desc {
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.dropdown-arrow {
  transition: transform 0.3s;
  color: var(--vp-c-text-2);
}

.dropdown.is-open .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  display: none;
}

.dropdown.is-open .dropdown-menu {
  display: block;
}

.dropdown-item {
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  transition: background-color 0.3s;
}

.dropdown-item:hover {
  background: var(--vp-c-bg-soft);
}

.dropdown-item.is-selected {
  background: var(--vp-c-brand-soft);
}

.check-icon {
  color: var(--vp-c-brand-1);
  font-weight: bold;
}

/* 下载文件列表 */
.download-section, .release-notes-section {
  margin-bottom: 32px;
}

.assets-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.asset-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  gap: 16px;
}

.asset-info {
  flex: 1;
  min-width: 0;
}

.asset-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  gap: 12px;
}

.asset-name {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  word-break: break-all;
}

.asset-size {
  font-size: 14px;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.download-count {
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.download-action {
  flex-shrink: 0;
}

.download-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--vp-c-brand-1);
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.download-btn:hover {
  background: var(--vp-c-brand-2);
  text-decoration: none;
}

.no-assets {
  text-align: center;
  padding: 40px 20px;
  color: var(--vp-c-text-2);
}

.no-assets-content h4 {
  margin: 0 0 8px 0;
  color: var(--vp-c-text-1);
}

.no-assets-content p {
  margin: 0;
}

/* 发布说明 */
.release-notes {
  background: var(--vp-c-bg-soft);
  padding: 20px;
  border-radius: 8px;
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .download-container {
    padding: 8px;
  }
  
  .release-header, .download-selector {
    padding: 16px;
  }
  
  .asset-item {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .download-action {
    align-self: stretch;
  }
  
  .download-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>