import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { sortArticlesByAlphabet } from './sort';

export interface ArticleMeta {
  id: string;
  title: string;
  category: string;
  tags: string[];
  path: string;
  lastModified?: string | null;
  aliases?: string[];
}

export interface ArticleContent {
  slug: string;
  content: string;
  frontMatter: Record<string, any>;
  title: string;
  category: string;
}

const articlesDir = path.join(process.cwd(), 'public', 'articles');

export async function listArticleFiles(): Promise<string[]> {
  const files = await fs.readdir(articlesDir);
  return files.filter(f => f.endsWith('.mdx'));
}

export async function getArticlesList(): Promise<ArticleMeta[]> {
  const files = await listArticleFiles();
  const articles: ArticleMeta[] = [];

  for (const file of files) {
    const filePath = path.join(articlesDir, file);
    const content = await fs.readFile(filePath, 'utf-8');
    const stat = await fs.stat(filePath).catch(() => null);
    const lastModifiedIso = stat ? new Date(stat.mtime).toISOString() : null;
    const { data } = matter(content);
    articles.push({
      id: file.replace('.mdx', ''),
      title: (data as any).title || file.replace('.mdx', ''),
      category: (data as any).category || 'Без категории',
      tags: Array.isArray((data as any).tags) ? (data as any).tags : [],
      path: `/articles/${file.replace('.mdx', '')}`,
      lastModified: lastModifiedIso,
      aliases: Array.isArray((data as any).aliases)
        ? (data as any).aliases
        : ((data as any).aliases ? [(data as any).aliases] : []),
    });
  }
  return sortArticlesByAlphabet(articles);
}

export async function getArticleBySlug(slug: string): Promise<ArticleContent | null> {
  const filePath = path.join(articlesDir, `${slug}.mdx`);
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const { data, content: body } = matter(content);
    return {
      slug,
      content: body,
      frontMatter: data,
      title: (data as any).title || slug,
      category: (data as any).category || 'Без категории',
    };
  } catch {
    return null;
  }
}

export async function getAdjacentSlugs(slug: string): Promise<{ prevSlug: string | null; nextSlug: string | null }>{
  const list = await getArticlesList();
  const sorted = list; // уже отсортировано
  const idx = sorted.findIndex(a => a.id === slug);
  if (idx === -1) return { prevSlug: null, nextSlug: null };
  return {
    prevSlug: idx > 0 ? sorted[idx - 1].id : null,
    nextSlug: idx < sorted.length - 1 ? sorted[idx + 1].id : null,
  };
}


