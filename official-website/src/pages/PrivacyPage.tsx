import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { marked } from 'marked';
import { Shield, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const privacyContent = `# 隐私政策

**最后更新日期：2026-02-08**

Zalith Launcher（以下简称“我们”）深知隐私对您的重要性，并会尽全力保护您的个人信息。本隐私政策阐述了我们在您访问本网站及使用相关服务时如何处理您的数据。

## 1. 我们收集的信息

### 1.1 静态部署与数据收集
本网站是一个静态网站，主要部署在边缘计算节点上（除阿里云节点外）。
- **无数据收集行为**：我们不会主动收集、存储或处理您的任何个人数据。
- **不拉黑用户**：我们致力于提供开放且公平的访问体验，不会因任何原因对用户进行访问限制或拉黑处理。

### 1.2 IP 地址的使用
当您访问本网站时，我们会通过您的 IP 地址来识别您所在的地区。这一行为仅用于：
- 确定重定向弹窗（Domain Warning Popup）的显示语言：非中国大陆 IP 将默认显示英文提示，以确保全球用户都能理解节点跳转建议。
- 提升您的整体浏览体验。
我们不会记录或持久化存储您的完整 IP 地址，也不会将其与您的身份信息进行关联。

### 1.3 本地存储（LocalStorage）的使用
我们使用浏览器的本地存储（LocalStorage）而非传统的 Cookie 来提升您的浏览体验。这包括：
- **语言偏好**：记录您选择的界面语言。
- **访问优化**：缓存您的 IP 归属地检测结果（有效期 24 小时），用于决定是否显示重定向建议。
这些数据仅存储在您的设备本地，不会上传到我们的服务器。您可以随时通过浏览器设置清除这些数据。

## 2. 信息的使用

我们收集的信息主要用于：
- 维持网站的正常运行和安全性
- 分析网站访问量以优化用户体验
- 响应您的支持请求或反馈

## 3. 信息的共享与披露

我们不会向任何第三方出售或出租您的个人信息。除非：
- 获得您的明确同意
- 法律法规的要求
- 保护我们的合法权利或财产

## 4. 数据安全

我们采取合理的安全措施来保护您的信息免受未经授权的访问、更改或泄露。但请注意，互联网上的数据传输无法保证百分之百的安全。

## 5. 政策变更

我们可能会不时更新本隐私政策。任何变更都会在页面上发布，并更新“最后更新日期”。

## 6. 联系我们

如果您对本隐私政策有任何疑问，请通过 GitHub 提交 Issue 或联系我们的社区频道。`;

const PrivacyPage = () => {
  const { pathname } = useLocation();
  const [html, setHtml] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const parse = async () => {
      const content = await marked.parse(privacyContent);
      setHtml(content);
    };
    parse();
  }, [pathname]);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[var(--bg)] transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-[var(--text-2)] hover:text-[var(--brand)] transition-colors mb-8 group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            返回首页
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center">
              <Shield size={28} />
            </div>
            <h1 className="text-4xl font-bold text-[var(--text-1)]">隐私政策</h1>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-[var(--text-2)]">
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              最后更新：2026年2月8日
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--divider)]/50" />
            <span>版本 1.2</span>
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
          <h3 className="text-xl font-bold text-[var(--text-1)] mb-2">对政策有疑问？</h3>
          <p className="text-[var(--text-2)] mb-6">如果您需要进一步了解我们如何处理您的数据，欢迎通过以下方式联系。</p>
          <div className="flex justify-center gap-4">
            <a href="https://github.com/ZalithLauncher" target="_blank" rel="noreferrer" className="btn-primary px-8 py-2 text-sm">
              GitHub 组织
            </a>
            <a href="https://github.com/ZalithLauncher/ZalithLauncher2/issues" target="_blank" rel="noreferrer" className="px-8 py-2 rounded-full border border-[var(--divider)]/50 text-[var(--text-1)] hover:bg-[var(--bg)] transition-all text-sm">
              提交 Issue
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
