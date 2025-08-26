import { getArticlesList, getArticleBySlug, getAdjacentSlugs } from '@/lib/articles';
import ArticleContentStyles from '@/components/ArticleContent/ArticleContent.module.css';
import ButtonPrev from '@/components/ButtonPrev/ButtonPrev';
import ButtonNext from '@/components/ButtonNext/ButtonNext';
import ScrollToTop from '@/components/ScrollToTop/ScrollToTop';
import PreloadAdjacent from '@/components/PreloadAdjacent/PreloadAdjacent';
import ReactMarkdown from 'react-markdown';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { remarkAutoLinkTerms } from '@/utils/remarkAutoLinkTerms';
import 'highlight.js/styles/github.css';

export const revalidate = 300;

export async function generateStaticParams() {
  const list = await getArticlesList();
  return list.map(a => ({ slug: a.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  
  if (!article) {
    return {
      title: 'Статья не найдена — Braint',
      description: 'Запрашиваемая статья не найдена.',
    };
  }

  const title = article.frontMatter?.title || article.frontMatter?.name || slug;
  const description = article.frontMatter?.description || `Статья о ${title} — энциклопедия биохакинга Braint`;
  const fullTitle = `${title} — Braint`;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      type: 'article',
      url: `https://braint.ru/guide/${slug}`,
      siteName: 'Braint',
    },
    twitter: {
      card: 'summary',
      title: fullTitle,
      description,
    },
  };
}

export default async function GuideArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  const { prevSlug, nextSlug } = await getAdjacentSlugs(slug);
  const allArticles = await getArticlesList();
  
  // Подготавливаем термины для авто-линковки
  const autoLinkTerms = allArticles.map(a => ({ label: a.title, slug: a.id }));
  
  return (
    <>
      <ScrollToTop containerSelector=".mainSection" />
      <PreloadAdjacent prevSlug={prevSlug || undefined} nextSlug={nextSlug || undefined} />
      <div className={`${ArticleContentStyles.articleContent} articleContent`}>
        <div className={ArticleContentStyles.content}>
          {article ? (
            <>
              <ReactMarkdown
                remarkPlugins={[
                  remarkFrontmatter, 
                  remarkGfm,
                  remarkAutoLinkTerms(autoLinkTerms, { perTermLimit: 2, currentSlug: slug })
                ]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  a: ({ children, href = '', ...props }) => {
                    const isExternal = /^https?:/i.test(href) || /^mailto:/i.test(href);
                    return (
                      <a
                        href={href}
                        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        {...props}
                      >
                        {children}
                      </a>
                    );
                  },
                  h2: ({ children, ...props }) => {
                    const text = Array.isArray(children) ? children.join('') as string : String(children);
                    const id = `heading-${text.toLowerCase().replace(/[^a-zа-я0-9]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`;
                    return <h2 id={id} {...props}>{children}</h2>;
                  },
                  h3: ({ children, ...props }) => {
                    const text = Array.isArray(children) ? children.join('') as string : String(children);
                    const id = `heading-${text.toLowerCase().replace(/[^a-zа-я0-9]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`;
                    return <h3 id={id} {...props}>{children}</h3>;
                  },
                }}
              >
                {article.content}
              </ReactMarkdown>
              <div className={ArticleContentStyles.navigation}>
                <div className={ArticleContentStyles.prevButton}>
                  <ButtonPrev prevSlug={prevSlug} />
                </div>
                <div className={ArticleContentStyles.nextButton}>
                  <ButtonNext nextSlug={nextSlug} />
                </div>
              </div>
            </>
          ) : (
            <p>Статья не найдена</p>
          )}
        </div>
      </div>
    </>
  );
}


