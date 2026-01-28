import { Suspense } from 'react';
import { ScoresList } from '@/components/scores/ScoresList';
import {
  getScoresByWeek,
  getCurrentSeason,
  getCurrentWeek,
} from '@/lib/api/sportsdata';
import { Game } from '@/types/nfl';

interface FetchResult {
  games: Game[] | null;
  error: boolean;
  season: number;
  week: number;
}

async function fetchScores(): Promise<FetchResult> {
  const season = getCurrentSeason();
  const week = getCurrentWeek();

  try {
    const games = await getScoresByWeek(season, week);
    return { games, error: false, season, week };
  } catch {
    return { games: null, error: true, season, week };
  }
}

async function LiveScores() {
  const { games, error, season, week } = await fetchScores();

  if (error || !games) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">
          Failed to load scores. Please check your API configuration.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Make sure SPORTSDATA_API_KEY is set in your environment variables.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 text-sm text-muted-foreground">
        {season} Season - Week {week}
      </div>
      <ScoresList games={games} />
    </div>
  );
}

function ScoresLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-40 rounded-lg border bg-muted animate-pulse"
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Live Scores</h1>
      <Suspense fallback={<ScoresLoading />}>
        <LiveScores />
      </Suspense>
    </div>
  );
}
