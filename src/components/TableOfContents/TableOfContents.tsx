"use client";
import styles from './TableOfContents.module.css';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

interface TocItem { id: string; text: string; }

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const headingObserverRef = useRef<IntersectionObserver | null>(null);
  const pathname = usePathname();

  const getHeadings = () => {
    const articleContent = document.querySelector('.articleContent');
    if (!articleContent) return [] as TocItem[];
    const els = articleContent.querySelectorAll('h2');
    const items: TocItem[] = [];
    els.forEach((h, index) => {
      if (!h.id) h.id = `heading-${index}`;
      const text = h.textContent?.trim();
      if (text) items.push({ id: h.id, text });
    });
    return items;
  };

  useEffect(() => {
    // Добавляем задержку и повторные попытки для подтягивания заголовков
    const tryGetHeadings = (attempt = 0) => {
      const items = getHeadings();
      if (items.length > 0) {
        setHeadings(items);
        setActiveId(items[0]?.id || '');
      } else if (attempt < 10) {
        // Повторяем попытку через 100мс, максимум 10 раз
        setTimeout(() => tryGetHeadings(attempt + 1), 1000);
      }
    };
    
    tryGetHeadings();
  }, [pathname]);

  useEffect(() => {
    if (!headings.length) return;
    if (headingObserverRef.current) headingObserverRef.current.disconnect();
    const observer = new IntersectionObserver((entries) => {
      const firstVisible = entries.filter(e => e.isIntersecting).map(e => e.target.id)[0];
      if (firstVisible) setActiveId(firstVisible);
    }, { rootMargin: '-80px 0px -80% 0px', threshold: 0.1 });
    headings.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    headingObserverRef.current = observer;
    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    const container = document.querySelector('[class*="mainSection"]');
    if (container) {
      const offset = 60;
      const elementPosition = element.getBoundingClientRect().top;
      const containerPosition = (container as HTMLElement).getBoundingClientRect().top;
      const relativePosition = elementPosition - containerPosition;
      (container as HTMLElement).scrollBy({ top: relativePosition - offset, behavior: 'smooth' });
      setActiveId(id);
    } else {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  };

  return (
    <div className={styles.tableOfContents}>
      <div className={styles.onThisPage}>На этой странице</div>
      <ul className={styles.tocList}>
        {headings.map(h => (
          <li key={h.id} className={styles.tocItem}>
            <a href={`#${h.id}`} className={`${styles.tocLink} ${activeId === h.id ? styles.activeLink : ''}`} onClick={(e) => { e.preventDefault(); scrollToHeading(h.id); }}>{h.text}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}


