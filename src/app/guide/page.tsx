export const metadata = {
  title: 'Гайды — Braint',
};

import styles from './guide.module.css';
import Navigation from '@/components/Navigation/Navigation';
import TableOfContents from '@/components/TableOfContents/TableOfContents';
import CustomBar from '@/components/CustomBar/CustomBar';
import { getArticlesList } from '@/lib/articles';
import { redirect } from 'next/navigation';

export default async function GuideIndexPage() {
  const list = await getArticlesList();
  if (list.length > 0) {
    redirect(`/guide/${list[0].id}`);
  }
  return (
    <div className={styles.guidePage}>
      <div className={styles.nav}><Navigation /></div>
      <div className={styles.mainSection}>
        <CustomBar />
        <div style={{padding: 20}}>
          <h1>Гайды</h1>
          <p>Статьи временно отключены в рамках миграции.</p>
        </div>
      </div>
      <div className={styles.table}><TableOfContents /></div>
      <div></div>
    </div>
  );
}


