import { Suspense } from 'react';
import {
  getScoresByWeek,
  getCurrentSeason,
  getSeasonWeeks,
} from '@/lib/api/espn';
import { WeekSelector } from '@/components/schedule/WeekSelector';
import { Game } from '@/types/nfl';

interface FetchResult {
  games: Record<number, Game[]>;
  error: boolean;
  season: number;
}

async function fetchScheduleData(): Promise<FetchResult> {
  const season = getCurrentSeason();
  const weeks = getSeasonWeeks();

  try {
    // Fetch multiple weeks in parallel
    const weekPromises = weeks.map(async (week) => {
      try {
        const games = await getScoresByWeek(season, week);
        return { week, games };
      } catch {
        return { week, games: [] };
      }
    });

    const results = await Promise.all(weekPromises);

    const games: Record<number, Game[]> = {};
    for (const { week, games: weekGames } of results) {
      if (weekGames.length > 0) {
        games[week] = weekGames;
      }
    }

    return { games, error: false, season };
  } catch {
    return { games: {}, error: true, season };
  }
}

async function ScheduleContent() {
  const { games, error, season } = await fetchScheduleData();

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load schedule.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please try again later.
        </p>
      </div>
    );
  }

  const weekNumbers = Object.keys(games)
    .map(Number)
    .sort((a, b) => a - b);

  if (weekNumbers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No schedule data available.
      </div>
    );
  }

  return <WeekSelector games={games} season={season} />;
}

function ScheduleLoading() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-full bg-muted animate-pulse rounded" />
      <div className="h-64 w-full bg-muted animate-pulse rounded" />
    </div>
  );
}

export default function SchedulePage() {
  return (
    <div>
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="w-1 sm:w-1.5 h-6 sm:h-8 bg-accent rounded-full" />
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Schedule</h1>
      </div>
      <Suspense fallback={<ScheduleLoading />}>
        <ScheduleContent />
      </Suspense>
    </div>
  );
}
