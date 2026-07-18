import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import matter from 'gray-matter';
import yaml from 'yaml';
import { marked } from 'marked';
import type { BlogPost, BlogIndex, Author, BlogPostFrontmatter } from '../src/types/blog';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.resolve(__dirname, '../content/blog');
const OUTPUT_DIR = path.resolve(__dirname, '../src/data');

marked.setOptions({
  gfm: true,
  breaks: false,
});

const renderer = new marked.Renderer();
renderer.heading = ({ depth, text }) => {
  const id = text
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-|-$/g, '');
  return `<h${depth} id="${id}">${text}</h${depth}>\n`;
};
marked.use({ renderer });

function loadAuthors(): Record<string, Author> {
  const authorsPath = path.join(CONTENT_DIR, 'authors.yml');
  if (!fs.existsSync(authorsPath)) {
    console.warn('Warning: authors.yml not found');
    return {};
  }
  
  const content = fs.readFileSync(authorsPath, 'utf-8');
  return yaml.parse(content) || {};
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const chineseCharsPerMinute = 300;
  
  const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (content.match(/[a-zA-Z]+/g) || []).length;
  
  const readingTime = Math.ceil(
    (chineseChars / chineseCharsPerMinute) + (englishWords / wordsPerMinute)
  );
  
  return Math.max(1, readingTime);
}

function generateExcerpt(content: string, maxLength: number = 160): string {
  const plainText = content
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*|__|\*|_/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/\n+/g, ' ')
    .trim();
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  return plainText.substring(0, maxLength).trim() + '...';
}

async function processMarkdown(filePath: string, lang: string, authors: Record<string, Author>): Promise<BlogPost | null> {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data, content: markdownContent } = matter(content);
    
    const frontmatter = data as BlogPostFrontmatter;
    
    if (!frontmatter.title || !frontmatter.slug || !frontmatter.date) {
      console.warn(`Warning: Missing required frontmatter in ${filePath}`);
      return null;
    }
    
    const htmlContent = await marked.parse(markdownContent);
    const excerpt = frontmatter.description || generateExcerpt(markdownContent);
    const readingTime = calculateReadingTime(markdownContent);
    
    const postAuthors = (frontmatter.authors || [])
      .map((authorId: string) => {
        const author = authors[authorId];
        if (author) {
          return { ...author, id: authorId };
        }
        console.warn(`Warning: Author "${authorId}" not found in authors.yml`);
        return null;
      })
      .filter((a): a is Author => a !== null);
    
    return {
      slug: frontmatter.slug,
      title: frontmatter.title,
      date: frontmatter.date,
      authors: postAuthors,
      tags: frontmatter.tags || [],
      category: frontmatter.category || 'uncategorized',
      description: excerpt,
      image: frontmatter.image,
      content: htmlContent,
      excerpt,
      readingTime,
      lang,
    };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return null;
  }
}

async function buildBlogIndex(): Promise<BlogIndex> {
  const authors = loadAuthors();
  const posts: BlogPost[] = [];
  const categories = new Set<string>();
  const tags = new Set<string>();
  
  const languages = ['zh', 'en'];
  
  for (const lang of languages) {
    const langDir = path.join(CONTENT_DIR, lang);
    if (!fs.existsSync(langDir)) {
      continue;
    }
    
    const files = await glob('**/index.md', { cwd: langDir });
    
    for (const file of files) {
      const filePath = path.join(langDir, file);
      const post = await processMarkdown(filePath, lang, authors);
      
      if (post) {
        posts.push(post);
        categories.add(post.category);
        post.tags.forEach(tag => tags.add(tag));
      }
    }
  }
  
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return {
    posts,
    authors,
    categories: Array.from(categories),
    tags: Array.from(tags),
  };
}

async function main() {
  console.log('Building blog index...');
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  const blogIndex = await buildBlogIndex();
  
  const outputPath = path.join(OUTPUT_DIR, 'blog-index.json');
  fs.writeFileSync(outputPath, JSON.stringify(blogIndex, null, 2));
  
  console.log(`Blog index generated with ${blogIndex.posts.length} posts`);
  console.log(`Categories: ${blogIndex.categories.join(', ')}`);
  console.log(`Tags: ${blogIndex.tags.join(', ')}`);
}

main().catch(console.error);
