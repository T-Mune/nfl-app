import { Suspense } from 'react';
import { ScoresList } from '@/components/scores/ScoresList';
import { WeekSelector } from '@/components/scores/WeekSelector';
import {
  getScoresByWeek,
  getCurrentSeason,
  getSeasonWeeks,
  getLiveScores,
  SeasonType,
} from '@/lib/api/espn';
import { Game } from '@/types/nfl';

interface FetchResult {
  games: Game[] | null;
  error: boolean;
  season: number;
  week: number;
  seasonType: number;
}

async function fetchScores(
  season: number,
  week: number,
  seasonType: number
): Promise<FetchResult> {
  try {
    const games = await getScoresByWeek(season, week, seasonType);
    return { games, error: false, season, week, seasonType };
  } catch {
    return { games: null, error: true, season, week, seasonType };
  }
}

async function fetchCurrentWeek(): Promise<{
  week: number;
  season: number;
  seasonType: number;
}> {
  try {
    const result = await getLiveScores();
    return {
      week: result.week,
      season: result.season,
      seasonType: result.seasonType,
    };
  } catch {
    return {
      week: 1,
      season: getCurrentSeason(),
      seasonType: SeasonType.REGULAR,
    };
  }
}

async function Scores({
  season,
  week,
  seasonType,
}: {
  season: number;
  week: number;
  seasonType: number;
}) {
  const { games, error } = await fetchScores(season, week, seasonType);

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
  searchParams: Promise<{
    week?: string;
    season?: string;
    seasonType?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const current = await fetchCurrentWeek();

  const season = params.season ? parseInt(params.season, 10) : current.season;
  const week = params.week ? parseInt(params.week, 10) : current.week;
  const seasonType = params.seasonType
    ? parseInt(params.seasonType, 10)
    : current.seasonType;
  const weeks = getSeasonWeeks(seasonType);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-1 sm:w-1.5 h-6 sm:h-8 bg-accent rounded-full" />
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Live Scores</h1>
        </div>
        <WeekSelector
          weeks={weeks}
          currentWeek={week}
          season={season}
          seasonType={seasonType}
          currentSeason={current.season}
          currentSeasonType={current.seasonType}
        />
      </div>

      <div className="mb-4 text-xs sm:text-sm text-muted-foreground bg-secondary/50 px-3 sm:px-4 py-2 rounded-md inline-block">
        {season} Season - Week {week}
        {week === current.week &&
          season === current.season &&
          seasonType === current.seasonType && (
            <span className="ml-2 text-accent font-medium">(Current)</span>
          )}
      </div>

      <Suspense
        key={`${season}-${week}-${seasonType}`}
        fallback={<ScoresLoading />}
      >
        <Scores season={season} week={week} seasonType={seasonType} />
      </Suspense>
    </div>
  );
}
