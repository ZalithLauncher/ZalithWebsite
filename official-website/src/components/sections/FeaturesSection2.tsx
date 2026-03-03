import { motion } from 'framer-motion';
import { Smartphone, Globe, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FeaturesSection2 = () => {
  const { t } = useTranslation();

  const features = [
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
    <section className="scroll-section relative overflow-hidden flex items-center bg-[var(--bg-alt)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center"
        >
          <div className="glass-card inline-block px-12 py-8">
            <h3 className="text-2xl font-bold mb-4 text-[var(--text-1)]">
              {t('download.title')}
            </h3>
            <p className="text-[var(--text-2)] mb-6 max-w-md">
              {t('download.subtitle')}
            </p>
            <Link to="/download" className="btn-primary inline-flex items-center gap-2 text-lg">
              {t('common.download')} <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection2;
