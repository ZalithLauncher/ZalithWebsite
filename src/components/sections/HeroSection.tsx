import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('zh') ? 'zh' : 'en';

  return (
    <section className="relative overflow-hidden flex flex-col items-center">
      <div className="relative w-full flex items-center min-h-[80svh] supports-[height:100dvh]:min-h-[80dvh] pt-16 pb-12 md:pb-16">
        <div className="hero-glow" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-6 px-4 py-1.5 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-sm font-medium border border-[var(--brand)]/20"
            >
              {t('hero.badge')}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text-1)] mb-6 leading-tight"
              dangerouslySetInnerHTML={{ __html: t('hero.title') }}
            />

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg lg:text-xl text-[var(--text-2)] mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              {t('hero.description')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/download"
                className="btn-primary inline-flex items-center justify-center gap-2 group"
              >
                <Download size={20} className="group-hover:animate-bounce" />
                {t('common.download')}
                <ArrowRight size={18} className="opacity-70 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="https://docs.zalithlauncher.cn/docs/projects/zl2"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[var(--divider)]/50 text-[var(--text-1)] hover:bg-[var(--bg-alt)] transition-all"
              >
                {t('common.viewDocs')}
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-8 md:py-12">
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
    </section>
  );
};

export default HeroSection;
