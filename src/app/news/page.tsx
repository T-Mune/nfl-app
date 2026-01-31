import { Suspense } from 'react';
import { getNews } from '@/lib/api/espn';
import { NewsArticle } from '@/types/nfl';
import { NewsList } from '@/components/news/NewsList';

interface FetchResult {
  articles: NewsArticle[] | null;
  error: boolean;
}

async function fetchNewsData(): Promise<FetchResult> {
  try {
    const articles = await getNews();
    return { articles, error: false };
  } catch {
    return { articles: null, error: true };
  }
}

async function NewsContent() {
  const { articles, error } = await fetchNewsData();

  if (error || !articles) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load news articles.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please try again later.
        </p>
      </div>
    );
  }

  return <NewsList articles={articles} />;
}

function NewsLoading() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-96 rounded-lg border border-border bg-muted animate-pulse"
        />
      ))}
    </div>
  );
}

export default function NewsPage() {
  return (
    <div>
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="w-1 sm:w-1.5 h-6 sm:h-8 bg-accent rounded-full" />
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">News</h1>
      </div>
      <Suspense fallback={<NewsLoading />}>
        <NewsContent />
      </Suspense>
    </div>
  );
}
