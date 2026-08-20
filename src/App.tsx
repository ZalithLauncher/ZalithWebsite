import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import InAppBrowserNotice from './components/InAppBrowserNotice';
import Home from './pages/Home';
import { usePageMeta } from './hooks/usePageMeta';
import { useTranslation } from 'react-i18next';

// Code-split less-frequently visited pages
const DownloadPage = lazy(() => import('./pages/DownloadPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const BlogListPage = lazy(() => import('./pages/BlogListPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const ROUTE_META: Record<string, { zh: { title: string; description: string }; en: { title: string; description: string } }> = {
  '/': {
    zh: {
      title: '',
      description: '在 Android 设备上游玩 Minecraft: Java Edition，稳定、高效、纯净。',
    },
    en: {
      title: '',
      description: 'Play Minecraft: Java Edition on Android — stable, efficient, clean.',
    },
  },
  '/download': {
    zh: {
      title: '下载中心',
      description: '获取适合您设备的 Zalith Launcher 版本，多源镜像加速下载。',
    },
    en: {
      title: 'Download Center',
      description: 'Get the right Zalith Launcher build for your device. Multi-source mirror acceleration.',
    },
  },
  '/blog': {
    zh: {
      title: '博客',
      description: '了解 Zalith Launcher 的最新动态、开发日志和教程文章。',
    },
    en: {
      title: 'Blog',
      description: 'Latest updates, dev logs, and tutorials for Zalith Launcher.',
    },
  },
  '/privacy': {
    zh: {
      title: '隐私政策',
      description: '了解 Zalith Launcher 官方网站如何处理您的数据。',
    },
    en: {
      title: 'Privacy Policy',
      description: 'Learn how Zalith Launcher handles your data.',
    },
  },
  '/terms': {
    zh: {
      title: '服务条款',
      description: '使用 Zalith Launcher 官方网站的服务条款。',
    },
    en: {
      title: 'Terms of Service',
      description: 'Terms of service for the Zalith Launcher website.',
    },
  },
};

const DEFAULT_META = {
  zh: { title: '', description: '在 Android 设备上游玩 Minecraft: Java Edition，稳定、高效、纯净。' },
  en: { title: '', description: 'Play Minecraft: Java Edition on Android — stable, efficient, clean.' },
};

const PageFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-[var(--brand)] border-t-transparent rounded-full animate-spin" />
  </div>
);

const AppContent = () => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const isHomePage = location.pathname === '/';
  const lang = i18n.language.startsWith('zh') ? 'zh' : 'en';

  const routeMeta = ROUTE_META[location.pathname];
  const meta = (routeMeta?.[lang] ?? DEFAULT_META[lang]) ?? DEFAULT_META.zh;

  usePageMeta({
    title: meta.title,
    description: meta.description,
  });

  return (
    <div className="min-h-screen">
      <InAppBrowserNotice />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:px-4 focus:py-2 focus:bg-[var(--brand)] focus:text-white focus:rounded-lg"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className={isHomePage ? '' : 'pt-16'}>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/download" element={<DownloadPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/blog" element={<BlogListPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      {!isHomePage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
