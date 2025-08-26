import { NextResponse } from 'next/server';
import { getArticlesList } from '@/lib/articles';

export const revalidate = 300;

function normalize(s = '') {
  return String(s)
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/ё/g, 'е')
    .replace(/[\-_/.,]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawQuery = String(searchParams.get('q') || '').trim();
  const limit = parseInt(String(searchParams.get('limit') || '5'));

  try {
    const articles = await getArticlesList();
    const q = normalize(rawQuery);
    const tokens = q.length ? q.split(' ') : [];

    const scoreArticle = (a: any) => {
      const title = normalize(a.title);
      const category = normalize(a.category);
      const tags = (a.tags || []).map(normalize).join(' ');
      const aliases = (a.aliases || []).map(normalize).join(' ');
      const id = normalize(a.id);
      const haystackAll = [title, category, tags, aliases, id].join(' ');
      if (!tokens.length) return 0;
      let score = 0;
      for (const t of tokens) {
        const inTitle = title.includes(t);
        const inAliases = aliases.includes(t);
        const inTags = tags.includes(t);
        const inCategory = category.includes(t);
        const inId = id.includes(t);
        if (inTitle) score += 3;
        if (inAliases) score += 3;
        if (inTags) score += 1;
        if (inCategory) score += 1;
        if (inId) score += 1;
      }
      if (haystackAll.includes(q)) score += 2;
      return score;
    };

    const scored = articles
      .map(a => ({ a, score: scoreArticle(a) }))
      .filter(x => x.score > 0)
      .sort((x, y) => y.score - x.score)
      .slice(0, limit)
      .map(x => x.a);

    return NextResponse.json(scored);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to search articles' }, { status: 500 });
  }
}


