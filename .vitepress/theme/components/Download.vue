<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { marked, type MarkedOptions } from 'marked' // 从marked v4+开始支持具名导出

/*
  由于VitePress并不会解析该组件的latestRelease.body内容，故单独引入marked库解析为HTML后返回至页面
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
}

const latestRelease = ref<any>(null)
const isLoading = ref(false)
const parsedBody = ref('')
const selectedDeviceType = ref('all')
const selectedDownloadSource = ref('github')
const isDeviceDropdownOpen = ref(false)
const isSourceDropdownOpen = ref(false)

// 基础设备类型定义（会根据API返回的文件动态扩展）
const baseDeviceTypes: DeviceType[] = [
  { 
    id: 'all', 
    name: '全部文件', 
    icon: '📦', 
    description: '显示所有下载文件',
    patterns: ['*']
  },
  { 
    id: 'windows', 
    name: 'Windows', 
    icon: '🪟', 
    description: 'Windows 电脑',
    patterns: ['windows', 'win', '.exe', '.msi']
  },
  { 
    id: 'macos', 
    name: 'macOS', 
    icon: '🍎', 
    description: 'Mac 电脑',
    patterns: ['macos', 'mac', 'darwin', '.dmg']
  },
  { 
    id: 'linux', 
    name: 'Linux', 
    icon: '🐧', 
    description: 'Linux 系统',
    patterns: ['linux', '.appimage', '.deb', '.rpm', '.tar.gz']
  },
  { 
    id: 'ios', 
    name: 'iOS', 
    icon: '📱', 
    description: 'iPhone/iPad',
    patterns: ['ios', '.ipa']
  }
]

// 下载源定义
const downloadSources: DownloadSource[] = [
  { id: 'github', name: 'GitHub 官方', description: '官方发布渠道', speed: '海外较快' },
  { id: 'mirror', name: '国内镜像', description: '第三方加速', speed: '国内较快' }
]

// 动态设备类型（基于API返回的文件）
const dynamicDeviceTypes = computed(() => {
  if (!latestRelease.value?.assets) return baseDeviceTypes

  const assets = latestRelease.value.assets
  const detectedTypes = new Set<string>()
  const architectures = new Set<string>()
  
  // 分析文件名，提取设备类型和架构信息
  assets.forEach((asset: any) => {
    const fileName = asset.name.toLowerCase()
    
    // 检测Android架构（按优先级检测，避免误匹配）
    if (fileName.includes('arm64-v8a') || fileName.includes('arm64')) {
      architectures.add('arm64')
    } else if (fileName.includes('armeabi-v7a') || fileName.includes('armeabi')) {
      architectures.add('armeabi')
    } else if (fileName.includes('x86_64') || fileName.includes('x86-64')) {
      architectures.add('x86_64')
    } else if (fileName.includes('x86')) {
      architectures.add('x86')
    } else if (fileName.includes('universal')) {
      architectures.add('universal')
    }
    
    // 检测平台
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
  
  // 添加架构特定的类型（按常见程度排序）
  const archOrder = ['arm64', 'armeabi', 'x86_64', 'x86', 'universal']
  archOrder.forEach(arch => {
    if (architectures.has(arch)) {
      const archType: DeviceType = {
        id: arch,
        name: getArchDisplayName(arch),
        icon: getArchIcon(arch),
        description: getArchDescription(arch),
        patterns: getArchPatterns(arch)
      }
      result.push(archType)
    }
  })
  
  return result
})

// 获取架构匹配模式
function getArchPatterns(arch: string): string[] {
  switch (arch) {
    case 'arm64': return ['arm64-v8a', 'arm64']
    case 'armeabi': return ['armeabi-v7a', 'armeabi']
    case 'x86_64': return ['x86_64', 'x86-64']
    case 'x86': return ['x86.apk'] // 精确匹配，避免匹配到x86_64
    case 'universal': return ['universal']
    default: return [arch]
  }
}

// 获取架构显示名称
function getArchDisplayName(arch: string): string {
  switch (arch) {
    case 'arm64': return 'ARM64'
    case 'armeabi': return 'ARMv7'
    case 'x86_64': return 'x86-64'
    case 'x86': return 'x86'
    case 'universal': return '通用版本'
    default: return arch.toUpperCase()
  }
}

// 获取架构图标
function getArchIcon(arch: string): string {
  switch (arch) {
    case 'arm64': return '💪'
    case 'armeabi': return '🔧'
    case 'x86_64': return '⚡'
    case 'x86': return '🔩'
    case 'universal': return '🌐'
    default: return '📱'
  }
}

// 获取架构描述
function getArchDescription(arch: string): string {
  switch (arch) {
    case 'arm64': return '64位 ARM 架构（推荐）'
    case 'armeabi': return '32位 ARM 架构'
    case 'x86_64': return '64位 x86 架构'
    case 'x86': return '32位 x86 架构'
    case 'universal': return '通用架构版本'
    default: return '特定架构'
  }
}

// 自动检测用户设备类型和架构
function detectUserDeviceType(): string {
  const userAgent = navigator.userAgent.toLowerCase()
  
  // 检测Android设备架构
  if (/android/.test(userAgent)) {
    // 尝试检测具体架构
    if (/arm64|aarch64/.test(userAgent)) {
      return 'arm64'
    } else if (/armv7|armeabi/.test(userAgent)) {
      return 'armeabi'
    } else if (/x86_64|x64/.test(userAgent)) {
      return 'x86_64'
    } else if (/x86/.test(userAgent)) {
      return 'x86'
    }
    // 默认推荐ARM64（现代Android设备主流架构）
    return 'arm64'
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
    
    // 数据加载完成后自动检测设备类型
    autoSelectDeviceType()
  } catch (error) {
    console.error('Error fetching latest release:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchLatestRelease()
})

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

// 按规则拼接镜像加速链接
function generateMirrorUrl(assetName: string, tagName: string) {
  const version = tagName.replace('v', '').replace(/\./g, '')
  return `https://download.fishcpy.top/dl/zl/${version}/${assetName}`
}

// GitHub下载链接
function getOriginalGitHubUrl(asset: any) {
  return asset.browser_download_url
}

// 根据设备类型过滤资源
const filteredAssets = computed(() => {
  if (!latestRelease.value?.assets) return []
  
  const assets = latestRelease.value.assets
  
  // 如果选择"全部文件"，返回所有资源
  if (selectedDeviceType.value === 'all') {
    return assets
  }
  
  // 查找当前选择的设备类型
  const currentType = dynamicDeviceTypes.value.find(type => type.id === selectedDeviceType.value)
  if (!currentType) return assets
  
  // 根据模式过滤文件
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

// 获取下载链接
function getDownloadUrl(asset: any) {
  if (selectedDownloadSource.value === 'mirror') {
    return generateMirrorUrl(asset.name, latestRelease.value.tag_name)
  } else {
    return getOriginalGitHubUrl(asset)
  }
}

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<template>
  <div class="download-container">
    <div v-if="isLoading" class="loading">
      <div class="loading-spinner"></div>
      <p>正在获取最新版本信息...</p>
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
          <h3>🎯 智能下载</h3>
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
                @blur="() => setTimeout(() => isDeviceDropdownOpen = false, 200)"
              >
                <span class="dropdown-content">
                  <span class="device-icon">{{ currentDeviceType.icon }}</span>
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
                  <span class="device-icon">{{ device.icon }}</span>
                  <span class="device-info">
                    <span class="device-name">{{ device.name }}</span>
                    <span class="device-desc">{{ device.description }}</span>
                  </span>
                  <span v-if="selectedDeviceType === device.id" class="check-icon">✓</span>
                </button>
              </div>
            </div>
          </div>
          
          <!-- 下载源选择器 -->
          <div class="dropdown-container">
            <label class="dropdown-label">下载源</label>
            <div class="dropdown" :class="{ 'is-open': isSourceDropdownOpen }">
              <button 
                class="dropdown-trigger" 
                @click="isSourceDropdownOpen = !isSourceDropdownOpen"
                @blur="() => setTimeout(() => isSourceDropdownOpen = false, 200)"
              >
                <span class="dropdown-content">
                  <span class="source-info">
                    <span class="source-name">{{ currentDownloadSource.name }}</span>
                    <span class="source-desc">{{ currentDownloadSource.description }} · {{ currentDownloadSource.speed }}</span>
                  </span>
                </span>
                <span class="dropdown-arrow">▼</span>
              </button>
              
              <div class="dropdown-menu">
                <button 
                  v-for="source in downloadSources" 
                  :key="source.id"
                  class="dropdown-item"
                  :class="{ 'is-selected': selectedDownloadSource === source.id }"
                  @click="selectedDownloadSource = source.id; isSourceDropdownOpen = false"
                >
                  <span class="source-info">
                    <span class="source-name">{{ source.name }}</span>
                    <span class="source-desc">{{ source.description }} · {{ source.speed }}</span>
                  </span>
                  <span v-if="selectedDownloadSource === source.id" class="check-icon">✓</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 下载文件列表 -->
      <div class="download-section">
        <h3>📦 下载文件</h3>
        
        <div v-if="filteredAssets && filteredAssets.length > 0" class="assets-list">
          <div v-for="asset in filteredAssets" :key="asset.id" class="asset-item">
            <div class="asset-info">
              <div class="asset-header">
                <h4 class="asset-name">{{ asset.name }}</h4>
                <span class="asset-size">{{ formatFileSize(asset.size) }}</span>
              </div>
              <div class="asset-meta">
                <span class="download-count">📊 {{ asset.download_count.toLocaleString() }} 次下载</span>
              </div>
            </div>
            
            <div class="download-action">
              <a :href="getDownloadUrl(asset)" 
                 class="download-btn primary-btn" 
                 target="_blank" 
                 rel="noopener noreferrer">
                <span class="btn-icon">⬇️</span>
                <span class="btn-text">立即下载</span>
              </a>
            </div>
          </div>
        </div>
        
        <div v-else class="no-assets">
          <div class="no-assets-content">
            <span class="no-assets-icon">📱</span>
            <h4>暂无适用于 {{ currentDeviceType.name }} 的下载文件</h4>
            <p>请尝试选择其他设备类型，或查看完整的发布说明</p>
          </div>
        </div>
      </div>
      
      <!-- 发布说明 -->
      <div class="release-notes-section">
        <h3>📝 发布说明</h3>
        <div class="release-notes" v-html="parsedBody"></div>
      </div>
    </div>
    
    <div v-else class="error">
      <div class="error-content">
        <span class="error-icon">⚠️</span>
        <h3>无法获取版本信息</h3>
        <p>请检查网络连接后重试</p>
        <button class="retry-btn" @click="fetchLatestRelease()">重新加载</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.download-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
  border: 3px solid #f3f4f6;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading p, .error-content p {
  color: #6b7280;
  margin: 0;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.error-icon, .no-assets-icon {
  font-size: 3rem;
}

.error-icon {
  color: #ef4444;
}

.no-assets-icon {
  opacity: 0.5;
}

.error-content h3, .no-assets-content h4 {
  margin: 0;
  color: #374151;
}

.error-content h3 {
  font-size: 1.25rem;
}

.no-assets-content h4 {
  font-size: 1.125rem;
}

.retry-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.retry-btn:hover {
  background: #1d4ed8;
}

/* 版本信息头部 */
.release-header {
  text-align: center;
  margin-bottom: 32px;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
}

.release-header h2 {
  margin: 0 0 12px 0;
  font-size: 2rem;
  font-weight: 700;
}

.version-info {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.version-tag, .release-date {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
}

.version-tag {
  background: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

.release-date {
  background: rgba(255, 255, 255, 0.1);
}

/* 智能下载选择器 */
.download-selector {
  background: #f8fafc;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  border: 1px solid #e2e8f0;
}

.selector-header {
  text-align: center;
  margin-bottom: 24px;
}

.selector-header h3, .download-section h3, .release-notes-section h3 {
  margin: 0 0 20px 0;
  font-size: 1.5rem;
  color: #1e293b;
}

.selector-header h3 {
  margin-bottom: 8px;
}

.selector-header p, .no-assets-content p {
  margin: 0;
  color: #64748b;
  font-size: 0.875rem;
}

.selector-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* 下拉菜单 */
.dropdown-container {
  position: relative;
}

.dropdown-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.dropdown {
  position: relative;
}

.dropdown-trigger {
  width: 100%;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.dropdown-trigger:hover, .dropdown.is-open .dropdown-trigger {
  border-color: #3b82f6;
}

.dropdown.is-open .dropdown-trigger {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dropdown-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.device-icon {
  font-size: 1.25rem;
}

.device-info, .source-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.device-name, .source-name {
  font-weight: 600;
  color: #1f2937;
  line-height: 1.2;
}

.device-desc, .source-desc {
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.2;
}

.dropdown-arrow {
  color: #9ca3af;
  transition: transform 0.2s ease;
  font-size: 0.75rem;
}

.dropdown.is-open .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 50;
  max-height: 300px;
  overflow-y: auto;
  opacity: 0;
  transform: translateY(-10px);
  pointer-events: none;
  transition: all 0.2s ease;
}

.dropdown.is-open .dropdown-menu {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.dropdown-item {
  width: 100%;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 0.875rem;
}

.dropdown-item:hover {
  background-color: #f3f4f6;
}

.dropdown-item.is-selected {
  background-color: #eff6ff;
  color: #1d4ed8;
}

.check-icon {
  margin-left: auto;
  color: #10b981;
  font-weight: bold;
}

/* 下载文件列表 */
.download-section, .release-notes-section {
  margin-bottom: 32px;
}

.assets-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.asset-item {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
}

.asset-item:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.asset-info {
  flex: 1;
}

.asset-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.asset-name {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.asset-size {
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.download-count {
  font-size: 0.875rem;
  color: #6b7280;
}

.download-action {
  margin-left: 20px;
}

.download-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  text-decoration: none;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.btn-icon {
  font-size: 1.125rem;
}

/* 无文件状态 */
.no-assets {
  text-align: center;
  padding: 40px 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px dashed #cbd5e1;
}

.no-assets-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

/* 发布说明 */
.release-notes {
  background: #f8fafc;
  border-radius: 12px;
  padding: 24px;
  border-left: 4px solid #3b82f6;
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .download-container {
    padding: 16px;
  }
  
  .release-header {
    padding: 20px;
  }
  
  .release-header h2 {
    font-size: 1.5rem;
  }
  
  .download-selector {
    padding: 20px;
  }
  
  .selector-controls {
    grid-template-columns: 1fr;
  }
  
  .asset-item {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .asset-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .download-action {
    margin-left: 0;
  }
  
  .download-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>