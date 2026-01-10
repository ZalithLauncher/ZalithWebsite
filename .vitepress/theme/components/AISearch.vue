<template>
  <!-- 悬浮按钮 -->
  <div 
    class="ai-search-trigger" 
    :class="{ 'minimized': isMinimized && !aiState.isOpen }"
    @click="isMinimized ? toggleMinimized() : open()"
    @mouseenter="clearHideTimer"
    @mouseleave="startHideTimer"
  >
    <div class="trigger-content" v-show="!isMinimized || aiState.isOpen">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 12L2.1 14.9"/><path d="M12 12l9.9 2.9"/><path d="M12 12l2.9 9.9"/><path d="M12 12l-2.9 9.9"/></svg>
      <span>{{ t.triggerText }}</span>
    </div>
    <div class="trigger-arrow" v-show="isMinimized && !aiState.isOpen">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
    </div>
  </div>

  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="aiState.isOpen" class="ai-search-wrapper" @click.self="close">
        <div class="ai-search-modal">
          <div class="ai-search-header">
            <div class="header-top">
              <h3>{{ t.headerTitle }}</h3>
              <button class="close-btn" @click="close">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div class="search-box">
              <input 
                ref="inputRef"
                v-model="aiState.query" 
                :placeholder="t.placeholder" 
                @keyup.enter="handleSearch"
              />
              <button @click="handleSearch" :disabled="aiState.loading" class="search-btn">
                <svg v-if="!aiState.loading" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <div v-else class="btn-loading"></div>
              </button>
            </div>
          </div>
          
          <div class="ai-search-content" ref="contentRef">
            <div v-if="!aiState.answer && !aiState.loading" class="welcome-state">
              <p>{{ t.welcomeMessage }}</p>
              <div class="suggestions">
                <button @click="aiState.query = t.suggestions.download; handleSearch()">{{ t.suggestions.download }}</button>
                <button @click="aiState.query = t.suggestions.source; handleSearch()">{{ t.suggestions.source }}</button>
                <button @click="aiState.query = t.suggestions.isolation; handleSearch()">{{ t.suggestions.isolation }}</button>
              </div>
            </div>
            
            <div v-if="aiState.loading && !aiState.answer" class="loading-state">
              <div class="loading-dots">
                <span></span><span></span><span></span>
              </div>
              {{ t.loadingText }}
            </div>
            
            <div v-if="aiState.answer" class="answer-section">
              <div class="answer-title">{{ t.answerTitle }}</div>
              <div class="answer-text" v-html="renderedAnswer"></div>
            </div>
            
            <div v-if="aiState.results.length > 0" class="results-section">
              <div class="section-title">{{ t.relatedDocs }}</div>
              <div v-for="item in aiState.results" :key="item.link" class="result-item">
                <a :href="item.link" @click="close">
                  <span class="result-title">{{ item.title }}</span>
                  <p class="result-excerpt">{{ item.excerpt }}</p>
                </a>
              </div>
            </div>
          </div>
          
          <div class="ai-search-footer">
            <span>{{ t.footerText }}</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, reactive } from 'vue'
import { useRouter, useData } from 'vitepress'
import { marked } from 'marked'

// 全局状态，确保跨页面跳转不消失
const aiState = reactive({
  isOpen: false,
  query: '',
  answer: '',
  results: [] as any[],
  loading: false
})

const isMinimized = ref(false)
const hideTimer = ref<any>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)

const { lang, theme } = useData()
const router = useRouter()

// IP 检测状态
const isChineseIP = ref(true)

// 国际化文本
const t = computed(() => theme.value.aiAssistant)

// 统一的 IP 检测逻辑
const checkIPLocation = async () => {
  try {
    const cachedResult = localStorage.getItem('isChineseIP');
    const cachedExpire = localStorage.getItem('isChineseIPExpire');
    
    if (cachedResult !== null && cachedExpire && Date.now() < parseInt(cachedExpire)) {
      isChineseIP.value = cachedResult === 'true';
      return;
    }

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const isChinaTZ = timeZone === 'Asia/Shanghai' || timeZone === 'Asia/Chongqing' || timeZone === 'Asia/Harbin' || timeZone === 'Asia/Urumqi';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
      const response = await fetch('https://ipapi.co/json/', {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        isChineseIP.value = data.country_code === 'CN';
      } else {
        isChineseIP.value = isChinaTZ;
      }
    } catch (e) {
      isChineseIP.value = isChinaTZ;
    }
    
    localStorage.setItem('isChineseIP', isChineseIP.value.toString());
    localStorage.setItem('isChineseIPExpire', (Date.now() + 24 * 60 * 60 * 1000).toString());
    
  } catch (error) {
    console.warn('[AI Search] IP check fallback:', error);
  }
};

// 渲染 Markdown
const renderedAnswer = computed(() => {
  return marked(aiState.answer)
})

const open = () => {
  aiState.isOpen = true
  isMinimized.value = false
  clearHideTimer()
  setTimeout(() => inputRef.value?.focus(), 100)
}

const close = () => {
  aiState.isOpen = false
  startHideTimer()
}

const toggleMinimized = () => {
  isMinimized.value = !isMinimized.value
  if (!isMinimized.value) {
    startHideTimer()
  }
}

const startHideTimer = () => {
  if (aiState.isOpen) return
  clearHideTimer()
  hideTimer.value = setTimeout(() => {
    isMinimized.value = true
  }, 5000)
}

const clearHideTimer = () => {
  if (hideTimer.value) {
    clearTimeout(hideTimer.value)
    hideTimer.value = null
  }
  isMinimized.value = false
}

const handleSearch = async () => {
  if (!aiState.query.trim() || aiState.loading) return
  
  aiState.loading = true
  aiState.answer = ''
  aiState.results = []
  
  try {
    const response = await fetch('http://localhost:3001/api/ai-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: aiState.query,
        lang: lang.value,
        isChina: isChineseIP.value
      })
    })
    
    const data = await response.json()
    aiState.answer = data.answer
    aiState.results = data.sources || []
    
    // 搜索完成后滚动到底部
    setTimeout(() => {
      if (contentRef.value) {
        contentRef.value.scrollTop = contentRef.value.scrollHeight
      }
    }, 100)
  } catch (error) {
    console.error('AI Search Error:', error)
    aiState.answer = t.value.errorText
  } finally {
    aiState.loading = false
  }
}

// 监听快捷键
const handleKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    if (aiState.isOpen) close()
    else open()
  }
  if (e.key === 'Escape' && aiState.isOpen) {
    close()
  }
}

// 监听滚动自动隐藏
const handleScroll = () => {
  if (!aiState.isOpen && !isMinimized.value) {
    isMinimized.value = true
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('scroll', handleScroll, { passive: true })
  checkIPLocation()
  startHideTimer()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('scroll', handleScroll)
  clearHideTimer()
})

defineExpose({ open })
</script>

<style scoped>
/* 样式将统一写入 style.css，这里仅作结构参考 */
</style>
