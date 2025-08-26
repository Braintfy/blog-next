import { NextResponse } from 'next/server';
import { getArticlesList } from '@/lib/articles';

export const revalidate = 300;

export async function GET() {
  try {
    const articles = await getArticlesList();
    return NextResponse.json(articles);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load articles' }, { status: 500 });
  }
}


