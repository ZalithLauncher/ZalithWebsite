import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import InAppBrowserNotice from './components/InAppBrowserNotice';
import Home from './pages/Home';
import { usePageMeta } from './hooks/usePageMeta';

// Code-split less-frequently visited pages
const DownloadPage = lazy(() => import('./pages/DownloadPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const BlogListPage = lazy(() => import('./pages/BlogListPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// 中文文案仍保留在 src/i18n/locales/zh.ts，但不再注册到 i18n —— 站点只构建英文。
// The Chinese copy still lives in src/i18n/locales/zh.ts but is no longer registered
// in i18n, so the site builds English only.
const ROUTE_META: Record<string, { title: string; description: string }> = {
  '/': {
    title: '',
    description: 'Play Minecraft: Java Edition on Android — stable, efficient, clean.',
  },
  '/download': {
    title: 'Download Center',
    description: 'Get the right Zalith Launcher build for your device. Multi-source mirror acceleration.',
  },
  '/blog': {
    title: 'Blog',
    description: 'Latest updates, dev logs, and tutorials for Zalith Launcher.',
  },
  '/privacy': {
    title: 'Privacy Policy',
    description: 'Learn how Zalith Launcher handles your data.',
  },
  '/terms': {
    title: 'Terms of Service',
    description: 'Terms of service for the Zalith Launcher website.',
  },
};

const DEFAULT_META = {
  title: '',
  description: 'Play Minecraft: Java Edition on Android — stable, efficient, clean.',
};

const PageFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-[var(--brand)] border-t-transparent rounded-full animate-spin" />
  </div>
);

const AppContent = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const routeMeta = ROUTE_META[location.pathname] ?? DEFAULT_META;

  usePageMeta({
    title: routeMeta.title,
    description: routeMeta.description,
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
  // 应用挂载后淡出并移除启动加载页
  useEffect(() => {
    const loader = document.getElementById('boot-loader');
    if (!loader) return;
    loader.classList.add('boot-done');
    window.setTimeout(() => loader.remove(), 700);
  }, []);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
