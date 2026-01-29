import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import {
  getTeam,
  getTeamIdFromAbbreviation,
  getTeamRoster,
  RosterPlayer,
} from '@/lib/api/espn';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Team } from '@/types/nfl';

interface TeamPageProps {
  params: Promise<{ teamId: string }>;
}

interface FetchResult {
  team: Team | null;
  players: RosterPlayer[];
  error: boolean;
}

async function fetchTeamData(teamAbbr: string): Promise<FetchResult> {
  try {
    const team = await getTeam(teamAbbr);
    if (!team) {
      return { team: null, players: [], error: false };
    }

    const teamId = await getTeamIdFromAbbreviation(teamAbbr);
    if (!teamId) {
      return { team, players: [], error: false };
    }

    const players = await getTeamRoster(teamId);
    return { team, players, error: false };
  } catch {
    return { team: null, players: [], error: true };
  }
}

async function TeamDetail({ teamAbbr }: { teamAbbr: string }) {
  const { team, players, error } = await fetchTeamData(teamAbbr);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load team details.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please try again later.
        </p>
      </div>
    );
  }

  if (!team) {
    notFound();
  }

  // Group players by position group
  const positionGroups: Record<string, RosterPlayer[]> = {};
  players.forEach((player) => {
    const group = player.positionGroup || 'other';
    if (!positionGroups[group]) {
      positionGroups[group] = [];
    }
    positionGroups[group].push(player);
  });

  const groupOrder = ['offense', 'defense', 'specialTeams', 'other'];
  const groupLabels: Record<string, string> = {
    offense: 'Offense',
    defense: 'Defense',
    specialTeams: 'Special Teams',
    other: 'Other',
  };

  return (
    <div>
      {/* Team Header */}
      <div className="flex items-center gap-4 mb-8">
        {team.WikipediaLogoURL ? (
          <img
            src={team.WikipediaLogoURL}
            alt={team.FullName}
            className="w-20 h-20 object-contain"
          />
        ) : (
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
            style={{ backgroundColor: `#${team.PrimaryColor}` }}
          >
            {team.Key}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold">{team.FullName}</h1>
          <p className="text-muted-foreground">
            {team.City}
          </p>
        </div>
      </div>

      {/* Roster */}
      <h2 className="text-2xl font-bold mb-4">
        Roster ({players.length} players)
      </h2>

      {groupOrder.map((group) => {
        const groupPlayers = positionGroups[group];
        if (!groupPlayers || groupPlayers.length === 0) return null;

        return (
          <div key={group} className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-muted-foreground">
              {groupLabels[group] || group}
            </h3>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Height / Weight
                      </TableHead>
                      <TableHead className="hidden md:table-cell">Age</TableHead>
                      <TableHead className="hidden lg:table-cell">Exp</TableHead>
                      <TableHead className="hidden lg:table-cell">College</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupPlayers.map((player) => (
                      <TableRow key={player.id}>
                        <TableCell className="font-medium">
                          {player.jersey}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {player.headshot && (
                              <img
                                src={player.headshot}
                                alt={player.fullName}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            )}
                            <span>{player.fullName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{player.position}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {player.height} / {player.weight}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {player.age || '-'}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground">
                          {player.experience === 0 ? 'R' : player.experience}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground">
                          {player.college}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );
      })}
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
      <TeamDetail teamAbbr={teamId} />
    </Suspense>
  );
}
