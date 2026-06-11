import { useEffect, useState } from 'react';
import { MessageSquare, Coffee, Heart, Globe, ShieldCheck, Mail, GitBranch } from 'lucide-react';
import GithubIcon from './icons/GithubIcon';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { BuildInfo } from '../types/blog';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [buildInfo, setBuildInfo] = useState<BuildInfo | null>(null);

  useEffect(() => {
    fetch('/build-info.json')
      .then((res) => res.json())
      .then(setBuildInfo)
      .catch(() => {});
  }, []);

  const footerLinks = [
    {
      title: t('footer.projects'),
      links: [
        { name: t('nav.home'), path: "/" },
        { name: t('common.downloadCenter'), path: "/download" },
        { name: t('nav.blog'), path: "/blog" },
        { name: t('common.docs'), path: "https://www.zalithlauncher.cn/docs/projects/zl2", external: true },
        { name: t('footer.githubOrg'), path: "https://github.com/ZalithLauncher", external: true },
      ]
    },
    {
      title: t('footer.community'),
      links: [
        { name: "Discord", path: "https://discord.gg/e7C4kytRgK", external: true },
        { name: t('footer.qqGroup'), path: "https://afdian.com/a/MovTery", external: true },
        { name: t('footer.weblate'), path: "https://hosted.weblate.org/projects/zalithlauncher2/", external: true },
      ]
    },
    {
      title: t('footer.support'),
      links: [
        { name: t('footer.afdian'), path: "https://afdian.com/a/MovTery", external: true, icon: <Heart size={14} className="text-red-500" /> },
        { name: t('common.contactUs'), path: "https://github.com/ZalithLauncher", external: true },
        { name: t('common.privacyPolicy'), path: "/privacy" },
      ]
    }
  ];

  const formatBuildTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <footer className="pt-20 pb-10 border-t border-[var(--divider)]/20 bg-[var(--bg)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <img src="/zl_icon.webp" alt="Logo" className="w-10 h-10 rounded-xl shadow-lg" />
              <span className="font-bold text-2xl tracking-tight text-[var(--text-1)]">Zalith Launcher</span>
            </div>
            <p className="text-[var(--text-2)] max-w-sm leading-relaxed">
              {t('footer.desc')}
            </p>
            <div className="flex gap-4 pt-2">
              <a href="https://github.com/ZalithLauncher" target="_blank" rel="noreferrer" 
                className="w-10 h-10 rounded-full bg-[var(--bg-alt)] flex items-center justify-center text-[var(--text-2)] hover:text-[var(--brand)] hover:scale-110 transition-all">
                <GithubIcon size={20} />
              </a>
              <a href="https://discord.gg/e7C4kytRgK" target="_blank" rel="noreferrer"
                className="w-10 h-10 rounded-full bg-[var(--bg-alt)] flex items-center justify-center text-[var(--text-2)] hover:text-[var(--brand)] hover:scale-110 transition-all">
                <MessageSquare size={20} />
              </a>
              <a href="https://afdian.com/a/MovTery" target="_blank" rel="noreferrer"
                className="w-10 h-10 rounded-full bg-[var(--bg-alt)] flex items-center justify-center text-[var(--text-2)] hover:text-[var(--brand)] hover:scale-110 transition-all">
                <Coffee size={20} />
              </a>
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title} className="space-y-6">
              <h4 className="font-bold text-[var(--text-1)] uppercase tracking-wider text-sm">{group.title}</h4>
              <ul className="space-y-4">
                {group.links.map((link) => (
                  <li key={link.name}>
                    {link.external ? (
                      <a href={link.path} target="_blank" rel="noreferrer" 
                        className="text-[var(--text-2)] hover:text-[var(--brand)] transition-colors flex items-center gap-2 group">
                        {link.icon}
                        {link.name}
                      </a>
                    ) : (
                      <Link to={link.path} className="text-[var(--text-2)] hover:text-[var(--brand)] transition-colors">
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="pt-10 border-t border-[var(--divider)]/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm text-[var(--text-2)] text-center md:text-left">
              <p>© {currentYear} Zalith Launcher Team. {t('common.allRightsReserved')}</p>
              <div className="mt-1 flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1">
                <p className="opacity-60 text-xs flex items-center gap-1">
                  <ShieldCheck size={12} /> {t('common.notAffiliated')}
                </p>
                <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer" className="text-xs opacity-60 hover:opacity-100 hover:text-[var(--brand)] transition-all">
                  新ICP备2024015133号-4
                </a>
              </div>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-3">
              <div className="flex items-center gap-6 text-xs text-[var(--text-2)]">
                <div className="flex items-center gap-1">
                  <Globe size={14} className="text-[var(--brand)]" />
                  <span>{t('footer.globalNodes')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail size={14} className="text-[var(--brand)]" />
                  <span>{t('footer.poweredBy')}</span>
                </div>
              </div>
              
              {buildInfo && (
                <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-3 gap-y-1 text-xs text-[var(--text-2)] opacity-60">
                  <span className="flex items-center gap-1">
                    {t('footer.builtOn')}: {formatBuildTime(buildInfo.buildTime)}
                  </span>
                  <span className="hidden sm:inline">|</span>
                  <a 
                    href={`${buildInfo.repoUrl}/commit/${buildInfo.commitHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 hover:text-[var(--brand)] hover:opacity-100 transition-all"
                  >
                    {t('footer.commit')}: {buildInfo.commitHash}
                  </a>
                  <span className="hidden sm:inline">|</span>
                  <span className="flex items-center gap-1">
                    <GitBranch size={10} />
                    {buildInfo.branch}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
