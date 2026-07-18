import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';

const FeaturesSection = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('zh') ? 'zh' : 'en';

  const features = [
    {
      id: 'ui',
      title: t('features.ui.title'),
      description: t('features.ui.desc'),
      image: 'home.jpg'
    },
    {
      id: 'download',
      title: t('features.download.title'),
      description: t('features.download.desc'),
      image: 'download_modpack.jpg'
    },
    {
      id: 'version',
      title: t('features.version.title'),
      description: t('features.version.desc'),
      image: 'version_management.jpg'
    },
    {
      id: 'render',
      title: t('features.render.title'),
      description: t('features.render.desc'),
      image: 'renderer.jpg'
    },
    {
      id: 'multiplayer',
      title: t('features.multiplayer.title'),
      description: t('features.multiplayer.desc'),
      image: 'multiplayer.jpg'
    },
    {
      id: 'settings',
      title: t('features.settings.title'),
      description: t('features.settings.desc'),
      image: 'launcher_settings.jpg'
    }
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-[var(--bg-alt)]/70 transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-[var(--text-1)]"
          >
            {t('features.title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="text-[var(--text-2)] max-w-2xl mx-auto text-base md:text-lg"
          >
            {t('features.subtitle')}
          </motion.p>
        </div>

        <div className="space-y-16 md:space-y-24 lg:space-y-32">
          {features.map((feature, index) => {
            const isEven = index % 2 === 0;
            return (
              <div 
                key={feature.id} 
                className={cn(
                  "flex flex-col gap-10 md:gap-12 lg:gap-16 items-center",
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                )}
              >
                {/* Text Content */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? -30 : 30, y: 20 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="w-full md:w-1/2 space-y-3 md:space-y-6 flex flex-col items-start text-left"
                >
                  <h3 className="text-xl sm:text-2xl md:text-4xl font-bold text-[var(--text-1)] leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-[var(--text-2)] leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>

                {/* Image Content */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? 30 : -30, y: 20 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                  className="w-full md:w-1/2"
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[var(--divider)]/10 group transition-all duration-500 group-hover:-translate-y-1 group-hover:border-[var(--brand)]/40 group-hover:shadow-[var(--brand)]/20">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[var(--brand)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
                    <img 
                      src={`/image/${lang}/${feature.image}`} 
                      alt={feature.title}
                      className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (lang !== 'zh' && !target.src.includes('/image/zh/')) {
                          target.src = `/image/zh/${feature.image}`;
                        }
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;