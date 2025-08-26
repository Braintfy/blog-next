"use client";
import Link from 'next/link';
import styles from './ButtonPrev.module.css';

interface ButtonPrevProps {
  prevSlug: string | null;
}

export default function ButtonPrev({ prevSlug }: ButtonPrevProps) {
  if (!prevSlug) return null;

  const handleClick = () => {
    const mainSection = document.querySelector('[class*="mainSection"]') as HTMLElement | null;
    if (mainSection) mainSection.scrollTop = 0;
  };

  return (
    <Link href={`/guide/${prevSlug}`} className={styles.buttonPrev} onClick={handleClick as any} prefetch={false}>
      <span className={styles.buttonIcon}>←</span>
      <span className={styles.buttonText}>Предыдущая статья</span>
    </Link>
  );
}
