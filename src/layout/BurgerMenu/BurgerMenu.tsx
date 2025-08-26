'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './BurgerMenu.module.css';
import Navigation from '@/components/Navigation/Navigation';

interface BurgerMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  width?: string;
}

export default function BurgerMenu({ isOpen, onToggle, width = '300px' }: BurgerMenuProps) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [theme, setTheme] = useState<string>('light');

  useEffect(() => {
    // Получаем текущую тему
    const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
    setTheme(currentTheme);

    // Слушаем изменения темы
    const observer = new MutationObserver(() => {
      const newTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
      setTheme(newTheme);
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  // Функция для закрытия меню при клике на ссылку
  const handleLinkClick = () => {
    onToggle();
  };

  return (
    <>
      <button
        className={styles.burgerButton}
        onClick={onToggle}
        aria-label="Toggle menu"
      >
        ☰
      </button>
    
      <div className={`${styles.burgerMenu} ${isOpen ? styles.burgerMenuOpen : ''}`} style={{ width }}>
        <div className={styles.headerSection}>
          <Link 
            href="/" 
            onClick={handleLinkClick}
            className={pathname === '/' ? styles.activeLink : ''}
          >
            <div className={styles.logo}>
              <img
                src={theme === 'dark' ? '/braint-w.svg' : '/braint-b.svg'}
                alt="Логотип"
              />
            </div>
          </Link>
          <button
            className={styles.closeButton}
            onClick={onToggle}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <div className={styles.contentSection}>
          <div className={styles.quickLinksRow}>
            <Link 
              href="/guide" 
              className={`${styles.guideLink} ${pathname.startsWith('/guide') ? styles.activeLink : ''}`} 
              onClick={handleLinkClick}
            >
              <div className={styles.linkWrapper}>
                Гайды
              </div>
            </Link>
            <Link 
              href="/about" 
              className={`${styles.guideLink} ${pathname === '/about' ? styles.activeLink : ''}`} 
              onClick={handleLinkClick}
            >
              <div className={styles.linkWrapper}>
                О нас
              </div>
            </Link>
          </div>
          {!isHome && <Navigation onLinkClick={handleLinkClick} />}
        </div>
        
      </div>
    
      {isOpen && <div className={styles.overlay} onClick={onToggle}></div>}
    </>
  );
}
