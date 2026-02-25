import { useState, useEffect } from 'react';
import { Sun, Moon, Github, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const navLinks = [
    { name: '首页', path: '/' },
    { name: '特性', path: '/#features' },
    { name: '下载', path: '/download' },
    { name: '文档', path: 'https://www.zalithlauncher.cn/docs/projects/zl2', external: true },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-[var(--bg)]/80 backdrop-blur-lg border-b border-[var(--divider)]/20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/zl_icon.webp" alt="Logo" className="w-8 h-8 rounded-lg shadow-sm group-hover:scale-110 transition-transform" />
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--brand)] to-[var(--brand)] leading-none">
                Zalith Launcher
              </span>
              <span className="text-[10px] font-medium text-[var(--brand)] opacity-70 tracking-widest uppercase mt-0.5">
                Preview / Beta
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.external ? (
                <a 
                  key={link.name}
                  href={link.path} 
                  className="text-[var(--text-2)] hover:text-[var(--brand)] transition-colors font-medium"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-[var(--text-2)] hover:text-[var(--brand)] transition-colors font-medium ${
                    location.pathname === link.path ? 'text-[var(--brand)]' : ''
                  }`}
                >
                  {link.name}
                </Link>
              )
            ))}
            <div className="h-4 w-px bg-[var(--divider)]/50 mx-2" />
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-[var(--bg-alt)] transition-colors text-[var(--text-1)]"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <a href="https://github.com/ZalithLauncher" target="_blank" rel="noreferrer">
              <Github size={20} className="text-[var(--text-2)] hover:text-[var(--brand)] transition-colors" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-[var(--bg-alt)] transition-colors text-[var(--text-1)]"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full text-[var(--text-1)]"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[var(--bg)] border-b border-[var(--divider)]/20 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              {navLinks.map((link) => (
                link.external ? (
                  <a 
                    key={link.name}
                    href={link.path} 
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-lg text-[var(--text-2)] hover:text-[var(--brand)]"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block text-lg text-[var(--text-2)] hover:text-[var(--brand)] ${
                      location.pathname === link.path ? 'text-[var(--brand)]' : ''
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              ))}
              <a href="https://github.com/ZalithLauncher" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-lg text-[var(--text-2)] hover:text-[var(--brand)]">
                <Github size={20} /> GitHub
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
