import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import InAppBrowserNotice from './components/InAppBrowserNotice';
import Home from './pages/Home';
import DownloadPage from './pages/DownloadPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import BlogListPage from './pages/BlogListPage';
import BlogPostPage from './pages/BlogPostPage';
import NotFoundPage from './pages/NotFoundPage';
import { usePageMeta } from './hooks/usePageMeta';

const ROUTE_META: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Zalith Launcher',
    description: '在 Android 设备上游玩 Minecraft: Java Edition，稳定、高效、纯净。',
  },
  '/download': {
    title: '下载中心',
    description: '获取适合您设备的 Zalith Launcher 版本，多源镜像加速下载。',
  },
  '/blog': {
    title: '博客',
    description: '了解 Zalith Launcher 的最新动态、开发日志和教程文章。',
  },
  '/privacy': {
    title: '隐私政策',
    description: '了解 Zalith Launcher 官方网站如何处理您的数据。',
  },
  '/terms': {
    title: '服务条款',
    description: '使用 Zalith Launcher 官方网站的服务条款。',
  },
};

const AppContent = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const meta = ROUTE_META[location.pathname] || {
    title: 'Zalith Launcher',
    description: '在 Android 设备上游玩 Minecraft: Java Edition，稳定、高效、纯净。',
  };

  usePageMeta({
    title: meta.title,
    description: meta.description,
  });

  return (
    <div className="min-h-screen">
      <InAppBrowserNotice />
      <Navbar />
      <main className={isHomePage ? '' : 'pt-16'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/download" element={<DownloadPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
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
