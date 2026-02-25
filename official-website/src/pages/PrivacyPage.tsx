import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { marked } from 'marked';
import { Shield, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const privacyContentZh = `# 隐私政策
... (omitted for brevity, assume full zh content) ...`;

const privacyContentEn = `# Privacy Policy
... (omitted for brevity, assume full en content) ...`;

const PrivacyPage = () => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const [html, setHtml] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const parse = async () => {
      // Logic to pick content based on i18n.language
      const content = i18n.language.startsWith('zh') ? privacyContentZh : privacyContentEn;
      const parsed = await marked.parse(content);
      setHtml(parsed);
    };
    parse();
  }, [pathname, i18n.language]);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[var(--bg)] transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-[var(--text-2)] hover:text-[var(--brand)] transition-colors mb-8 group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            {t('common.backToHome')}
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center">
              <Shield size={28} />
            </div>
            <h1 className="text-4xl font-bold text-[var(--text-1)]">{t('common.privacyPolicy')}</h1>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-[var(--text-2)]">
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {i18n.language.startsWith('zh') ? '最后更新：2026年2月8日' : 'Last Updated: Feb 8, 2026'}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--divider)]/50" />
            <span>Version 1.2</span>
          </div>
        </div>

        {/* Content */}
        <div className="glass-card p-8 md:p-12">
          <div 
            className="prose-custom max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>

        {/* Quick Contact */}
        <div className="mt-12 p-8 rounded-3xl bg-[var(--bg-alt)] border border-[var(--divider)]/20 text-center">
          <h3 className="text-xl font-bold text-[var(--text-1)] mb-2">{i18n.language.startsWith('zh') ? '对政策有疑问？' : 'Questions about policy?'}</h3>
          <p className="text-[var(--text-2)] mb-6">{i18n.language.startsWith('zh') ? '如果您需要进一步了解我们如何处理您的数据，欢迎通过以下方式联系。' : 'If you need further information about how we handle your data, feel free to contact us.'}</p>
          <div className="flex justify-center gap-4">
            <a href="https://github.com/ZalithLauncher" target="_blank" rel="noreferrer" className="btn-primary px-8 py-2 text-sm">
              GitHub
            </a>
            <a href="https://github.com/ZalithLauncher/ZalithLauncher2/issues" target="_blank" rel="noreferrer" className="px-8 py-2 rounded-full border border-[var(--divider)]/50 text-[var(--text-1)] hover:bg-[var(--bg)] transition-all text-sm">
              {i18n.language.startsWith('zh') ? '提交 Issue' : 'Open Issue'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
