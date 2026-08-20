import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const DISMISS_KEY = 'in-app-browser-notice-dismissed';

/**
 * Detect common in-app browsers that may cause rendering or download issues.
 * Covers QQ, WeChat, Douyin, Weibo, and other WebView-based browsers.
 * Note: MQQBrowser (QQ Browser app) is excluded as it's a normal browser.
 */
const isInAppBrowser = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  // QQ built-in browser (exclude MQQBrowser which is a standalone browser app)
  if (/\sQQ\//i.test(ua)) return true;
  // WeChat
  if (/MicroMessenger/i.test(ua) && !/WeChat/i.test(ua)) return true;
  // WeChat (international)
  if (/WeChat/i.test(ua)) return true;
  // Douyin / TikTok
  if (/aweme|BytedanceWebview|tiktok/i.test(ua)) return true;
  // Weibo
  if (/Weibo/i.test(ua)) return true;
  // Baidu
  if (/baiduboxapp/i.test(ua)) return true;
  // Generic WebView detection for known apps
  if (/WebView|wv/i.test(ua) && !/Chrome/i.test(ua)) return true;
  return false;
};

const InAppBrowserNotice = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(() => {
    if (!isInAppBrowser()) return false;
    try {
      return !sessionStorage.getItem(DISMISS_KEY);
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  const dismiss = () => {
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // ignore
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="glass-card p-8 max-w-md w-full text-center"
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[var(--brand)]/10 flex items-center justify-center text-[var(--brand)]">
              <ExternalLink size={26} />
            </div>
            <h2 className="text-xl font-bold text-[var(--text-1)] mb-3">
              {t('inAppBrowser.title')}
            </h2>
            <p className="text-sm text-[var(--text-2)] mb-4">
              {t('inAppBrowser.description')}
            </p>
            <p className="text-xs text-[var(--brand)] bg-[var(--brand)]/10 rounded-lg px-3 py-2 mb-6">
              {t('inAppBrowser.hint')}
            </p>
            <button
              onClick={dismiss}
              className="btn-primary w-full"
            >
              {t('inAppBrowser.continue')}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InAppBrowserNotice;
