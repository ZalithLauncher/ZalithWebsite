import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const DISMISS_KEY = 'in-app-browser-notice-dismissed';

/**
 * 检测 QQ App 内置浏览器（Mobile QQ 的 UA 含 " QQ/x.y.z"）。
 * 注意排除 MQQBrowser（QQ 浏览器 App，属于正常浏览器）。
 */
const isQQBuiltInBrowser = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return /\sQQ\//i.test(navigator.userAgent);
};

const InAppBrowserNotice = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(() => {
    if (!isQQBuiltInBrowser()) return false;
    try {
      return !sessionStorage.getItem(DISMISS_KEY);
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [visible]);

  const dismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // sessionStorage 不可用时仅在本次会话内隐藏
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[var(--bg)]/80 backdrop-blur-md"
          role="alertdialog"
          aria-modal="true"
          aria-label={t('inAppBrowser.title')}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="glass-card max-w-sm w-full text-center"
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[var(--brand)]/10 flex items-center justify-center text-[var(--brand)]">
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
