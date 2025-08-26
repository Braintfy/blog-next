'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './NotFound.module.css';

interface Article {
  id: string;
  title: string;
  lastModified?: string;
}

export default function NotFound() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetch('/api/articles')
      .then(r => r.json())
      .then((list: Article[]) => setArticles(list || []))
      .catch(() => setArticles([]));
  }, []);

  const latest = [...articles]
    .sort((a, b) => {
      const aTime = a.lastModified ? new Date(a.lastModified).getTime() : 0;
      const bTime = b.lastModified ? new Date(b.lastModified).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 3);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Страница не найдена</h1>
      <p className={styles.subtitle}>Возможно, страница была перемещена или удалена.</p>
      <p className={styles.subtitle}>Попробуйте найти то, что вы ищете, в разделах ниже</p>
      <div className={styles.buttons}>
        {latest.map(article => (
          <Link 
            href={`/guide/${article.id}`}
            key={article.id}
            className={styles.button}
          >
            {article.title}
          </Link>
        ))}
      </div>
      <div className={styles.homeLinkWrap}>
        <Link href="/" className={styles.homeLink}>На главную</Link>
      </div>
    </div>
  );
}
