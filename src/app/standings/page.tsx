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
        <CardTitle className="text-lg">{divisionKey}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Team</TableHead>
              <TableHead className="text-center">W</TableHead>
              <TableHead className="text-center">L</TableHead>
              <TableHead className="text-center">T</TableHead>
              <TableHead className="text-center">PCT</TableHead>
              <TableHead className="text-center">PF</TableHead>
              <TableHead className="text-center">PA</TableHead>
              <TableHead className="text-center">DIFF</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team, index) => (
              <TableRow key={team.Team}>
                <TableCell>
                  <span className="text-muted-foreground mr-2">
                    {index + 1}.
                  </span>
                  <Link
                    href={`/teams/${team.Team}`}
                    className="font-medium hover:underline"
                  >
                    {team.Name}
                  </Link>
                </TableCell>
                <TableCell className="text-center">{team.Wins}</TableCell>
                <TableCell className="text-center">{team.Losses}</TableCell>
                <TableCell className="text-center">{team.Ties}</TableCell>
                <TableCell className="text-center">
                  {team.Percentage.toFixed(3)}
                </TableCell>
                <TableCell className="text-center">{team.PointsFor}</TableCell>
                <TableCell className="text-center">
                  {team.PointsAgainst}
                </TableCell>
                <TableCell
                  className={`text-center ${
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
      <div className="mb-4 text-sm text-muted-foreground">
        {season} Season Standings
      </div>

      <Tabs defaultValue="afc" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="afc">AFC</TabsTrigger>
          <TabsTrigger value="nfc">NFC</TabsTrigger>
        </TabsList>

        <TabsContent value="afc">
          <div className="grid gap-4 lg:grid-cols-2">
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
          <div className="grid gap-4 lg:grid-cols-2">
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
      <h1 className="text-3xl font-bold mb-6">Standings</h1>
      <Suspense fallback={<StandingsLoading />}>
        <StandingsContent />
      </Suspense>
    </div>
  );
}
