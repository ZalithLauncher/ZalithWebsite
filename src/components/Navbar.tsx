import { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X, Globe, ExternalLink } from 'lucide-react';
import GithubIcon from './icons/GithubIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the mobile menu whenever the route changes
  const locationKey = location.pathname + location.hash;
  const [prevLocationKey, setPrevLocationKey] = useState(locationKey);
  if (prevLocationKey !== locationKey) {
    setPrevLocationKey(locationKey);
    setIsMenuOpen(false);
  }

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isMenuOpen]);

  // Close the drawer with Escape
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen]);

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.features'), path: '/#features' },
    { name: t('nav.download'), path: '/download' },
    { name: t('nav.blog'), path: '/blog' },
    { name: t('nav.docs'), path: 'https://docs.zalithlauncher.cn/docs/projects/zl2', external: true },
  ];

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('zh') ? 'en' : 'zh';
    i18n.changeLanguage(nextLang);
  };

  return (
    <>
    <nav
      className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
        isScrolled
          ? 'bg-[var(--bg)]/85 backdrop-blur-lg border-b border-[var(--divider)]/30 shadow-sm shadow-black/5'
          : 'bg-[var(--bg)]/40 backdrop-blur-md border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/zl_icon.webp" alt="Logo" className="w-8 h-8 rounded-lg shadow-sm group-hover:scale-110 transition-transform" />
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--brand)] to-[var(--brand)] leading-none">
                Zalith Launcher
              </span>
              <span className="text-[10px] font-medium text-[var(--brand)] opacity-70 tracking-widest uppercase mt-0.5">
                {t('common.beta')}
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = !link.external && location.pathname === link.path;
              return link.external ? (
                <a
                  key={link.name}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-2)] hover:text-[var(--brand)] transition-colors font-medium inline-flex items-center gap-1"
                >
                  {link.name}
                  <ExternalLink size={14} className="opacity-60" />
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative py-1 text-[var(--text-2)] hover:text-[var(--brand)] transition-colors font-medium ${
                    isActive ? 'text-[var(--brand)]' : ''
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="navbar-active-underline"
                      className="absolute left-0 right-0 -bottom-1 h-0.5 rounded-full bg-[var(--brand)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
            <div className="h-4 w-px bg-[var(--divider)]/50 mx-2" />

            <button
              onClick={toggleLanguage}
              className="p-2 rounded-full hover:bg-[var(--bg-alt)] transition-colors text-[var(--text-1)] flex items-center gap-1.5"
              title={t('common.switchLanguage')}
              aria-label={t('common.switchLanguage')}
            >
              <Globe size={18} />
              <span className="text-xs font-bold uppercase">{i18n.language.startsWith('zh') ? 'EN' : '中文'}</span>
            </button>

            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-[var(--bg-alt)] transition-colors text-[var(--text-1)]"
              aria-label={isDark ? t('common.switchToLight') : t('common.switchToDark')}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <a
              href="https://github.com/ZalithLauncher"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <GithubIcon size={20} className="text-[var(--text-2)] hover:text-[var(--brand)] transition-colors" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full text-[var(--text-1)]"
              aria-label={isMenuOpen ? t('common.closeMenu') : t('common.openMenu')}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

    </nav>

    {/* Mobile Drawer: right-side slide-in */}
    <AnimatePresence>
      {isMenuOpen && [
        <motion.div
          key="drawer-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={() => setIsMenuOpen(false)}
          className="md:hidden fixed inset-0 z-[90] bg-black/45 backdrop-blur-sm"
        />,
        <motion.div
          key="drawer-panel"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          className="md:hidden fixed top-0 right-0 bottom-0 z-[95] w-[80%] max-w-xs bg-[var(--bg)]/95 backdrop-blur-xl border-l border-[var(--divider)]/20 shadow-2xl shadow-black/25 flex flex-col"
        >
          <div className="flex-1 overflow-y-auto px-6 pt-24 pb-6">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.name}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-1.5 py-3 text-lg text-[var(--text-2)] hover:text-[var(--brand)]"
                >
                  {link.name}
                  <ExternalLink size={16} className="opacity-60" />
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-3 text-lg text-[var(--text-2)] hover:text-[var(--brand)] ${
                    location.pathname === link.path ? 'text-[var(--brand)]' : ''
                  }`}
                >
                  {link.name}
                </Link>
              ),
            )}
          </div>

          <div className="px-6 py-5 border-t border-[var(--divider)]/20 flex items-center justify-between gap-3">
            <button
              onClick={() => setIsDark(!isDark)}
              aria-label={isDark ? t('common.switchToLight') : t('common.switchToDark')}
              title={isDark ? t('common.switchToLight') : t('common.switchToDark')}
              className="p-2.5 rounded-full border border-[var(--divider)]/40 text-[var(--text-2)] hover:text-[var(--brand)] hover:border-[var(--brand)]/40 transition-colors"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={toggleLanguage}
              aria-label={t('common.switchLanguage')}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-full border border-[var(--divider)]/40 text-sm font-bold text-[var(--text-2)] hover:text-[var(--brand)] hover:border-[var(--brand)]/40 transition-colors"
            >
              <Globe size={16} />
              <span className="uppercase">{i18n.language.startsWith('zh') ? 'EN' : '中文'}</span>
            </button>

            <a
              href="https://github.com/ZalithLauncher"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="p-2.5 rounded-full border border-[var(--divider)]/40 text-[var(--text-2)] hover:text-[var(--brand)] hover:border-[var(--brand)]/40 transition-colors"
            >
              <GithubIcon size={18} />
            </a>
          </div>
        </motion.div>,
      ]}
    </AnimatePresence>
    </>
  );
};

export default Navbar;
