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
  contributor?: {
    name: string
    url: string
  }
}

const latestRelease = ref<any>(null)
const foxingtonData = ref<any>(null)
const zeinkData = ref<any>(null)
const isLoading = ref(false)
const hasError = ref(false)
const errorMessage = ref('')
const parsedBody = ref('')
const selectedDeviceType = ref('all')
const selectedDownloadSource = ref('github')
const isDeviceDropdownOpen = ref(false)
const isSourceDropdownOpen = ref(false)
const apiFailed = ref(false) // API是否失败标志
const fallbackToLocal = ref(false) // 是否已降级到本地版本

// 基础设备类型定义（会根据API返回的文件动态扩展）
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
    id: 'ios', 
    name: 'iOS', 
    icon: '', 
    description: 'iPhone/iPad',
    patterns: ['ios', '.ipa']
  }
]

// 下载源定义
const downloadSources: DownloadSource[] = [
  { id: 'github', name: 'GitHub 官方', description: '官方发布渠道', speed: '海外较快' },
  { id: 'mirror', name: '国内镜像', description: '第三方加速', speed: '国内较快', contributor: { name: '咬一口的鱼py(fishcpy)', url: 'https://github.com/fishcpy' } },
  { id: 'foxington', name: 'github.com/XiaoluoFoxington源', description: '第三方镜像源', speed: '国内较快', contributor: { name: 'XiaoluoFoxington', url: 'https://github.com/XiaoluoFoxington' } },
  { id: 'zeink', name: '泽客镜像 Zeink Lab', description: '泽客镜像源', speed: '国内较快', contributor: { name: 'Zeink Lab', url: 'https://zeinklab.com' } }
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
    case 'arm64': return ''
    case 'armeabi': return ''
    case 'x86_64': return ''
    case 'x86': return ''
    case 'universal': return ''
    default: return ''
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

// API配置
const API_CONFIGS = [
  {
    name: '代理API',
    url: 'https://gayhub.lemwood.cn/repos/ZalithLauncher/ZalithLauncher/releases/latest',
    timeout: 5000 // 5秒超时
  },
  {
    name: '官方API',
    url: 'https://api.github.com/repos/ZalithLauncher/ZalithLauncher/releases/latest',
    timeout: 10000 // 10秒超时
  }
]

// 测试API可用性
async function testApiAvailability(apiConfig: any): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => controller.abort(), apiConfig.timeout)
    
    const response = await fetch(apiConfig.url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'ZalithLauncher-Website/1.0'
      },
      signal: controller.signal
    })
    
    window.clearTimeout(timeoutId)
    return response.ok
  } catch (error) {
    console.warn(`${apiConfig.name} 不可用:`, error)
    return false
  }
}

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

// 获取Foxington源数据
async function fetchFoxingtonData() {
  const foxingtonUrl = 'https://next.foldcraftlauncher.cn/data/down/zl/1/1.4.1.0/index.json'
  
  try {
    // 首先尝试直接请求
    console.log('尝试直接获取Foxington源数据...')
    const response = await fetch(foxingtonUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'ZalithLauncher-Website/1.0'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    foxingtonData.value = data
    console.log('✅ Foxington源数据获取成功（直接请求）')
    return
  } catch (error) {
    console.warn('❌ 直接请求Foxington源失败:', error)
    
    // 如果直接请求失败，尝试使用代理API
    try {
      console.log('尝试使用代理API获取Foxington源数据...')
      const proxyResponse = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(foxingtonUrl)}`, {
        headers: {
          'Accept': 'application/json'
        }
      })
      
      if (!proxyResponse.ok) {
        throw new Error(`代理API HTTP ${proxyResponse.status}: ${proxyResponse.statusText}`)
      }
      
      const proxyData = await proxyResponse.json()
      
      if (!proxyData.contents) {
        throw new Error('代理API返回数据格式错误')
      }
      
      const data = JSON.parse(proxyData.contents)
      foxingtonData.value = data
      console.log('✅ Foxington源数据获取成功（代理API）')
    } catch (proxyError) {
      console.warn('❌ 代理API也失败了:', proxyError)
      foxingtonData.value = null
    }
  }
}

// 获取泽客镜像源数据
async function fetchZeinkData() {
  const zeinkUrl = 'https://mirror.zeinklab.com/api/stat'
  
  try {
    console.log('尝试获取泽客镜像源数据...')
    const response = await fetch(zeinkUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'ZalithLauncher-Website/1.0'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    // 提取ZalithLauncher的文件数据
    zeinkData.value = data.ZalithLauncher?.files || null
    console.log('✅ 泽客镜像源数据获取成功:', zeinkData.value)
  } catch (error) {
    console.warn('❌ 泽客镜像源数据获取失败:', error)
    zeinkData.value = null
  }
}

// 加载本地版本信息
async function loadLocalVersionInfo() {
  try {
    console.log('开始加载本地版本信息...')
    
    // 从public目录加载version.json文件
    const response = await fetch('/version.json')
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const localData = await response.json()
    
    // 构建与GitHub API兼容的数据结构
    const localRelease = {
      name: `ZalithLauncher ${localData.latest_version}`,
      tag_name: `v${localData.latest_version}`,
      published_at: localData.release_date,
      body: localData.body,
      assets: localData.assets.map((asset: any) => ({
        id: Math.random().toString(36).substr(2, 9), // 生成随机ID
        name: asset.name,
        browser_download_url: asset.browser_download_url,
        size: asset.size,
        download_count: asset.download_count
      }))
    }
    
    console.log('✅ 本地版本信息加载成功')
    return localRelease
  } catch (error) {
    console.error('❌ 加载本地版本信息失败:', error)
    throw error
  }
}

// 获取最新版本（带API检测、自动切换和异常处理）
async function fetchLatestRelease() {
  isLoading.value = true
  hasError.value = false
  errorMessage.value = ''
  apiFailed.value = false
  fallbackToLocal.value = false
  
  try {
    console.log('开始获取最新版本信息...')
    
    // 依次尝试每个API
    for (const apiConfig of API_CONFIGS) {
      try {
        console.log(`尝试使用 ${apiConfig.name}...`)
        
        const data = await fetchFromApi(apiConfig)
        
        console.log(`✅ ${apiConfig.name} 请求成功`)
        latestRelease.value = data
        // 显式等待marked解析完成
        parsedBody.value = data.body ? await marked.parse(data.body) : ''
        
        // 同时获取Foxington源数据
        await fetchFoxingtonData()
        
        // 同时获取泽客镜像源数据
        await fetchZeinkData()
        
        // 数据加载完成后自动检测设备类型
        autoSelectDeviceType()
        return // 成功获取数据，退出函数
        
      } catch (error) {
        console.warn(`❌ ${apiConfig.name} 请求失败:`, error)
        
        // 如果不是最后一个API，继续尝试下一个
        if (apiConfig !== API_CONFIGS[API_CONFIGS.length - 1]) {
          console.log('尝试下一个API...')
          continue
        }
        
        // 如果是最后一个API也失败了，标记API失败并尝试获取本地版本信息但不限制下载源
        apiFailed.value = true
        console.log('所有API都无法访问，尝试获取本地版本信息但不限制下载源...')
        
        try {
          const localRelease = await loadLocalVersionInfo()
          latestRelease.value = localRelease
          parsedBody.value = localRelease.body ? await marked.parse(localRelease.body) : ''
          // 注意：这里不设置 fallbackToLocal.value = true，保持下载源不受限制
          
          // 同时获取Foxington源数据，确保第三方下载源也能正常工作
          await fetchFoxingtonData()
          
          // 同时获取泽客镜像源数据
          await fetchZeinkData()
          
          // 显示API失败通知
          errorMessage.value = 'API版本信息获取失败，但您仍然可以使用所有下载源。部分功能可能受限。'
          
          console.log('✅ 已获取本地版本信息，但保持下载源不受限制')
          
          // 数据加载完成后自动检测设备类型
          autoSelectDeviceType()
          return
          
        } catch (localError) {
          console.error('❌ 本地版本信息也加载失败:', localError)
          throw new Error('所有API和本地版本信息都无法访问')
        }
      }
    }
    
  } catch (error) {
    console.error('获取最新版本失败:', error)
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

// 按规则拼接镜像加速链接
function generateMirrorUrl(assetName: string, tagName: string) {
  const version = tagName.replace('v', '').replace(/\./g, '')
  return `https://download.fishcpy.top/dl/zl/${version}/${assetName}`
}

// GitHub下载链接
function getOriginalGitHubUrl(asset: any) {
  return asset.browser_download_url
}

// 从Foxington源数据中获取对应的下载链接
function getFoxingtonUrl(asset: any) {
  if (!foxingtonData.value || !Array.isArray(foxingtonData.value)) {
    return asset.browser_download_url // 降级到GitHub链接
  }
  
  // 根据文件名匹配架构类型
  const fileName = asset.name.toLowerCase()
  let targetArchName = 'all 架构'
  
  if (fileName.includes('arm64-v8a') || fileName.includes('arm64')) {
    targetArchName = 'arm64-v8a 架构'
  } else if (fileName.includes('armeabi-v7a') || fileName.includes('armeabi')) {
    targetArchName = 'armeabi-v7a 架构'
  } else if (fileName.includes('x86_64') || fileName.includes('x86-64')) {
    targetArchName = 'x86_64 架构'
  } else if (fileName.includes('x86')) {
    targetArchName = 'x86 架构'
  } else if (fileName.includes('universal')) {
    targetArchName = 'all 架构'
  }
  
  // 查找匹配的文件
  const matchedFile = foxingtonData.value.find((file: any) => 
    file.name === targetArchName
  )
  
  if (matchedFile && matchedFile.url) {
    return matchedFile.url
  }
  
  // 如果没有找到精确匹配，尝试使用通用版本
  const universalFile = foxingtonData.value.find((file: any) => file.name === 'all 架构')
  if (universalFile && universalFile.url) {
    return universalFile.url
  }
  
  // 最后降级到GitHub链接
  return asset.browser_download_url
}

// 获取泽客镜像源URL
function getZeinkUrl(asset: any) {
  // 如果有API数据，优先使用API数据
  if (zeinkData.value && Array.isArray(zeinkData.value)) {
    // 根据文件名精确匹配
    const matchedFile = zeinkData.value.find((file: any) => 
      file.name === asset.name
    )
    
    if (matchedFile && matchedFile.mirror_url) {
      console.log(`🔗 使用API数据的泽客镜像链接: ${matchedFile.mirror_url}`)
      return matchedFile.mirror_url
    }
  }
  
  // 如果没有API数据或API数据中没有匹配的文件，直接构造泽客镜像URL
  // 泽客镜像的URL格式：http://mirror.zeinklab.com/repos/ZalithLauncher/文件名
  const zeinkMirrorUrl = `http://mirror.zeinklab.com/repos/ZalithLauncher/${asset.name}`
  console.log(`🔗 生成泽客镜像链接: ${zeinkMirrorUrl}`)
  return zeinkMirrorUrl
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
  // 如果使用本地版本且fallbackToLocal为true，只提供GitHub官方链接
  // 但API失败时（fallbackToLocal为false），仍然允许使用第三方下载源
  if (fallbackToLocal.value) {
    return asset.browser_download_url
  }
  
  if (selectedDownloadSource.value === 'mirror') {
    return generateMirrorUrl(asset.name, latestRelease.value.tag_name)
  } else if (selectedDownloadSource.value === 'foxington') {
    return getFoxingtonUrl(asset)
  } else if (selectedDownloadSource.value === 'zeink') {
    return getZeinkUrl(asset)
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

// 处理设备类型下拉菜单的blur事件
function handleDeviceDropdownBlur() {
  if (typeof window !== 'undefined' && window.setTimeout) {
    window.setTimeout(() => {
      isDeviceDropdownOpen.value = false
    }, 200)
  }
}

// 处理下载源下拉菜单的blur事件
function handleSourceDropdownBlur() {
  if (typeof window !== 'undefined' && window.setTimeout) {
    window.setTimeout(() => {
      isSourceDropdownOpen.value = false
    }, 200)
  }
}

// 组件挂载时获取数据
onMounted(() => {
    // 重置状态
    apiFailed.value = false
    fallbackToLocal.value = false
    
    fetchLatestRelease()
    
    // 如果使用本地版本，确保下载源为GitHub官方源
    if (fallbackToLocal.value) {
      selectedDownloadSource.value = 'github'
    }
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
      <!-- API失败通知 -->
      <div v-if="apiFailed" class="api-fallback-notice">
        <div class="notice-content">
          <span class="notice-icon">⚠️</span>
          <div class="notice-text">
            <strong>API版本信息获取失败</strong>
            <p v-if="fallbackToLocal">已自动切换到本地版本信息，部分功能可能受限。</p>
            <p v-else>已使用本地版本信息，但您仍然可以使用所有下载源。部分功能可能受限。</p>
          </div>
          <button class="notice-retry-btn" @click="fetchLatestRelease()">重新尝试</button>
        </div>
      </div>
      
      <!-- 版本信息头部 -->
      <div class="release-header">
        <h2>{{ latestRelease.name }}</h2>
        <div class="version-info">
          <span class="version-tag">{{ latestRelease.tag_name }}</span>
          <span class="release-date">{{ new Date(latestRelease.published_at).toLocaleDateString('zh-CN') }}</span>
          <span v-if="fallbackToLocal" class="local-version-badge">本地版本</span>
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
          
          <!-- 下载源选择器 -->
      <div class="dropdown-container">
        <label class="dropdown-label">下载源</label>
        <div class="dropdown" :class="{ 'is-open': isSourceDropdownOpen, 'is-disabled': fallbackToLocal }">
          <button 
            class="dropdown-trigger" 
            @click="isSourceDropdownOpen = !isSourceDropdownOpen"
            @blur="handleSourceDropdownBlur"
            :disabled="fallbackToLocal"
          >
            <span class="dropdown-content">
              <span class="source-info">
                <span class="source-name">{{ currentDownloadSource.name }}</span>
                <span class="source-desc">{{ currentDownloadSource.description }} · {{ currentDownloadSource.speed }}</span>
                <span v-if="fallbackToLocal" class="local-version-hint">（本地版本）</span>
              </span>
            </span>
            <span class="dropdown-arrow">▼</span>
          </button>
          
          <div class="dropdown-menu">
            <button 
              v-for="source in downloadSources" 
              :key="source.id"
              class="dropdown-item"
              :class="{ 
                'is-selected': selectedDownloadSource === source.id,
                'is-disabled': fallbackToLocal && source.id !== 'github'
              }"
              @click="if (!fallbackToLocal || source.id === 'github') { selectedDownloadSource = source.id; isSourceDropdownOpen = false }"
              :disabled="fallbackToLocal && source.id !== 'github'"
            >
              <span class="source-info">
                <span class="source-name">{{ source.name }}</span>
                <span class="source-desc">{{ source.description }} · {{ source.speed }}</span>
                <span v-if="source.contributor" class="contributor-info">
                  镜像加速由 <a :href="source.contributor.url" target="_blank" rel="noopener noreferrer" class="contributor-link">{{ source.contributor.name }}</a> 友情提供
                </span>
                <span v-if="fallbackToLocal && source.id !== 'github'" class="disabled-hint">本地版本不可用</span>
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

/* API失败通知 */
.api-fallback-notice {
  background: var(--vp-c-warning-soft);
  border: 1px solid var(--vp-c-warning-2);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  animation: slideDown 0.3s ease;
}

.notice-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.notice-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.notice-text {
  flex: 1;
}

.notice-text strong {
  color: var(--vp-c-warning-1);
  font-size: 1rem;
  display: block;
  margin-bottom: 4px;
}

.notice-text p {
  color: var(--vp-c-warning-2);
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.4;
}

.notice-retry-btn {
  background: var(--vp-c-warning-1);
  color: var(--vp-c-white);
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
  transition: background-color 0.2s ease;
  flex-shrink: 0;
}

.notice-retry-btn:hover {
  background: var(--vp-c-warning-2);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 本地版本徽章 */
.local-version-badge {
  background: var(--vp-c-warning-1);
  color: var(--vp-c-white);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.7;
  }
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

.error-icon, .no-assets-icon {
  font-size: 3rem;
}

.error-icon {
  color: var(--vp-c-danger-1);
}

.no-assets-icon {
  opacity: 0.5;
  color: var(--vp-c-text-3);
}

.error-content h3, .no-assets-content h4 {
  margin: 0;
  color: var(--vp-c-text-1);
}

.error-content h3 {
  font-size: 1.25rem;
}

.no-assets-content h4 {
  font-size: 1.125rem;
}

.retry-btn {
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white);
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.retry-btn:hover {
  background: var(--vp-c-brand-2);
}

/* 版本信息头部 */
.release-header {
  text-align: center;
  margin-bottom: 24px;
  padding: 16px;
  background: linear-gradient(135deg, var(--vp-c-brand-1) 0%, var(--vp-c-brand-2) 100%);
  border-radius: 16px;
  color: var(--vp-c-white);
  border: 1px solid var(--vp-c-brand-soft);
}

.release-header h2 {
  margin: 0 0 12px 0;
  font-size: 2rem;
  font-weight: 700;
  color: var(--vp-c-white);
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
  color: var(--vp-c-white);
}

.release-date {
  background: rgba(255, 255, 255, 0.1);
  color: var(--vp-c-white);
}

/* 智能下载选择器 */
.download-selector {
  background: var(--vp-c-bg-soft);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 24px;
  border: 1px solid var(--vp-c-divider);
}

.selector-header {
  text-align: center;
  margin-bottom: 16px;
}

.selector-header h3, .download-section h3, .release-notes-section h3 {
  margin: 0 0 20px 0;
  font-size: 1.5rem;
  color: var(--vp-c-text-1);
}

.selector-header h3 {
  margin-bottom: 8px;
}

.selector-header p, .no-assets-content p {
  margin: 0;
  color: var(--vp-c-text-2);
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
  color: var(--vp-c-text-1);
  font-size: 0.875rem;
}

.dropdown {
  position: relative;
}

.dropdown-trigger {
  width: 100%;
  background: var(--vp-c-bg);
  border: 2px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  color: var(--vp-c-text-1);
}

.dropdown-trigger:hover, .dropdown.is-open .dropdown-trigger {
  border-color: var(--vp-c-brand-1);
}

.dropdown.is-open .dropdown-trigger {
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.dropdown-content {
  display: flex;
  align-items: center;
  gap: 8px;
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
  color: var(--vp-c-text-1);
  line-height: 1.2;
}

.device-desc, .source-desc {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  line-height: 1.2;
}

.contributor-info {
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
  margin-top: 4px;
  display: block;
}

.contributor-link {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.contributor-link:hover {
  color: var(--vp-c-brand-2);
  text-decoration: underline;
}

.dropdown-arrow {
  color: var(--vp-c-text-3);
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
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  box-shadow: var(--vp-shadow-3);
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
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 0.875rem;
  color: var(--vp-c-text-1);
}

.dropdown-item:hover {
  background-color: var(--vp-c-default-soft);
}

.dropdown-item.is-selected {
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.check-icon {
  margin-left: auto;
  color: var(--vp-c-brand-1);
  font-weight: bold;
}

/* 下载文件列表 */
.download-section, .release-notes-section {
  margin-bottom: 24px;
}

.assets-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.asset-item {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
}

.asset-item:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--vp-shadow-2);
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
  color: var(--vp-c-text-1);
}

.asset-size {
  background: var(--vp-c-default-soft);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.download-count {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

.download-action {
  margin-left: 20px;
}

.download-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  color: var(--vp-c-white);
  text-decoration: none;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: var(--vp-shadow-2);
}

.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--vp-shadow-3);
  background: linear-gradient(135deg, var(--vp-c-brand-2), var(--vp-c-brand-3));
}

.btn-icon {
  font-size: 1.125rem;
}

/* 无文件状态 */
.no-assets {
  text-align: center;
  padding: 40px 20px;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 2px dashed var(--vp-c-border);
}

.no-assets-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

/* 发布说明 */
.release-notes {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 24px;
  border-left: 4px solid var(--vp-c-brand-1);
  line-height: 1.6;
  color: var(--vp-c-text-1);
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