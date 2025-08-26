'use client';

import Link from 'next/link';
import styles from './home.module.css';
import { useEffect, useState } from 'react';
import { preloadArticle } from '@/utils/preloader';

interface Article {
  id: string;
  title: string;
  lastModified?: string;
}

export default function Home() {
  const [latest, setLatest] = useState<Article[]>([]);

  useEffect(() => {
    fetch('/api/articles')
      .then(r => r.json())
      .then((list: Article[]) => {
        const sortedByDate = [...list].sort((a, b) => {
          const aTime = a.lastModified ? new Date(a.lastModified).getTime() : 0;
          const bTime = b.lastModified ? new Date(b.lastModified).getTime() : 0;
          return bTime - aTime;
        }).slice(0, 3);
        setLatest(sortedByDate);
        
        // Предзагружаем популярные статьи через 1 секунду
        setTimeout(() => {
          list.slice(0, 5).forEach((article, index) => {
            setTimeout(() => preloadArticle(article.id), index * 200);
          });
        }, 1000);
      })
      .catch(() => setLatest([]));
  }, []);

  return (
    <div className={styles.homeWrap}>
      <div className={styles.content}>
        <div className={styles.homePage}>
          <h1 className={styles.title}>Ваш гид по биохакингу и добавкам</h1>
          <Link href="/guide">
            <button className={styles.button}>Начать</button>
          </Link>
        </div>
        <div className={styles.lastArticles}>
          {latest.length > 0 ? (
            latest.map((a) => (
              <Link 
                href={`/guide/${a.id}`} 
                key={a.id} 
                style={{ textDecoration: 'none', color: 'inherit' }}
                onMouseEnter={() => preloadArticle(a.id)}
                prefetch={false}
              >
                <div className={styles.article}>{a.title}</div>
              </Link>
            ))
          ) : (
            <div className={styles.article}>Загрузка статей...</div>
          )}
        </div>
      </div>
    </div>
  );
}
