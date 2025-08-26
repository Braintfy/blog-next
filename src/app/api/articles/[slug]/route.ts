import { NextResponse } from 'next/server';
import { getArticleBySlug } from '@/lib/articles';

export const revalidate = 300;

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);
    if (!article) return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    return NextResponse.json(article);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load article' }, { status: 500 });
  }
}


