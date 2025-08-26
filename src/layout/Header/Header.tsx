// Updated Header.tsx
"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';
import SearchBar from '@/layout/SearchBar/SearchBar';
import ThemeToggle from '@/layout/ThemePopUp/ThemePopUp';
import BurgerMenu from '@/layout/BurgerMenu/BurgerMenu'; // Assuming the path to BurgerMenu; adjust if needed

export default function Header() {
  const [currentTheme, setCurrentTheme] = useState<string>('light');
  const [burgerOpen, setBurgerOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setCurrentTheme(savedTheme);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const bodyClass = document.body.className;
          setCurrentTheme(bodyClass);
        }
      });
    });

    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const isActive = (href: string) => pathname === href;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <BurgerMenu 
            isOpen={burgerOpen} 
            onToggle={() => setBurgerOpen(!burgerOpen)} 
          />
          <Link href="/">
            <div className={styles.logo}>
              <img
                src={currentTheme === 'dark' ? '/braint-w.svg' : '/braint-b.svg'}
                alt="Логотип"
              />
            </div>
          </Link>
          <Link
            href="/guide"
            className={isActive('/guide') ? `${styles.link} ${styles.activeLink}` : styles.link}
            prefetch={true}
          >
            <div className={styles.links}>Гайды</div>
          </Link>
          <Link
            href="/about"
            className={isActive('/about') ? `${styles.link} ${styles.activeLink}` : styles.link}
            prefetch={true}
          >
            <div className={styles.links}>О нас</div>
          </Link>
        </div>
        <div className={styles.right}>
          <SearchBar />
          <div className={styles.themeButtonContainer}>
            <ThemeToggle />
          </div>
        </div>
      </div>
      
    </header>
  );
}