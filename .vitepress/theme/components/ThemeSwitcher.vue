<script setup lang="ts">
import { ref, onMounted, onUnmounted, inject, watchPostEffect } from 'vue'
import { useData } from 'vitepress'

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

const { isDark, site, theme } = useData()

const toggleAppearance = inject<() => void>('toggle-appearance', () => {
  isDark.value = !isDark.value
})

const themes: ThemeOption[] = [
  { id: 'custom', label: '默认', color: '#FE7A52' },
  { id: 'native', label: '原生', color: '#646cff' },
  { id: 'red', label: '珊瑚红', color: '#FF6B55' },
  { id: 'sakura', label: '樱花粉', color: '#FF8DA5' },
]

const current = ref<ThemeId>('custom')
const open = ref(false)
const switchTitle = ref('')

const showAppearance = !!(site.value.appearance &&
  site.value.appearance !== 'force-dark' &&
  site.value.appearance !== 'force-auto')

watchPostEffect(() => {
  switchTitle.value = isDark.value
    ? theme.value.lightModeSwitchTitle || 'Switch to light theme'
    : theme.value.darkModeSwitchTitle || 'Switch to dark theme'
})

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
  <!-- NavBar mode: appearance icon button + combined dropdown -->
  <div v-if="mode === 'navbar'" class="theme-switcher">
    <button
      class="theme-btn"
      :title="switchTitle"
      @click.stop="toggleOpen"
    >
      <span class="vpi-sun sun-icon" />
      <span class="vpi-moon moon-icon" />
      <span class="theme-arrow" :class="{ open }">&#9662;</span>
    </button>
    <Transition name="dropdown">
      <div v-if="open" class="theme-dropdown">
        <!-- Appearance row -->
        <div v-if="showAppearance" class="dropdown-row">
          <span class="dropdown-label">{{ theme.darkModeSwitchLabel || 'Appearance' }}</span>
          <button
            :title="switchTitle"
            class="appearance-toggle"
            :aria-checked="isDark"
            @click="toggleAppearance"
          >
            <span class="toggle-track">
              <span class="toggle-thumb"></span>
            </span>
          </button>
        </div>
        <div v-if="showAppearance" class="dropdown-divider"></div>
        <!-- Theme options -->
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

  <!-- NavScreen mode: combined card -->
  <div v-else class="navscreen-card">
    <!-- Appearance row -->
    <div v-if="showAppearance" class="navscreen-appearance-row">
      <p class="navscreen-label">{{ theme.darkModeSwitchLabel || 'Appearance' }}</p>
      <button
        :title="switchTitle"
        class="appearance-toggle"
        :aria-checked="isDark"
        @click="toggleAppearance"
      >
        <span class="toggle-track">
          <span class="toggle-thumb"></span>
        </span>
      </button>
    </div>
    <div v-if="showAppearance" class="navscreen-divider"></div>
    <!-- Theme row -->
    <p class="navscreen-label">主题</p>
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
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: color 0.25s;
  position: relative;
}

.theme-btn:hover {
  color: var(--vp-c-text-1);
}

.sun-icon,
.moon-icon {
  width: 18px;
  height: 18px;
  position: absolute;
  transition: opacity 0.2s;
}

.sun-icon {
  opacity: 1;
}

.moon-icon {
  opacity: 0;
}

:global(.dark) .sun-icon {
  opacity: 0;
}

:global(.dark) .moon-icon {
  opacity: 1;
}

.theme-arrow {
  font-size: 0.5rem;
  transition: transform 0.2s;
  opacity: 0.5;
  margin-left: 22px;
}

.theme-arrow.open {
  transform: rotate(180deg);
}

.theme-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 160px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 6px;
  z-index: 100;
}

/* Appearance row inside dropdown */
.dropdown-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
}

.dropdown-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.dropdown-divider {
  height: 1px;
  background: var(--vp-c-divider);
  margin: 4px 6px;
}

/* Theme option */
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

/* ==================== Appearance Toggle ==================== */
.appearance-toggle {
  display: flex;
  align-items: center;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}

.toggle-track {
  width: 32px;
  height: 18px;
  border-radius: 9px;
  background: var(--vp-c-divider);
  position: relative;
  transition: background 0.2s;
}

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
}

.appearance-toggle[aria-checked="true"] .toggle-track {
  background: var(--vp-c-brand-2);
}

.appearance-toggle[aria-checked="true"] .toggle-thumb {
  transform: translateX(14px);
}

/* ==================== Transitions ==================== */
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
.navscreen-card {
  border-radius: 8px;
  padding: 12px 14px 12px 16px;
  background-color: var(--vp-c-bg-soft);
  margin-top: 16px;
}

.navscreen-appearance-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navscreen-label {
  line-height: 24px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  margin: 0;
}

.navscreen-divider {
  height: 1px;
  background: var(--vp-c-divider);
  margin: 10px 0;
}

.navscreen-options {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.navscreen-option {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
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
