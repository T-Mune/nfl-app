import { Suspense } from 'react';
import {
  getStandings,
  getCurrentSeason,
  groupStandingsByDivision,
} from '@/lib/api/espn';
import { Standing } from '@/types/nfl';
import { StandingsSelector } from '@/components/standings/StandingsSelector';

interface FetchResult {
  standings: Record<string, Standing[]> | null;
  error: boolean;
  season: number;
}

async function fetchStandingsData(): Promise<FetchResult> {
  const season = getCurrentSeason();

  try {
    const standings = await getStandings(season);
    const grouped = groupStandingsByDivision(standings);
    return { standings: grouped, error: false, season };
  } catch {
    return { standings: null, error: true, season };
  }
}

async function StandingsContent() {
  const { standings, error, season } = await fetchStandingsData();

  if (error || !standings) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load standings.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please check your API configuration.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 text-xs sm:text-sm text-muted-foreground bg-secondary/50 px-3 sm:px-4 py-2 rounded-md inline-block">
        {season} Season Standings
      </div>
      <StandingsSelector standings={standings} season={season} />
    </div>
  );
}

function StandingsLoading() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
      ))}
    </div>
  );
}

export default function StandingsPage() {
  return (
    <div>
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="w-1 sm:w-1.5 h-6 sm:h-8 bg-accent rounded-full" />
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Standings</h1>
      </div>
      <Suspense fallback={<StandingsLoading />}>
        <StandingsContent />
      </Suspense>
    </div>
  );
}
