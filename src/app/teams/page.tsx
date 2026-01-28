import { Suspense } from 'react';
import { getTeams } from '@/lib/api/sportsdata';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { Team } from '@/types/nfl';

interface FetchResult {
  teams: Record<string, Team[]> | null;
  error: boolean;
}

async function fetchTeamsData(): Promise<FetchResult> {
  try {
    const teams = await getTeams();

    // Group by conference and division
    const grouped = teams.reduce(
      (acc, team) => {
        const key = `${team.Conference} ${team.Division}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(team);
        return acc;
      },
      {} as Record<string, Team[]>
    );

    return { teams: grouped, error: false };
  } catch {
    return { teams: null, error: true };
  }
}

function DivisionCard({
  divisionKey,
  teams,
}: {
  divisionKey: string;
  teams: Team[];
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{divisionKey}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {teams
            .sort((a, b) => a.City.localeCompare(b.City))
            .map((team) => (
              <Link
                key={team.Key}
                href={`/teams/${team.Key}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: `#${team.PrimaryColor}` }}
                >
                  {team.Key}
                </div>
                <div>
                  <div className="font-medium">{team.FullName}</div>
                  <div className="text-xs text-muted-foreground">
                    {team.HeadCoach && `Coach: ${team.HeadCoach}`}
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

async function TeamsContent() {
  const { teams, error } = await fetchTeamsData();

  if (error || !teams) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load teams.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please check your API configuration.
        </p>
      </div>
    );
  }

  const afcDivisions = Object.keys(teams)
    .filter((key) => key.startsWith('AFC'))
    .sort();
  const nfcDivisions = Object.keys(teams)
    .filter((key) => key.startsWith('NFC'))
    .sort();

  return (
    <Tabs defaultValue="afc" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="afc">AFC</TabsTrigger>
        <TabsTrigger value="nfc">NFC</TabsTrigger>
      </TabsList>

      <TabsContent value="afc">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {afcDivisions.map((div) => (
            <DivisionCard key={div} divisionKey={div} teams={teams[div]} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="nfc">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {nfcDivisions.map((div) => (
            <DivisionCard key={div} divisionKey={div} teams={teams[div]} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}

function TeamsLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
      ))}
    </div>
  );
}

export default function TeamsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Teams</h1>
      <Suspense fallback={<TeamsLoading />}>
        <TeamsContent />
      </Suspense>
    </div>
  );
}
