'use client';

import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import styles from './ArticleContent.module.css';
import { remarkAutoLinkTerms } from '@/utils/remarkAutoLinkTerms';
import ButtonNext from '@/components/ButtonNext/ButtonNext';
import ButtonPrev from '@/components/ButtonPrev/ButtonPrev';
import CustomBar from '@/components/CustomBar/CustomBar';
import Loader from '@/components/Loader/Loader';

interface Article {
  content: string;
  frontmatter?: any;
}

interface ArticleContentProps {
  article: Article | null;
  loading?: boolean;
  error?: string;
  prevSlug?: string;
  nextSlug?: string;
  currentSlug?: string;
  allArticles?: Array<{ id: string; title: string; aliases?: string[] }>;
}

const ArticleContent = ({ 
  article, 
  loading, 
  error, 
  prevSlug, 
  nextSlug, 
  currentSlug,
  allArticles = []
}: ArticleContentProps) => {
  
  // Уведомляем TableOfContents об изменении контента
  useEffect(() => {
    if (article) {
      // Множественные уведомления для надежности
      const timers = [
        setTimeout(() => {
          const event = new CustomEvent('articleContentUpdated');
          document.dispatchEvent(event);
        }, 100),
        setTimeout(() => {
          const event = new CustomEvent('articleContentUpdated');
          document.dispatchEvent(event);
        }, 300),
        setTimeout(() => {
          const event = new CustomEvent('articleContentUpdated');
          document.dispatchEvent(event);
        }, 600)
      ];
      
      return () => timers.forEach(timer => clearTimeout(timer));
    }
  }, [article, currentSlug]);

  if (loading) {
    return (
      <div className={`${styles.articleContent} articleContent`}>
        <CustomBar />
        <Loader size="large" text="Загрузка статьи..." />
      </div>
    );
  }

  if (error || !article) {
    return <div className={styles.error}>{error || 'Статья не найдена'}</div>;
  }

  // Подготавливаем термины для авто-линковки
  const autoLinkTerms = allArticles.flatMap((a) => {
    const labels = [a.title, ...(Array.isArray(a.aliases) ? a.aliases : [])]
      .filter(Boolean);
    return labels.map((label: string) => ({ label, slug: a.id }));
  });

  return (
    <div className={`${styles.articleContent} articleContent`}>
      <CustomBar />
      <div className={styles.content}>
        <ReactMarkdown
          remarkPlugins={[
            remarkFrontmatter, 
            remarkGfm,
            remarkAutoLinkTerms(autoLinkTerms, { perTermLimit: 2, currentSlug })
          ]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            a: ({ children, href = '', ...props }) => {
              const isExternal = /^https?:/i.test(href) || /^mailto:/i.test(href);
              return (
                <a
                  href={href}
                  {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  {...props}
                >
                  {children}
                </a>
              );
            },
            h2: ({ children, ...props }) => {
              const text = Array.isArray(children) ? children.join('') : String(children);
              const id = `heading-${text.toLowerCase().replace(/[^a-zа-я0-9]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`;
              return <h2 id={id} {...props}>{children}</h2>;
            },
            h3: ({ children, ...props }) => {
              const text = Array.isArray(children) ? children.join('') : String(children);
              const id = `heading-${text.toLowerCase().replace(/[^a-zа-я0-9]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`;
              return <h3 id={id} {...props}>{children}</h3>;
            },
          }}
        >
          {article.content}
        </ReactMarkdown>
        <nav className={styles.navigation}>
          <div className={styles.prevButton}>
            <ButtonPrev prevSlug={prevSlug} />
          </div>
          <div className={styles.nextButton}>
            <ButtonNext nextSlug={nextSlug} />
          </div>
        </nav>
        <div className={styles.bottomSpacing}></div>
      </div>
    </div>
  );
};

export default ArticleContent;
