<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

type ThemeId = 'custom' | 'native' | 'red' | 'sakura'

interface ThemeOption {
  id: ThemeId
  label: string
  color: string
}

const props = withDefaults(defineProps<{
  mode?: 'navbar' | 'navscreen'
}>(), {
  mode: 'navbar',
})

const themes: ThemeOption[] = [
  { id: 'custom', label: '默认', color: '#FE7A52' },
  { id: 'native', label: '原生', color: '#646cff' },
  { id: 'red', label: '珊瑚红', color: '#FF6B55' },
  { id: 'sakura', label: '樱花粉', color: '#FF8DA5' },
]

const current = ref<ThemeId>('custom')
const open = ref(false)

function applyTheme(id: ThemeId) {
  current.value = id
  if (id === 'native') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', id)
  }
  try {
    localStorage.setItem('zl-theme', id)
  } catch (_) { /* ignore */ }
  open.value = false
}

function toggleOpen() {
  open.value = !open.value
}

function handleClickOutside(e: MouseEvent) {
  const el = (e.target as HTMLElement).closest('.theme-switcher')
  if (!el) open.value = false
}

onMounted(() => {
  let stored: ThemeId = 'custom'
  try {
    const raw = localStorage.getItem('zl-theme')
    const ids: ThemeId[] = ['custom', 'native', 'red', 'sakura']
    if ((ids as string[]).includes(raw)) stored = raw as ThemeId
  } catch (_) { /* ignore */ }
  applyTheme(stored)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <!-- NavBar mode: compact button + dropdown -->
  <div v-if="mode === 'navbar'" class="theme-switcher">
    <button class="theme-btn" :title="themes.find(t => t.id === current)?.label" @click.stop="toggleOpen">
      <span class="theme-dot" :style="{ background: themes.find(t => t.id === current)?.color }"></span>
      <span class="theme-label">{{ themes.find(t => t.id === current)?.label }}</span>
      <span class="theme-arrow" :class="{ open }">&#9662;</span>
    </button>
    <Transition name="dropdown">
      <div v-if="open" class="theme-dropdown">
        <button
          v-for="t in themes"
          :key="t.id"
          class="theme-option"
          :class="{ active: current === t.id }"
          @click="applyTheme(t.id)"
        >
          <span class="option-dot" :style="{ background: t.color }"></span>
          <span class="option-label">{{ t.label }}</span>
          <span v-if="current === t.id" class="option-check">&#10003;</span>
        </button>
      </div>
    </Transition>
  </div>

  <!-- NavScreen mode: labeled section with inline buttons -->
  <div v-else class="theme-switcher-navscreen">
    <div class="navscreen-label">主题</div>
    <div class="navscreen-options">
      <button
        v-for="t in themes"
        :key="t.id"
        class="navscreen-option"
        :class="{ active: current === t.id }"
        @click="applyTheme(t.id)"
      >
        <span class="ns-dot" :style="{ background: t.color }"></span>
        <span>{{ t.label }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* ==================== NavBar mode ==================== */
.theme-switcher {
  position: relative;
  display: flex;
  align-items: center;
}

@media (max-width: 767px) {
  .theme-switcher {
    display: none;
  }
}

.theme-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.theme-btn:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.theme-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.theme-label {
  font-weight: 500;
}

.theme-arrow {
  font-size: 0.65rem;
  transition: transform 0.2s;
  opacity: 0.6;
}

.theme-arrow.open {
  transform: rotate(180deg);
}

.theme-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 130px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 4px;
  z-index: 100;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 7px 10px;
  border: none;
  border-radius: 5px;
  background: transparent;
  color: var(--vp-c-text-1);
  font-size: 0.82rem;
  cursor: pointer;
  transition: background 0.15s;
  text-align: left;
}

.theme-option:hover {
  background: var(--vp-c-bg-soft);
}

.theme-option.active {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.option-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.option-label {
  flex: 1;
  font-weight: 500;
}

.option-check {
  font-size: 0.75rem;
  opacity: 0.7;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ==================== NavScreen mode ==================== */
.theme-switcher-navscreen {
  padding: 12px 0 4px;
}

.navscreen-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 8px;
  padding: 0 24px;
}

.navscreen-options {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0 24px;
}

.navscreen-option {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.15s;
}

.navscreen-option:hover {
  border-color: var(--vp-c-brand-2);
  color: var(--vp-c-text-1);
}

.navscreen-option.active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.ns-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
