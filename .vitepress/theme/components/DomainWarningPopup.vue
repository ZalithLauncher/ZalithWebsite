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

    console.log(`[Domain Check] Current Hostname | 检测访问域名: ${currentHostname}`);

    if (currentHostname === 'zalithlauncher.cn' && !hasDismissed) {
      console.log('[Domain Check] Condition met. Showing popup. | 检测到访问域名为 zalithlauncher.cn，未被用户ismissedDomainWarning.');
      showPopup.value = true;
    } else if (hasDismissed) {
      console.log('[Domain Check] Popup has been dismissed previously. | 用户已ismissedDomainWarning.');
    } else {
      console.log('[Domain Check] Condition not met. Popup will not be shown. | 访问域名不是 zalithlauncher.cn，不会弹出提示.');
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
  background-color: var(--vp-c-bg-mask);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: var(--vp-z-index-modal);
}

.popup-content {
  background-color: var(--vp-c-bg);
  padding: 24px;
  border-radius: var(--vp-border-radius);
  box-shadow: var(--vp-shadow-3);
  max-width: 480px;
  text-align: center;
  border: 1px solid var(--vp-c-divider);
}

.popup-content h3 {
  margin-top: 0;
  color: var(--vp-c-text-1);
  font-size: var(--vp-custom-block-heading-font-size);
  font-weight: var(--vp-custom-block-heading-font-weight);
}

.popup-content p {
  margin-bottom: 16px;
  color: var(--vp-c-text-2);
  line-height: var(--vp-custom-block-line-height);
}

.popup-content a {
  display: inline-block;
  padding: 10px 20px;
  background-color: var(--vp-c-brand-1);
  color: var(--vp-c-white);
  text-decoration: none;
  border-radius: var(--vp-border-radius);
  font-weight: var(--vp-font-weight-bold);
  transition: background-color var(--vp-t-color);
}

.popup-content a:hover {
  background-color: var(--vp-c-brand-2);
}

.close-button {
  margin-top: 16px;
  padding: 8px 16px;
  background-color: transparent;
  color: var(--vp-c-text-3);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--vp-border-radius);
  cursor: pointer;
  transition: background-color var(--vp-t-color), color var(--vp-t-color);
}

.close-button:hover {
  background-color: var(--vp-c-gray-soft);
  color: var(--vp-c-text-1);
}
</style>
