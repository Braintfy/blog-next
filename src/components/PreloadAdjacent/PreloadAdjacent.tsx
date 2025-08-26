'use client';

import { useEffect } from 'react';
import { preloadArticle } from '@/utils/preloader';

interface PreloadAdjacentProps {
  prevSlug?: string;
  nextSlug?: string;
}

export default function PreloadAdjacent({ prevSlug, nextSlug }: PreloadAdjacentProps) {
  useEffect(() => {
    // Предзагружаем соседние статьи с небольшой задержкой
    const timer = setTimeout(() => {
      if (prevSlug) {
        preloadArticle(prevSlug);
      }
      if (nextSlug) {
        setTimeout(() => preloadArticle(nextSlug), 100);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [prevSlug, nextSlug]);

  return null;
}
