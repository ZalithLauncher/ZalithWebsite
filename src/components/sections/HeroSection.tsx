import { motion } from 'framer-motion';
import { ArrowRight, Download, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('zh') ? 'zh' : 'en';

  return (
    <section className="relative overflow-hidden flex flex-col items-center min-h-screen pt-16 md:pt-16">
      <div className="hero-glow" />

      <div className="flex-grow flex items-center w-full py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-[var(--brand)]/10 text-[var(--brand)] mb-6 md:mb-8 border border-[var(--brand)]/20">
                <Zap size={14} className="mr-2" /> {t('hero.badge')}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6 md:mb-8 leading-tight text-[var(--text-1)]"
              dangerouslySetInnerHTML={{ __html: t('hero.title') }}
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl mx-auto text-lg md:text-xl text-[var(--text-2)] mb-8 md:mb-12"
            >
              {t('hero.description')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/download" className="btn-primary flex items-center gap-2 text-lg w-full sm:w-auto justify-center">
                {t('common.download')} <Download size={20} />
              </Link>
              <a href="https://www.zalithlauncher.cn/docs/projects/zl2" target="_blank" rel="noreferrer" className="px-8 py-3 rounded-full border border-[var(--divider)]/50 hover:bg-[var(--bg-alt)] transition-all flex items-center gap-2 text-lg text-[var(--text-1)] w-full sm:w-auto justify-center">
                {t('common.viewDocs')} <ArrowRight size={20} />
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-12 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-[var(--divider)]/10"
        >
          <img 
            src={`/image/${lang}/home.jpg`}
            alt="Zalith Launcher Home"
            className="w-full h-[300px] md:h-auto object-cover md:object-contain object-[right_top] md:object-center transform hover:scale-[1.01] transition-transform duration-700"
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-[var(--divider)] rounded-full flex justify-center pt-2"
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 bg-[var(--brand)] rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
