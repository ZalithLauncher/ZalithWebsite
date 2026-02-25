import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DownloadSection from '../components/Download';

const DownloadPage = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="pt-16 min-h-screen bg-[var(--bg)] transition-colors duration-300">
      {/* Optional: Add a simple page header here if needed */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <h1 className="text-3xl font-bold text-center mb-2 text-[var(--text-1)]">下载中心</h1>
        <p className="text-[var(--text-2)] text-center">获取最适合您设备的 Zalith Launcher 版本</p>
      </div>
      <DownloadSection />
    </div>
  );
};

export default DownloadPage;
