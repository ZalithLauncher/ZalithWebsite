import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en';

// 站点只构建英文：中文语言包 ./locales/zh.ts 仍保留在仓库中，但不再被引入或注册，
// 语言检测与语言切换一并移除。
// The site builds English only. The Chinese locale (./locales/zh.ts) is kept in the
// repository but is no longer imported or registered, and language detection/switching
// has been removed.
i18n.use(initReactI18next).init({
  lng: 'en',
  resources: {
    en: { translation: en },
  },
  supportedLngs: ['en'],
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

// Keep <html lang> in sync
if (typeof document !== 'undefined') {
  document.documentElement.lang = 'en';
}

export default i18n;
