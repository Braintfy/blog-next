// Updated SearchBar.tsx
"use client";
import { useEffect, useState, useRef } from 'react';
import { CiSearch } from 'react-icons/ci';
import styles from './SearchBar.module.css';
import Link from 'next/link';

interface Article { id: string; title: string; }

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    const q = searchQuery.trim();
    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}&limit=10`, { signal: controller.signal })
        .then(r => r.json())
        .then((data) => setResults(Array.isArray(data) ? data : []))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 300);
    return () => { controller.abort(); clearTimeout(t); };
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.searchContainer} ref={searchRef}>
      <CiSearch className={styles.searchIcon} />
      <input
        type="text"
        placeholder="Искать статью..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {loading ? (
        <div className={styles.searchResults}>
          <div className={styles.searchResultItem}>Загрузка...</div>
        </div>
      ) : results.length > 0 ? (
        <div className={styles.searchResults}>
          {results.map((a) => (
            <Link key={a.id} href={`/guide/${a.id}`} className={styles.searchResultItem} onClick={() => setSearchQuery('')}>
              <div className={styles.resultTitle}>{a.title}</div>
            </Link>
          ))}
        </div>
      ) : (
        searchQuery && (
          <div className={styles.searchResults}>
            <div className={styles.searchResultItem}>Нет результатов</div>
          </div>
        )
      )}
    </div>
  );
}