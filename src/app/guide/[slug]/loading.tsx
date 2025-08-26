import ArticleContentStyles from '@/components/ArticleContent/ArticleContent.module.css';
import Loader from '@/components/Loader/Loader';

export default function LoadingArticle() {
  return (
    <div className={`${ArticleContentStyles.articleContent} articleContent`}>
      <div className={ArticleContentStyles.content}>
        <Loader size="large" text="Загружаем статью..." />
      </div>
    </div>
  );
}


