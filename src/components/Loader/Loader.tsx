import styles from './Loader.module.css';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  showText?: boolean;
}

export default function Loader({ 
  size = 'medium', 
  text = 'Загрузка...', 
  showText = true 
}: LoaderProps) {
  return (
    <div className={styles.loaderContainer}>
      <div className={`${styles.spinner} ${styles[size]}`}>
        <div className={styles.spinnerRing}></div>
        <div className={styles.spinnerRing}></div>
        <div className={styles.spinnerRing}></div>
      </div>
      {showText && (
        <div className={styles.loaderText}>{text}</div>
      )}
    </div>
  );
}


