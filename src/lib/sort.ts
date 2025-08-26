import type { ArticleMeta } from './articles';

export function sortArticlesByAlphabet<T extends { title: string }>(articles: T[]): T[] {
  return [...articles].sort((a, b) => {
    const titleA = a.title.trim();
    const titleB = b.title.trim();
    const startsWithDigit = (t: string) => /^[0-9]/.test(t);
    const startsWithRussian = (t: string) => /^[А-Яа-яЁё]/.test(t);
    const groupOf = (t: string) => {
      if (startsWithDigit(t)) return 2; // цифры в конец
      if (startsWithRussian(t)) return 0; // русские сначала
      return 1; // латиница/прочее
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
}


