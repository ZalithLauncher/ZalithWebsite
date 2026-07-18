import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, AlertTriangle } from 'lucide-react';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--bg)]/70 transition-colors duration-300 flex items-center justify-center py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-[var(--brand)]/10 text-[var(--brand)]"
        >
          <AlertTriangle size={48} />
        </motion.div>

        <h1 className="text-6xl md:text-8xl font-bold text-[var(--text-1)] mb-4 tracking-tight">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-1)] mb-4">
          {t('notFound.title', 'Page Not Found')}
        </h2>
        <p className="text-[var(--text-2)] text-lg mb-10 max-w-md mx-auto">
          {t('notFound.description', "The page you're looking for doesn't exist or has been moved.")}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 btn-primary w-full sm:w-auto px-8 py-3 text-base"
          >
            <Home size={18} />
            {t('common.backToHome')}
          </Link>
          <Link
            to="/blog"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 rounded-full border border-[var(--divider)]/50 text-[var(--text-1)] hover:bg-[var(--bg-alt)] transition-all text-base"
          >
            <Search size={18} />
            {t('nav.blog')}
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
