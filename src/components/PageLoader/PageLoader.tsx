'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './PageLoader.module.css';

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
    };

    const handleComplete = () => {
      setIsLoading(false);
    };

    // Показываем лоадер при смене маршрута
    handleStart();
    
    // Скрываем лоадер через задержку для плавности (минимум 300мс, максимум 800мс)
    const minDelay = 300;
    const maxDelay = 800;
    
    const timer = setTimeout(handleComplete, minDelay);
    const maxTimer = setTimeout(handleComplete, maxDelay);

    return () => {
      clearTimeout(timer);
      clearTimeout(maxTimer);
      handleComplete();
    };
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className={styles.pageLoader}>
      <div className={styles.loaderContainer}>
        <div className={styles.spinner}>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerRing}></div>
        </div>
        <div className={styles.loaderText}>Загрузка...</div>
      </div>
    </div>
  );
}
