import { Suspense } from 'react';
import {
  getStandings,
  getCurrentSeason,
  groupStandingsByDivision,
} from '@/lib/api/espn';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { Standing } from '@/types/nfl';

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

function DivisionCard({
  divisionKey,
  teams,
}: {
  divisionKey: string;
  teams: Standing[];
}) {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base sm:text-lg">{divisionKey}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle px-4 sm:px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Team</TableHead>
                  <TableHead className="text-center text-xs sm:text-sm">W</TableHead>
                  <TableHead className="text-center text-xs sm:text-sm">L</TableHead>
                  <TableHead className="text-center text-xs sm:text-sm hidden sm:table-cell">T</TableHead>
                  <TableHead className="text-center text-xs sm:text-sm hidden md:table-cell">PCT</TableHead>
                  <TableHead className="text-center text-xs sm:text-sm hidden lg:table-cell">PF</TableHead>
                  <TableHead className="text-center text-xs sm:text-sm hidden lg:table-cell">PA</TableHead>
                  <TableHead className="text-center text-xs sm:text-sm hidden md:table-cell">DIFF</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((team, index) => (
                  <TableRow key={team.Team}>
                    <TableCell className="text-xs sm:text-sm">
                      <span className="text-muted-foreground mr-1 sm:mr-2">
                        {index + 1}.
                      </span>
                      <Link
                        href={`/teams/${team.Team}`}
                        className="font-medium hover:underline"
                      >
                        <span className="hidden sm:inline">{team.Name}</span>
                        <span className="sm:hidden">{team.Team}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="text-center text-xs sm:text-sm">{team.Wins}</TableCell>
                    <TableCell className="text-center text-xs sm:text-sm">{team.Losses}</TableCell>
                    <TableCell className="text-center text-xs sm:text-sm hidden sm:table-cell">{team.Ties}</TableCell>
                    <TableCell className="text-center text-xs sm:text-sm hidden md:table-cell">
                      {team.Percentage.toFixed(3)}
                    </TableCell>
                    <TableCell className="text-center text-xs sm:text-sm hidden lg:table-cell">{team.PointsFor}</TableCell>
                    <TableCell className="text-center text-xs sm:text-sm hidden lg:table-cell">
                      {team.PointsAgainst}
                    </TableCell>
                    <TableCell
                      className={`text-center text-xs sm:text-sm hidden md:table-cell ${
                        team.NetPoints > 0
                          ? 'text-green-600'
                          : team.NetPoints < 0
                            ? 'text-red-600'
                            : ''
                      }`}
                    >
                      {team.NetPoints > 0 ? '+' : ''}
                      {team.NetPoints}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
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

  const afcDivisions = Object.keys(standings)
    .filter((key) => key.startsWith('AFC'))
    .sort();
  const nfcDivisions = Object.keys(standings)
    .filter((key) => key.startsWith('NFC'))
    .sort();

  return (
    <div>
      <div className="mb-4 text-xs sm:text-sm text-muted-foreground bg-secondary/50 px-3 sm:px-4 py-2 rounded-md inline-block">
        {season} Season Standings
      </div>

      <Tabs defaultValue="afc" className="w-full">
        <TabsList className="mb-4 grid grid-cols-2 w-full sm:w-auto">
          <TabsTrigger value="afc" className="text-sm sm:text-base">AFC</TabsTrigger>
          <TabsTrigger value="nfc" className="text-sm sm:text-base">NFC</TabsTrigger>
        </TabsList>

        <TabsContent value="afc">
          <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
            {afcDivisions.map((div) => (
              <DivisionCard
                key={div}
                divisionKey={div}
                teams={standings[div]}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="nfc">
          <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
            {nfcDivisions.map((div) => (
              <DivisionCard
                key={div}
                divisionKey={div}
                teams={standings[div]}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
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
