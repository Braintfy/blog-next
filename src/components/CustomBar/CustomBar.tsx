"use client";
import { useState, useEffect } from 'react';
import styles from './CustomBar.module.css';

export default function CustomBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const parentElement = document.querySelector('[class*="mainSection"]');
    
    if (!parentElement) {
      return;
    }
    
    const handleScroll = () => {
      const scrollPosition = (parentElement as HTMLElement).scrollTop;
      const scrollHeight = (parentElement as HTMLElement).scrollHeight - (parentElement as HTMLElement).clientHeight;
      const scrollPercentage = (scrollPosition / scrollHeight) * 100;
      
      setScrollProgress(Math.min(100, Math.max(0, scrollPercentage)));
    };
    
    parentElement.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => {
      parentElement.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressBar} style={{ width: `${scrollProgress}%` }} />
    </div>
  );
}


