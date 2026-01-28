import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getTeam, getPlayersByTeam } from '@/lib/api/sportsdata';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { Team, Player } from '@/types/nfl';

interface TeamPageProps {
  params: Promise<{ teamId: string }>;
}

interface FetchResult {
  team: Team | null;
  players: Player[];
  error: boolean;
}

async function fetchTeamData(teamId: string): Promise<FetchResult> {
  try {
    const [team, players] = await Promise.all([
      getTeam(teamId),
      getPlayersByTeam(teamId),
    ]);
    return { team: team || null, players, error: false };
  } catch {
    return { team: null, players: [], error: true };
  }
}

async function TeamDetail({ teamId }: { teamId: string }) {
  const { team, players, error } = await fetchTeamData(teamId);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load team details.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please check your API configuration.
        </p>
      </div>
    );
  }

  if (!team) {
    notFound();
  }

  // Group players by position
  const positionGroups: Record<string, Player[]> = {};
  players.forEach((player) => {
    const pos = player.Position || 'Other';
    if (!positionGroups[pos]) {
      positionGroups[pos] = [];
    }
    positionGroups[pos].push(player);
  });

  const positionOrder = [
    'QB',
    'RB',
    'WR',
    'TE',
    'OL',
    'DL',
    'LB',
    'DB',
    'K',
    'P',
  ];

  const sortedPlayers = positionOrder
    .flatMap((pos) => positionGroups[pos] || [])
    .concat(
      Object.entries(positionGroups)
        .filter(([pos]) => !positionOrder.includes(pos))
        .flatMap(([, p]) => p)
    )
    .filter((player) => player.Active)
    .slice(0, 53);

  return (
    <div>
      {/* Team Header */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
          style={{ backgroundColor: `#${team.PrimaryColor}` }}
        >
          {team.Key}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{team.FullName}</h1>
          <p className="text-muted-foreground">
            {team.Conference} {team.Division}
          </p>
          {team.HeadCoach && (
            <p className="text-sm text-muted-foreground">
              Head Coach: {team.HeadCoach}
            </p>
          )}
        </div>
      </div>

      {/* Team Info */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{team.Conference}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Division</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{team.Division}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Bye Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Week {team.ByeWeek}</div>
          </CardContent>
        </Card>
      </div>

      {/* Roster */}
      <h2 className="text-2xl font-bold mb-4">Roster</h2>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">
                  Height/Weight
                </TableHead>
                <TableHead className="hidden md:table-cell">College</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPlayers.map((player) => (
                <TableRow key={player.PlayerID}>
                  <TableCell className="font-medium">
                    {player.Number || '-'}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/players/${player.PlayerID}`}
                      className="hover:underline"
                    >
                      {player.FirstName} {player.LastName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{player.Position}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        player.Status === 'Active' ? 'default' : 'secondary'
                      }
                    >
                      {player.Status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {player.Height} / {player.Weight} lbs
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {player.College}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function TeamLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-muted animate-pulse rounded-full" />
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
        </div>
      </div>
      <div className="h-64 bg-muted animate-pulse rounded-lg" />
    </div>
  );
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { teamId } = await params;

  return (
    <Suspense fallback={<TeamLoading />}>
      <TeamDetail teamId={teamId} />
    </Suspense>
  );
}
