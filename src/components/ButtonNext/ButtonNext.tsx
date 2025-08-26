"use client";
import Link from 'next/link';
import styles from './ButtonNext.module.css';

interface ButtonNextProps {
  nextSlug: string | null;
}

export default function ButtonNext({ nextSlug }: ButtonNextProps) {
  if (!nextSlug) return null;

  const handleClick = () => {
    const mainSection = document.querySelector('[class*=\"mainSection\"]') as HTMLElement | null;
    if (mainSection) mainSection.scrollTop = 0;
  };

  return (
    <Link href={`/guide/${nextSlug}`} className={styles.buttonNext} onClick={handleClick as any} prefetch={false}>
      <span className={styles.buttonText}>Следующая статья</span>
      <span className={styles.buttonIcon}>→</span>
    </Link>
  );
}
