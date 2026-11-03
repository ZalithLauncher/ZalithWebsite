import fs from 'node:fs';
import path from 'node:path';

/**
 * 给每个静态路由生成一份「带正确 meta 的 HTML 外壳」。
 *
 * SPA 的问题：dist/index.html 只有首页那一套 title/description，爬虫和社交
 * 抓取器如果没执行 JS，就会把 /download、/blog 都当成首页。
 *
 * 这里不引入 SSR，也不跑无头浏览器：直接复制 dist/index.html，把 meta 换掉，
 * 写成 dist/<route>/index.html。React 起来之后照常接管，行为不变。
 */

const DIST = path.resolve('dist');
const SITE = 'https://zalithlauncher.cn';
const BRAND = 'Zalith Launcher';

interface RouteMeta {
  title: string;
  description: string;
}

const ROUTES: Record<string, RouteMeta> = {
  '/download': {
    title: '下载中心',
    description: '获取适合您设备的 Zalith Launcher 版本，多源镜像加速下载。',
  },
  '/blog': {
    title: '博客',
    description: '了解 Zalith Launcher 的最新动态、开发日志和教程文章。',
  },
  '/privacy': {
    title: '隐私政策',
    description: '了解 Zalith Launcher 官方网站如何处理您的数据。',
  },
  '/terms': {
    title: '服务条款',
    description: '使用 Zalith Launcher 官方网站的服务条款。',
  },
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

function setMeta(html: string, attr: 'name' | 'property', key: string, value: string): string {
  const tag = `<meta ${attr}="${key}" content="${escapeHtml(value)}" />`;
  const pattern = new RegExp(`<meta\\s+${attr}="${key}"[^>]*>`, 'i');
  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace('</head>', `  ${tag}\n  </head>`);
}

function buildRoute(route: string, meta: RouteMeta): void {
  const source = path.join(DIST, 'index.html');
  if (!fs.existsSync(source)) {
    throw new Error('dist/index.html 不存在，请先运行 vite build');
  }

  const url = `${SITE}${route}`;
  const title = `${meta.title} - ${BRAND}`;

  let html = fs.readFileSync(source, 'utf8');
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = setMeta(html, 'name', 'description', meta.description);
  html = html.replace(/<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${url}" />`);
  html = setMeta(html, 'property', 'og:title', title);
  html = setMeta(html, 'property', 'og:description', meta.description);
  html = setMeta(html, 'property', 'og:url', url);
  html = setMeta(html, 'name', 'twitter:title', title);
  html = setMeta(html, 'name', 'twitter:description', meta.description);

  const dir = path.join(DIST, route.replace(/^\//, ''));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`  route shell  ${route}`);
}

function main(): void {
  console.log('生成路由级 SEO 外壳：');
  for (const [route, meta] of Object.entries(ROUTES)) {
    buildRoute(route, meta);
  }
  console.log(`完成 ${Object.keys(ROUTES).length} 个路由。`);
}

main();
