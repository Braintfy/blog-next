import styles from './guide.module.css';
import Navigation from '@/components/Navigation/Navigation';
import TableOfContents from '@/components/TableOfContents/TableOfContents';
import CustomBar from '@/components/CustomBar/CustomBar';

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.guidePage}>
      <div className={styles.nav}><Navigation /></div>
      <div className={styles.mainSection}>
        <CustomBar />
        {children}
      </div>
      <div className={styles.table}><TableOfContents /></div>
      <div></div>
    </div>
  );
}


