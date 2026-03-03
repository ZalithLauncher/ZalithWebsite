import { motion } from 'framer-motion';
import { ShieldCheck, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const StatsSection = () => {
  const { t } = useTranslation();

  const stats = [
    {
      icon: <Zap size={24} />,
      title: t('hero.speed'),
      description: t('hero.speedDesc')
    },
    {
      icon: <ShieldCheck size={24} />,
      title: t('hero.safe'),
      description: t('hero.safeDesc')
    },
    {
      icon: (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
          </svg>
        </motion.div>
      ),
      title: t('hero.custom'),
      description: t('hero.customDesc')
    }
  ];

  return (
    <section className="scroll-section relative overflow-hidden flex items-center bg-[var(--bg-alt)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-1)]">
            {t('features.title')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="glass-card flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 bg-[var(--brand)]/10 text-[var(--brand)] rounded-xl flex items-center justify-center mb-5">
                {stat.icon}
              </div>
              <h3 className="font-bold text-xl mb-3 text-[var(--text-1)]">{stat.title}</h3>
              <p className="text-[var(--text-2)]">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
