import { motion } from 'framer-motion';
import { Layout, Cpu, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FeaturesSection1 = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Layout className="w-6 h-6" />,
      title: t('features.ui.title'),
      description: t('features.ui.desc')
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: t('features.core.title'),
      description: t('features.core.desc')
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: t('features.version.title'),
      description: t('features.version.desc')
    }
  ];

  return (
    <section className="scroll-section relative overflow-hidden flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--text-1)]">
            {t('features.subtitle')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="p-8 rounded-2xl bg-[var(--bg-alt)] border border-[var(--divider)]/20 hover:border-[var(--brand)]/50 transition-all group shadow-sm hover:shadow-xl"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-[var(--text-1)]">{feature.title}</h3>
              <p className="text-[var(--text-2)] leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection1;
