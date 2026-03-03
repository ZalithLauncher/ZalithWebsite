import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const MobileDownloadSection = () => {
  const { t } = useTranslation();

  return (
    <section className="scroll-section relative overflow-hidden flex items-center justify-center bg-[var(--bg-alt)]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center px-8"
      >
        <h3 className="text-2xl font-bold mb-4 text-[var(--text-1)]">
          {t('download.title')}
        </h3>
        <p className="text-[var(--text-2)] mb-8 max-w-xs mx-auto">
          {t('download.subtitle')}
        </p>
        <Link to="/download" className="btn-primary inline-flex items-center gap-2 text-lg">
          {t('common.download')} <ArrowRight size={20} />
        </Link>
      </motion.div>
    </section>
  );
};

export default MobileDownloadSection;
