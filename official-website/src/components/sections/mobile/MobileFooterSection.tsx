import { motion } from 'framer-motion';
import { Github, MessageSquare, Coffee, Heart, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const MobileFooterSection = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <section className="scroll-section relative overflow-hidden flex items-center bg-[var(--bg)]">
      <div className="w-full px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <img src="/zl_icon.webp" alt="Logo" className="w-8 h-8 rounded-lg" />
            <span className="font-bold text-lg text-[var(--text-1)]">Zalith Launcher</span>
          </div>
          <p className="text-xs text-[var(--text-2)] max-w-xs mx-auto">
            {t('footer.desc')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center gap-4 mb-6"
        >
          <a href="https://github.com/ZalithLauncher" target="_blank" rel="noreferrer"
            className="w-10 h-10 rounded-full bg-[var(--bg-alt)] flex items-center justify-center text-[var(--text-2)] hover:text-[var(--brand)] transition-colors">
            <Github size={18} />
          </a>
          <a href="https://discord.gg/e7C4kytRgK" target="_blank" rel="noreferrer"
            className="w-10 h-10 rounded-full bg-[var(--bg-alt)] flex items-center justify-center text-[var(--text-2)] hover:text-[var(--brand)] transition-colors">
            <MessageSquare size={18} />
          </a>
          <a href="https://afdian.com/a/MovTery" target="_blank" rel="noreferrer"
            className="w-10 h-10 rounded-full bg-[var(--bg-alt)] flex items-center justify-center text-[var(--text-2)] hover:text-[var(--brand)] transition-colors">
            <Coffee size={18} />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center gap-6 text-xs text-[var(--text-2)] mb-6"
        >
          <Link to="/download" className="hover:text-[var(--brand)] transition-colors">
            {t('common.downloadCenter')}
          </Link>
          <a href="https://www.zalithlauncher.cn/docs/projects/zl2" target="_blank" rel="noreferrer" className="hover:text-[var(--brand)] transition-colors">
            {t('common.docs')}
          </a>
          <Link to="/privacy" className="hover:text-[var(--brand)] transition-colors">
            {t('common.privacyPolicy')}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-xs text-[var(--text-2)] opacity-60"
        >
          <p className="flex items-center justify-center gap-1 mb-1">
            <Heart size={10} className="text-red-500" /> {t('footer.afdian')}
          </p>
          <p className="flex items-center justify-center gap-1 mb-1">
            <ShieldCheck size={10} /> {t('common.notAffiliated')}
          </p>
          <p>(c) {currentYear} Zalith Launcher Team</p>
        </motion.div>
      </div>
    </section>
  );
};

export default MobileFooterSection;
