import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Zap, ShieldCheck, Layout, Cpu, Settings, Smartphone, Globe, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ScrollContainer from '../components/ScrollContainer';
import HeroSection from '../components/sections/HeroSection';
import StatsSection from '../components/sections/StatsSection';
import FeaturesSection1 from '../components/sections/FeaturesSection1';
import FeaturesSection2 from '../components/sections/FeaturesSection2';
import FooterSection from '../components/sections/FooterSection';
import MobileStatsSection from '../components/sections/mobile/MobileStatsSection';
import MobileFeatureSection from '../components/sections/mobile/MobileFeatureSection';
import MobileDownloadSection from '../components/sections/mobile/MobileDownloadSection';
import MobileFooterSection from '../components/sections/mobile/MobileFooterSection';

const Home = () => {
  const { hash } = useLocation();
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

  const stats = [
    { icon: <Zap size={32} />, title: t('hero.speed'), description: t('hero.speedDesc') },
    { icon: <ShieldCheck size={32} />, title: t('hero.safe'), description: t('hero.safeDesc') },
    {
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
        </svg>
      ),
      title: t('hero.custom'),
      description: t('hero.customDesc')
    }
  ];

  const features1 = [
    { icon: <Layout className="w-8 h-8" />, title: t('features.ui.title'), description: t('features.ui.desc') },
    { icon: <Cpu className="w-8 h-8" />, title: t('features.core.title'), description: t('features.core.desc') },
    { icon: <Settings className="w-8 h-8" />, title: t('features.version.title'), description: t('features.version.desc') }
  ];

  const features2 = [
    { icon: <Smartphone className="w-8 h-8" />, title: t('features.render.title'), description: t('features.render.desc') },
    { icon: <Globe className="w-8 h-8" />, title: t('features.i18n.title'), description: t('features.i18n.desc') },
    { icon: <Users className="w-8 h-8" />, title: t('features.community.title'), description: t('features.community.desc') }
  ];

  if (isMobile) {
    return (
      <ScrollContainer>
        <HeroSection />
        {stats.map((stat, index) => (
          <MobileStatsSection
            key={index}
            icon={stat.icon}
            title={stat.title}
            description={stat.description}
            bgClass={index % 2 === 1 ? 'bg-[var(--bg-alt)]' : ''}
          />
        ))}
        {features1.map((feature, index) => (
          <MobileFeatureSection
            key={`f1-${index}`}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            bgClass={index % 2 === 0 ? 'bg-[var(--bg-alt)]' : ''}
          />
        ))}
        {features2.map((feature, index) => (
          <MobileFeatureSection
            key={`f2-${index}`}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            bgClass={index % 2 === 0 ? 'bg-[var(--bg-alt)]' : ''}
          />
        ))}
        <MobileDownloadSection />
        <MobileFooterSection />
      </ScrollContainer>
    );
  }

  return (
    <ScrollContainer>
      <HeroSection />
      <StatsSection />
      <FeaturesSection1 />
      <FeaturesSection2 />
      <FooterSection />
    </ScrollContainer>
  );
};

export default Home;
