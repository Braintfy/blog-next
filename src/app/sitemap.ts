import { MetadataRoute } from 'next';
import { getArticlesList } from '@/lib/articles';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticlesList();
  
  const articleUrls = articles.map((article) => ({
    url: `https://braint.ru/guide/${article.id}`,
    lastModified: article.lastModified ? new Date(article.lastModified) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: 'https://braint.ru',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://braint.ru/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://braint.ru/guide',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...articleUrls,
  ];
}
