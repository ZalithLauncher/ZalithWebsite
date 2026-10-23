import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { BlogIndex } from '../src/types/blog';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://zalithlauncher.cn';

interface SitemapEntry {
  loc: string;
  lastmod?: string;
  priority: string;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

const staticRoutes: SitemapEntry[] = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/download', priority: '0.9', changefreq: 'daily' },
  { loc: '/blog', priority: '0.8', changefreq: 'daily' },
  { loc: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { loc: '/terms', priority: '0.3', changefreq: 'yearly' },
];

function getBlogEntries(): SitemapEntry[] {
  const indexPath = path.resolve(__dirname, '../src/data/blog-index.json');
  if (!fs.existsSync(indexPath)) {
    console.warn('Warning: blog-index.json not found, sitemap will only include static routes');
    return [];
  }
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8')) as BlogIndex;
  // zh/en 两个语言版本共用同一 slug，按 slug 去重
  const bySlug = new Map<string, string>();
  for (const post of index.posts) {
    if (!bySlug.has(post.slug)) bySlug.set(post.slug, post.date);
  }
  return [...bySlug.entries()].map(([slug, date]) => ({
    loc: `/blog/${slug}`,
    lastmod: date,
    priority: '0.6',
    changefreq: 'monthly',
  }));
}

function main() {
  const entries = [...staticRoutes, ...getBlogEntries()];
  const now = new Date().toISOString().slice(0, 10);

  const urls = entries
    .map((e) => {
      const lastmod = e.lastmod ?? now;
      return [
        '  <url>',
        `    <loc>${SITE_URL}${e.loc}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${e.changefreq}</changefreq>`,
        `    <priority>${e.priority}</priority>`,
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, xml);
  console.log(`Sitemap generated: ${outputPath} (${entries.length} URLs)`);
}

main();
