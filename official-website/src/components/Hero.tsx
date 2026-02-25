import { motion } from 'framer-motion';
import { ArrowRight, Download, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative pt-32 pb-20 overflow-hidden min-h-screen flex items-center">
      <div className="hero-glow" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-[var(--brand)]/10 text-[var(--brand)] mb-8 border border-[var(--brand)]/20">
              <Zap size={14} className="mr-2" /> {t('hero.badge')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight text-[var(--text-1)]"
            dangerouslySetInnerHTML={{ __html: t('hero.title') }}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-xl text-[var(--text-2)] mb-12"
          >
            {t('hero.description')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/download" className="btn-primary flex items-center gap-2 text-lg">
              {t('common.download')} <Download size={20} />
            </Link>
            <a href="https://www.zalithlauncher.cn/docs/projects/zl2" target="_blank" rel="noreferrer" className="px-8 py-3 rounded-full border border-[var(--divider)]/50 hover:bg-[var(--bg-alt)] transition-all flex items-center gap-2 text-lg text-[var(--text-1)]">
              {t('common.viewDocs')} <ArrowRight size={20} />
            </a>
          </motion.div>

          {/* Stats/Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="glass-card flex flex-col items-center">
              <div className="w-12 h-12 bg-[var(--brand)]/10 text-[var(--brand)] rounded-xl flex items-center justify-center mb-4">
                <Zap size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-[var(--text-1)]">{t('hero.speed')}</h3>
              <p className="text-sm text-[var(--text-2)]">{t('hero.speedDesc')}</p>
            </div>
            <div className="glass-card flex flex-col items-center">
              <div className="w-12 h-12 bg-[var(--brand)]/10 text-[var(--brand)] rounded-xl flex items-center justify-center mb-4">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-[var(--text-1)]">{t('hero.safe')}</h3>
              <p className="text-sm text-[var(--text-2)]">{t('hero.safeDesc')}</p>
            </div>
            <div className="glass-card flex flex-col items-center">
              <div className="w-12 h-12 bg-[var(--brand)]/10 text-[var(--brand)] rounded-xl flex items-center justify-center mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                  </svg>
                </motion.div>
              </div>
              <h3 className="font-bold text-lg mb-2 text-[var(--text-1)]">{t('hero.custom')}</h3>
              <p className="text-sm text-[var(--text-2)]">{t('hero.customDesc')}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
