import { Suspense } from 'react';
import { getTeams } from '@/lib/api/espn';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { Team } from '@/types/nfl';

// NFL team divisions mapping (fixed structure)
const NFL_DIVISIONS: Record<string, { conference: string; division: string }> = {
  ARI: { conference: 'NFC', division: 'West' },
  ATL: { conference: 'NFC', division: 'South' },
  BAL: { conference: 'AFC', division: 'North' },
  BUF: { conference: 'AFC', division: 'East' },
  CAR: { conference: 'NFC', division: 'South' },
  CHI: { conference: 'NFC', division: 'North' },
  CIN: { conference: 'AFC', division: 'North' },
  CLE: { conference: 'AFC', division: 'North' },
  DAL: { conference: 'NFC', division: 'East' },
  DEN: { conference: 'AFC', division: 'West' },
  DET: { conference: 'NFC', division: 'North' },
  GB: { conference: 'NFC', division: 'North' },
  HOU: { conference: 'AFC', division: 'South' },
  IND: { conference: 'AFC', division: 'South' },
  JAX: { conference: 'AFC', division: 'South' },
  KC: { conference: 'AFC', division: 'West' },
  LAC: { conference: 'AFC', division: 'West' },
  LAR: { conference: 'NFC', division: 'West' },
  LV: { conference: 'AFC', division: 'West' },
  MIA: { conference: 'AFC', division: 'East' },
  MIN: { conference: 'NFC', division: 'North' },
  NE: { conference: 'AFC', division: 'East' },
  NO: { conference: 'NFC', division: 'South' },
  NYG: { conference: 'NFC', division: 'East' },
  NYJ: { conference: 'AFC', division: 'East' },
  PHI: { conference: 'NFC', division: 'East' },
  PIT: { conference: 'AFC', division: 'North' },
  SEA: { conference: 'NFC', division: 'West' },
  SF: { conference: 'NFC', division: 'West' },
  TB: { conference: 'NFC', division: 'South' },
  TEN: { conference: 'AFC', division: 'South' },
  WAS: { conference: 'NFC', division: 'East' },
};

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
        const divInfo = NFL_DIVISIONS[team.Key] || {
          conference: 'Unknown',
          division: 'Unknown',
        };
        const key = `${divInfo.conference} ${divInfo.division}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        // Update team with division info
        team.Conference = divInfo.conference;
        team.Division = divInfo.division;
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
  const isAFC = divisionKey.startsWith('AFC');
  return (
    <Card className="overflow-hidden border-t-4 border-t-primary">
      <CardHeader className="pb-2 bg-secondary/30">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isAFC ? 'bg-accent' : 'bg-primary'}`} />
          {divisionKey}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid gap-2">
          {teams
            .sort((a, b) => a.City.localeCompare(b.City))
            .map((team) => (
              <Link
                key={team.Key}
                href={`/teams/${team.Key}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                {team.WikipediaLogoURL ? (
                  <img
                    src={team.WikipediaLogoURL}
                    alt={team.Key}
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: `#${team.PrimaryColor}` }}
                  >
                    {team.Key}
                  </div>
                )}
                <div>
                  <div className="font-medium">{team.FullName}</div>
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
          Please try again later.
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
      <TabsList className="mb-4 grid grid-cols-2 w-full sm:w-auto">
        <TabsTrigger value="afc" className="text-sm sm:text-base">AFC</TabsTrigger>
        <TabsTrigger value="nfc" className="text-sm sm:text-base">NFC</TabsTrigger>
      </TabsList>

      <TabsContent value="afc">
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {afcDivisions.map((div) => (
            <DivisionCard key={div} divisionKey={div} teams={teams[div]} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="nfc">
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="w-1 sm:w-1.5 h-6 sm:h-8 bg-accent rounded-full" />
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Teams</h1>
      </div>
      <Suspense fallback={<TeamsLoading />}>
        <TeamsContent />
      </Suspense>
    </div>
  );
}
