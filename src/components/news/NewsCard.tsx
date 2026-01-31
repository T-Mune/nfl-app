import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NewsArticle } from '@/types/nfl';
import { formatNewsDate } from '@/lib/api/espn';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  return (
    <Link
      href={article.articleUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
    >
      <Card className="h-full overflow-hidden border-t-4 border-t-primary hover:shadow-lg transition-shadow">
        <CardContent className="p-0 flex flex-col h-full">
          {/* Image */}
          {article.imageUrl ? (
            <div className="relative w-full aspect-video overflow-hidden bg-muted">
              <img
                src={article.imageUrl}
                alt={article.imageAlt || article.headline}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="relative w-full aspect-video bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
              <span className="text-muted-foreground text-xs font-medium">NFL</span>
            </div>
          )}

          {/* Content */}
          <div className="p-4 flex flex-col flex-1 space-y-3">
            {/* Category badges */}
            {article.categories.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {article.categories.map((category, index) => (
                  <Badge
                    key={index}
                    variant={
                      category.type === 'team'
                        ? 'default'
                        : category.type === 'athlete'
                          ? 'secondary'
                          : 'outline'
                    }
                    className="text-xs"
                  >
                    {category.description}
                  </Badge>
                ))}
              </div>
            )}

            {/* Headline */}
            <h3 className="font-semibold text-base sm:text-lg line-clamp-2 leading-tight">
              {article.headline}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
              {article.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between gap-2 pt-2 text-xs text-muted-foreground border-t">
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <span>{formatNewsDate(article.publishedDate)}</span>
                {article.byline && (
                  <span className="truncate">By {article.byline}</span>
                )}
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {article.isPremium && (
                  <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20">
                    Premium
                  </Badge>
                )}
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
