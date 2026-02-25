import { motion } from 'framer-motion';
import { Smartphone, Layout, Settings, Cpu, Globe, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Features = () => {
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
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: t('features.render.title'),
      description: t('features.render.desc')
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: t('features.i18n.title'),
      description: t('features.i18n.desc')
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: t('features.community.title'),
      description: t('features.community.desc')
    }
  ];

  return (
    <section id="features" className="py-24 bg-[var(--bg-alt)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--text-1)]">{t('features.title')}</h2>
          <p className="text-[var(--text-2)] max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-[var(--bg)] border border-[var(--divider)]/20 hover:border-[var(--brand)]/50 transition-all group shadow-sm hover:shadow-xl"
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

export default Features;
