'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface ScrollToTopProps {
  containerSelector?: string;
}

export default function ScrollToTop({ containerSelector = '.mainSection' }: ScrollToTopProps) {
  const pathname = usePathname();

  useEffect(() => {
    const mainSection = document.querySelector('[class*="mainSection"]') as HTMLElement;
    if (mainSection) {
      setTimeout(() => {
        mainSection.scrollTop = 0;
      }, 0);
    }
  }, [pathname]);

  return null;
}
