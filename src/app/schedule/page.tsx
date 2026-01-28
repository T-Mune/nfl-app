import { Suspense } from 'react';
import {
  getSchedule,
  getCurrentSeason,
  formatGameDate,
  formatGameTime,
} from '@/lib/api/sportsdata';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { Schedule } from '@/types/nfl';

interface FetchResult {
  schedule: Schedule[] | null;
  error: boolean;
  season: number;
}

async function fetchScheduleData(): Promise<FetchResult> {
  const season = getCurrentSeason();

  try {
    const schedule = await getSchedule(season);
    return { schedule, error: false, season };
  } catch {
    return { schedule: null, error: true, season };
  }
}

async function ScheduleContent() {
  const { schedule, error, season } = await fetchScheduleData();

  if (error || !schedule) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load schedule.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please check your API configuration.
        </p>
      </div>
    );
  }

  // Group by week
  const weeks = schedule.reduce(
    (acc, game) => {
      const week = game.Week;
      if (!acc[week]) {
        acc[week] = [];
      }
      acc[week].push(game);
      return acc;
    },
    {} as Record<number, Schedule[]>
  );

  const weekNumbers = Object.keys(weeks)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div>
      <div className="mb-4 text-sm text-muted-foreground">
        {season} Season Schedule
      </div>

      <Tabs defaultValue={String(weekNumbers[0] || 1)} className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1 mb-4">
          {weekNumbers.map((week) => (
            <TabsTrigger key={week} value={String(week)} className="text-xs">
              Week {week}
            </TabsTrigger>
          ))}
        </TabsList>

        {weekNumbers.map((week) => (
          <TabsContent key={week} value={String(week)}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Away</TableHead>
                  <TableHead>Home</TableHead>
                  <TableHead>Channel</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {weeks[week]
                  .sort(
                    (a, b) =>
                      new Date(a.Date).getTime() - new Date(b.Date).getTime()
                  )
                  .map((game) => (
                    <TableRow key={game.GameKey}>
                      <TableCell>{formatGameDate(game.Date)}</TableCell>
                      <TableCell>{formatGameTime(game.Date)}</TableCell>
                      <TableCell>
                        <Link
                          href={`/teams/${game.AwayTeam}`}
                          className="hover:underline font-medium"
                        >
                          {game.AwayTeam}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/teams/${game.HomeTeam}`}
                          className="hover:underline font-medium"
                        >
                          {game.HomeTeam}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {game.Channel || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
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
      <h1 className="text-3xl font-bold mb-6">Schedule</h1>
      <Suspense fallback={<ScheduleLoading />}>
        <ScheduleContent />
      </Suspense>
    </div>
  );
}
