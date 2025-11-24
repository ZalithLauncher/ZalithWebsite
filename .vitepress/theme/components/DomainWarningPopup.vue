<template>
  <div v-if="showPopup" class="domain-warning-popup">
    <div class="popup-content">
      <h3>访问提示</h3>
      <p>我们检测到您正在使用 <strong>zalithlauncher.cn</strong> 访问。为了获得更快的网站访问速度和更好的稳定性，我们强烈建议您访问我们的 EdgeOne CDN 节点：</p>
      <a href="https://www.zalithlauncher.cn" @click="redirectToWww">www.zalithlauncher.cn</a>
      <button @click="dismissPopup" class="close-button">我知道了</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const showPopup = ref(false);

onMounted(() => {
  // 仅在浏览器环境中执行
  if (typeof window !== 'undefined') {
    const currentHostname = window.location.hostname;
    const hasDismissed = localStorage.getItem('dismissedDomainWarning');

    console.log(`[Domain Check] Current Hostname: ${currentHostname}`);

    if (currentHostname === 'zalithlauncher.cn' && !hasDismissed) {
      console.log('[Domain Check] Condition met. Showing popup.');
      showPopup.value = true;
    } else if (hasDismissed) {
      console.log('[Domain Check] Popup has been dismissed previously.');
    } else {
      console.log('[Domain Check] Condition not met. Popup will not be shown.');
    }
  }
});

const dismissPopup = () => {
  showPopup.value = false;
  // 用户关闭后，在本地存储中记录状态，避免重复弹出
  if (typeof window !== 'undefined') {
    localStorage.setItem('dismissedDomainWarning', 'true');
  }
};

const redirectToWww = () => {
  dismissPopup();
};
</script>

<style scoped>
.domain-warning-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.popup-content {
  background-color: var(--vp-c-bg);
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  max-width: 450px;
  text-align: center;
  border: 1px solid var(--vp-c-divider);
}

.popup-content h3 {
  margin-top: 0;
  color: var(--vp-c-text-1);
  font-size: 1.5rem;
}

.popup-content p {
  margin-bottom: 20px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.popup-content a {
  display: inline-block;
  padding: 10px 20px;
  background-color: var(--vp-c-brand);
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.popup-content a:hover {
  background-color: var(--vp-c-brand-dark);
}

.close-button {
  margin-top: 20px;
  padding: 8px 16px;
  background-color: transparent;
  color: var(--vp-c-text-3);
  border: 1px solid var(--vp-c-divider);
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.close-button:hover {
  background-color: var(--vp-c-gray-soft);
  color: var(--vp-c-text-1);
}
</style>
