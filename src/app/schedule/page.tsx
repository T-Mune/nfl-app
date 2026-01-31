import { Suspense } from 'react';
import {
  getScoresByWeek,
  getCurrentSeason,
  getSeasonWeeks,
  formatGameDate,
  formatGameTime,
} from '@/lib/api/espn';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
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

function getGameStatusBadge(game: Game) {
  if (game.IsOver || game.Closed) {
    return <Badge variant="secondary">Final</Badge>;
  }
  if (game.IsInProgress) {
    return <Badge variant="default">Live</Badge>;
  }
  return null;
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

  return (
    <div>
      <div className="mb-4 text-xs sm:text-sm text-muted-foreground bg-secondary/50 px-3 sm:px-4 py-2 rounded-md inline-block">
        {season} Season Schedule
      </div>

      <Tabs defaultValue={String(weekNumbers[0] || 1)} className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1 mb-4">
          {weekNumbers.map((week) => (
            <TabsTrigger key={week} value={String(week)} className="text-xs px-2 sm:px-3">
              Week {week}
            </TabsTrigger>
          ))}
        </TabsList>

        {weekNumbers.map((week) => (
          <TabsContent key={week} value={String(week)}>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">Date</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Time</TableHead>
                      <TableHead className="text-xs sm:text-sm">Away</TableHead>
                      <TableHead className="text-center text-xs sm:text-sm">Score</TableHead>
                      <TableHead className="text-xs sm:text-sm">Home</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden md:table-cell">Status</TableHead>
                    </TableRow>
                  </TableHeader>
              <TableBody>
                {games[week]
                  .sort(
                    (a, b) =>
                      new Date(a.Date).getTime() - new Date(b.Date).getTime()
                  )
                  .map((game) => (
                    <TableRow key={game.GameKey}>
                      <TableCell className="text-xs sm:text-sm whitespace-nowrap">{formatGameDate(game.Date)}</TableCell>
                      <TableCell className="text-xs sm:text-sm hidden sm:table-cell whitespace-nowrap">{formatGameTime(game.Date)}</TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        <Link
                          href={`/teams/${game.AwayTeam}`}
                          className="hover:underline font-medium"
                        >
                          <span className="hidden sm:inline">{game.AwayTeamName || game.AwayTeam}</span>
                          <span className="sm:hidden">{game.AwayTeam}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="text-center font-mono text-xs sm:text-sm">
                        {game.IsOver || game.IsInProgress ? (
                          <span>
                            {game.AwayScore ?? '-'} - {game.HomeScore ?? '-'}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">vs</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        <Link
                          href={`/teams/${game.HomeTeam}`}
                          className="hover:underline font-medium"
                        >
                          <span className="hidden sm:inline">{game.HomeTeamName || game.HomeTeam}</span>
                          <span className="sm:hidden">{game.HomeTeam}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getGameStatusBadge(game) || (
                          <span className="text-muted-foreground text-xs sm:text-sm">
                            {game.Channel || 'TBD'}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
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
