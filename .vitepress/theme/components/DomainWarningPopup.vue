<template>
  <div v-if="showPopup" class="domain-warning-popup">
    <div class="popup-content">
      <h3>{{ warningText.title }}</h3>
      <p v-html="warningText.content"></p>
      <a href="https://www.zalithlauncher.cn" @click="redirectToWww">{{ warningText.officialDomain }}</a>
      <button @click="dismissPopup" class="close-button">{{ warningText.button }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useData } from 'vitepress';

const { theme } = useData();
const showPopup = ref(false);
const currentHostname = ref('');
const isChineseIP = ref(true);
const ipCheckDone = ref(false);

// IP检测函数
const checkIPLocation = async () => {
  try {
    // 检查本地缓存
    const cachedResult = localStorage.getItem('isChineseIP');
    if (cachedResult !== null) {
      isChineseIP.value = cachedResult === 'true';
      ipCheckDone.value = true;
      return;
    }

    // 使用ipapi.co进行IP检测
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      timeout: 3000
    });
    
    if (response.ok) {
      const data = await response.json();
      const countryCode = data.country_code;
      isChineseIP.value = countryCode === 'CN';
      console.log(`[IP Check] Country code: ${countryCode}, isChineseIP: ${isChineseIP.value}`);
      
      // 缓存检测结果，有效期24小时
      localStorage.setItem('isChineseIP', isChineseIP.value.toString());
      localStorage.setItem('isChineseIPExpire', (Date.now() + 24 * 60 * 60 * 1000).toString());
    } else {
      console.error('[IP Check] Failed to get IP data:', response.status);
    }
  } catch (error) {
    console.error('[IP Check] Error during IP detection:', error);
  } finally {
    ipCheckDone.value = true;
  }
};

// 计算当前使用的语言
const currentLang = computed(() => {
  // 非中国IP直接使用英文
  if (!isChineseIP.value) {
    return 'en';
  }
  // 中国IP使用当前站点语言
  return typeof window !== 'undefined' ? window.location.pathname.startsWith('/en/') ? 'en' : 'zh' : 'zh';
});

// 计算警告文本
const warningText = computed(() => {
  const themeConfig = theme.value;
  const domainWarning = themeConfig.domainWarning;
  
  // 根据当前语言获取相应的文本
  let content = domainWarning.content;
  if (typeof content === 'string') {
    content = content.replace('{{ currentHostname }}', currentHostname.value);
  }
  
  return {
    title: domainWarning.title,
    content: content,
    button: domainWarning.button,
    officialDomain: domainWarning.officialDomain
  };
});

onMounted(async () => {
  // 仅在浏览器环境中执行
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    currentHostname.value = hostname;
    const hasDismissed = localStorage.getItem('dismissedDomainWarning');
    
    // 检查IP检测结果是否过期
    const expireTime = localStorage.getItem('isChineseIPExpire');
    if (expireTime && Date.now() > parseInt(expireTime)) {
      localStorage.removeItem('isChineseIP');
      localStorage.removeItem('isChineseIPExpire');
    }

    console.log(`[Domain Check] Current Hostname | 检测访问域名: ${hostname}`);

    // 白名单域名列表
    const whitelistDomains = ['www.zalithlauncher.cn', 'al.zalithlauncher.cn'];
    
    if (!whitelistDomains.includes(hostname) && !hasDismissed) {
      console.log(`[Domain Check] Condition met. Showing popup. | 检测到访问域名不是白名单域名，未被用户关闭.`);
      
      // 执行IP检测
      await checkIPLocation();
      
      showPopup.value = true;
    } else if (hasDismissed) {
      console.log('[Domain Check] Popup has been dismissed previously. | 用户已关闭过弹窗.');
    } else {
      console.log(`[Domain Check] Condition not met. Popup will not be shown. | 访问域名 ${hostname} 是白名单域名或已被用户关闭，不会弹出提示.`);
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
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.popup-content {
  background-color: var(--vp-c-bg);
  padding: 32px;
  border-radius: 12px;
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
  margin-bottom: 24px;
  color: var(--vp-c-text-2);
  line-height: var(--vp-custom-block-line-height);
}

.popup-content a {
  display: block;
  padding: 12px 24px;
  background-color: var(--vp-c-brand-1);
  color: var(--vp-c-white);
  text-decoration: none;
  border-radius: 8px;
  font-weight: var(--vp-font-weight-bold);
  transition: background-color var(--vp-t-color);
  margin-bottom: 12px;
}

.popup-content a:hover {
  background-color: var(--vp-c-brand-2);
}

.close-button {
  margin-top: 0;
  padding: 10px 20px;
  background-color: transparent;
  color: var(--vp-c-text-3);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  cursor: pointer;
  transition: background-color var(--vp-t-color), color var(--vp-t-color);
}

.close-button:hover {
  background-color: var(--vp-c-gray-soft);
  color: var(--vp-c-text-1);
}
</style>
