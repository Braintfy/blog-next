'use client';

const preloadingArticles = new Set<string>();
const preloadedArticles = new Set<string>();

export async function preloadArticle(slug: string): Promise<void> {
  if (preloadedArticles.has(slug) || preloadingArticles.has(slug)) {
    return;
  }

  preloadingArticles.add(slug);

  try {
    // Предзагружаем контент статьи
    await fetch(`/api/articles/${slug}`, {
      method: 'GET',
      headers: { 'Cache-Control': 'max-age=300' }
    });
    
    preloadedArticles.add(slug);
  } catch (error) {
    console.warn('Failed to preload article:', slug, error);
  } finally {
    preloadingArticles.delete(slug);
  }
}

// Предзагрузка соседних статей
export function preloadAdjacentArticles(currentSlug: string, allArticles: Array<{ id: string }>): void {
  const currentIndex = allArticles.findIndex(a => a.id === currentSlug);
  if (currentIndex === -1) return;

  // Предзагружаем предыдущую и следующую статьи
  const prevSlug = currentIndex > 0 ? allArticles[currentIndex - 1].id : null;
  const nextSlug = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1].id : null;

  if (prevSlug) {
    setTimeout(() => preloadArticle(prevSlug), 100);
  }
  if (nextSlug) {
    setTimeout(() => preloadArticle(nextSlug), 200);
  }
}

// Предзагрузка популярных статей с задержкой
export function preloadPopularArticles(articles: Array<{ id: string }>, delay = 1000): void {
  setTimeout(() => {
    // Предзагружаем первые 5 статей с интервалом
    articles.slice(0, 5).forEach((article, index) => {
      setTimeout(() => preloadArticle(article.id), index * 200);
    });
  }, delay);
}
