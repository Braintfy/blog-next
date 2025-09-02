"use client";
import styles from './Navigation.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { useEffect, useRef, useState } from 'react';
import { preloadArticle } from '@/utils/preloader';
import Loader from '@/components/Loader/Loader';

interface ArticleMeta { id: string; title: string; }

interface NavigationProps {
  onLinkClick?: () => void;
}

export default function Navigation({ onLinkClick }: NavigationProps = {}) {
  const pathname = usePathname();
  const [articles, setArticles] = useState<ArticleMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch('/api/articles')
      .then(r => r.json())
      .then((list) => {
        setArticles(list || []);
        setLoading(false);
      })
      .catch(() => {
        setArticles([]);
        setLoading(false);
      });
  }, []);

  const sorted = [...articles].sort((a, b) => {
    const titleA = a.title.trim();
    const titleB = b.title.trim();
    const startsWithDigit = (t: string) => /^[0-9]/.test(t);
    const startsWithRussian = (t: string) => /^[А-Яа-яЁё]/.test(t);
    const groupOf = (t: string) => {
      if (startsWithDigit(t)) return 2;
      if (startsWithRussian(t)) return 0;
      return 1;
    };
    const gA = groupOf(titleA);
    const gB = groupOf(titleB);
    if (gA !== gB) return gA - gB;
    if (gA === 2) {
      const numA = parseInt(titleA.match(/^\d+/)?.[0] ?? '0', 10);
      const numB = parseInt(titleB.match(/^\d+/)?.[0] ?? '0', 10);
      if (numA !== numB) return numA - numB;
      return titleA.localeCompare(titleB, 'ru', { sensitivity: 'base' });
    }
    return titleA.localeCompare(titleB, 'ru', { sensitivity: 'base' });
  });

  // Получаем только используемые буквы из названий статей
  const usedLetters = new Set<string>();
  articles.forEach(article => {
    const firstChar = article.title.trim().charAt(0).toUpperCase();
    usedLetters.add(firstChar);
  });

  const russianAlphabet = Array.from({ length: 32 }, (_, i) => String.fromCharCode(0x0410 + i));
  const latinAlphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(0x41 + i));
  const numbersAlphabet = Array.from({ length: 10 }, (_, i) => i.toString());

  // Фильтруем алфавиты по используемым буквам
  const usedRussianLetters = russianAlphabet.filter(letter => usedLetters.has(letter));
  const usedLatinLetters = latinAlphabet.filter(letter => usedLetters.has(letter));
  const usedNumbers = numbersAlphabet.filter(number => usedLetters.has(number));

  const scrollToLetter = (letter: string, alphabetSource: string[]) => {
    const scrollViewport = viewportRef.current;
    if (!scrollViewport) return;
    const first = scrollViewport.querySelector(`[data-letter="${letter.toLowerCase()}"]`) as HTMLElement | null;
    if (first) {
      scrollViewport.scrollTo({ top: first.offsetTop, behavior: 'smooth' });
    } else {
      const idx = alphabetSource.indexOf(letter) + 1;
      if (idx < alphabetSource.length) {
        setTimeout(() => scrollToLetter(alphabetSource[idx], alphabetSource), 100);
      } else {
        scrollViewport.scrollTo({ top: scrollViewport.scrollHeight, behavior: 'smooth' });
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.navigation}>
        <Loader size="medium" text="Загрузка статей..." />
      </div>
    );
  }

  return (
    <div className={styles.navigation}>
      <div className={styles.alphabetColumn}>
        {usedRussianLetters.length > 0 && (
          <div className={styles.alphabetBlock}>
            {usedRussianLetters.map((letter) => (
              <button key={letter} className={styles.alphabetButton} onClick={() => scrollToLetter(letter, russianAlphabet)}>{letter}</button>
            ))}
          </div>
        )}
        {usedLatinLetters.length > 0 && (
          <div className={styles.alphabetBlock}>
            {usedLatinLetters.map((letter) => (
              <button key={letter} className={styles.alphabetButton} onClick={() => scrollToLetter(letter, latinAlphabet)}>{letter}</button>
            ))}
          </div>
        )}
        {usedNumbers.length > 0 && (
          <div className={styles.alphabetBlock}>
            {usedNumbers.map((letter) => (
              <button key={letter} className={styles.alphabetButton} data-type="digit" onClick={() => scrollToLetter(letter, numbersAlphabet)}>{letter}</button>
            ))}
          </div>
        )}
      </div>
      <ScrollArea.Root className={styles.scrollRoot}>
        <ScrollArea.Viewport ref={viewportRef} className={styles.scrollViewport}>
          <ul className={styles.navigationList}>
            {sorted.map((article) => {
              const firstLetter = article.title.charAt(0).toUpperCase();
              const active = pathname === `/guide/${article.id}`;
              return (
                <li key={article.id} className={styles.navigationItem} data-letter={firstLetter.toLowerCase()}>
                  <Link 
                    href={`/guide/${article.id}`} 
                    className={`${styles.navLink} ${active ? styles.activeLink : ''}`}
                    onClick={onLinkClick}
                    onMouseEnter={() => preloadArticle(article.id)}
                  >
                    {article.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar className={styles.scrollbar} orientation="vertical">
          <ScrollArea.Thumb className={styles.scrollThumb} />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  );
}


