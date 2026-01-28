import { Suspense } from 'react';
import { ScoresList } from '@/components/scores/ScoresList';
import { WeekSelector } from '@/components/scores/WeekSelector';
import {
  getScoresByWeek,
  getCurrentSeason,
  getSeasonWeeks,
  getLiveScores,
} from '@/lib/api/espn';
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

async function fetchCurrentWeek(): Promise<{ week: number; season: number }> {
  try {
    const result = await getLiveScores();
    return { week: result.week, season: result.season };
  } catch {
    return { week: 1, season: getCurrentSeason() };
  }
}

async function Scores({ season, week }: { season: number; week: number }) {
  const { games, error } = await fetchScores(season, week);

  if (error || !games) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load scores.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please try again later.
        </p>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No games found for this week.
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
  const current = await fetchCurrentWeek();

  const season = params.season ? parseInt(params.season, 10) : current.season;
  const week = params.week ? parseInt(params.week, 10) : current.week;
  const weeks = getSeasonWeeks();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Scores</h1>
        <WeekSelector
          weeks={weeks}
          currentWeek={week}
          season={season}
          currentSeason={current.season}
        />
      </div>

      <div className="mb-4 text-sm text-muted-foreground">
        {season} Season - Week {week}
        {week === current.week && season === current.season && ' (Current)'}
      </div>

      <Suspense key={`${season}-${week}`} fallback={<ScoresLoading />}>
        <Scores season={season} week={week} />
      </Suspense>
    </div>
  );
}
