import { Suspense } from 'react';
import { ScoresList } from '@/components/scores/ScoresList';
import { WeekSelector } from '@/components/scores/WeekSelector';
import {
  getScoresByWeek,
  getCurrentSeason,
  getCurrentWeek,
  getSeasonWeeks,
} from '@/lib/api/sportsdata';
import { Game } from '@/types/nfl';

interface FetchResult {
  games: Game[] | null;
  error: boolean;
  season: number;
  week: number;
}

async function fetchScores(
  season: number,
  week: number
): Promise<FetchResult> {
  try {
    const games = await getScoresByWeek(season, week);
    return { games, error: false, season, week };
  } catch {
    return { games: null, error: true, season, week };
  }
}

async function Scores({ season, week }: { season: number; week: number }) {
  const { games, error } = await fetchScores(season, week);

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

  return <ScoresList games={games} />;
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

interface HomePageProps {
  searchParams: Promise<{ week?: string; season?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const currentSeason = getCurrentSeason();
  const currentWeek = getCurrentWeek();

  const season = params.season ? parseInt(params.season, 10) : currentSeason;
  const week = params.week ? parseInt(params.week, 10) : currentWeek;
  const weeks = getSeasonWeeks();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Scores</h1>
        <WeekSelector
          weeks={weeks}
          currentWeek={week}
          season={season}
          currentSeason={currentSeason}
        />
      </div>

      <div className="mb-4 text-sm text-muted-foreground">
        {season} Season - Week {week}
        {week === currentWeek && season === currentSeason && ' (Current)'}
      </div>

      <Suspense key={`${season}-${week}`} fallback={<ScoresLoading />}>
        <Scores season={season} week={week} />
      </Suspense>
    </div>
  );
}
