import { Suspense } from 'react';
import {
  getScoresByWeek,
  getCurrentSeason,
  getSeasonWeeks,
  SeasonType,
} from '@/lib/api/espn';
import { WeekSelector } from '@/components/schedule/WeekSelector';
import { Game } from '@/types/nfl';

interface FetchResult {
  games: Record<string, Game[]>; // key format: "seasonType-week"
  error: boolean;
  season: number;
  seasonTypes: number[];
}

async function fetchScheduleData(): Promise<FetchResult> {
  const season = getCurrentSeason();
  const seasonTypes = [
    SeasonType.PRESEASON,
    SeasonType.REGULAR,
    SeasonType.POSTSEASON,
  ];

  try {
    // Fetch data for all season types
    const allPromises = seasonTypes.flatMap((seasonType) => {
      const weeks = getSeasonWeeks(seasonType);
      return weeks.map(async (week) => {
        try {
          const games = await getScoresByWeek(season, week, seasonType);
          return { seasonType, week, games };
        } catch {
          return { seasonType, week, games: [] };
        }
      });
    });

    const results = await Promise.all(allPromises);

    const games: Record<string, Game[]> = {};
    for (const { seasonType, week, games: weekGames } of results) {
      if (weekGames.length > 0) {
        games[`${seasonType}-${week}`] = weekGames;
      }
    }

    return { games, error: false, season, seasonTypes };
  } catch {
    return { games: {}, error: true, season, seasonTypes: [] };
  }
}

async function ScheduleContent() {
  const { games, error, season, seasonTypes } = await fetchScheduleData();

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

  if (Object.keys(games).length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No schedule data available.
      </div>
    );
  }

  return (
    <WeekSelector games={games} season={season} seasonTypes={seasonTypes} />
  );
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
