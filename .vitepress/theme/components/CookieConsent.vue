<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useData } from 'vitepress'

const { theme } = useData()
const isVisible = ref(false)

onMounted(() => {
  const consent = localStorage.getItem('cookie-consent')
  if (!consent) {
    isVisible.value = true
  }
})

const acceptConsent = () => {
  localStorage.setItem('cookie-consent', 'true')
  isVisible.value = false
}
</script>

<template>
  <Transition name="fade">
    <div v-if="isVisible" class="cookie-consent">
      <div class="cookie-content">
        <p class="cookie-text">{{ theme.cookie.message }}</p>
        <button class="cookie-button" @click="acceptConsent">
          {{ theme.cookie.button }}
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.cookie-consent {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 800px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 16px 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(8px);
}

.cookie-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 20px;
}

.cookie-text {
  margin: 0;
  font-size: 14px;
  color: var(--vp-c-text-1);
  line-height: 1.5;
}

.cookie-button {
  background-color: var(--vp-c-brand-1);
  color: #fff;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s;
}

.cookie-button:hover {
  background-color: var(--vp-c-brand-2);
}

/* 移动端适配 */
@media (max-width: 640px) {
  .cookie-consent {
    bottom: 10px;
    padding: 12px 16px;
  }
  
  .cookie-content {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .cookie-button {
    width: 100%;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}
</style>
