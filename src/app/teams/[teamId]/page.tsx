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
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 text-primary-foreground">
        <div className="flex items-center gap-3 sm:gap-6">
          {team.WikipediaLogoURL ? (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 flex-shrink-0">
              <img
                src={team.WikipediaLogoURL}
                alt={team.FullName}
                className="w-12 h-12 sm:w-16 md:w-20 sm:h-16 md:h-20 object-contain"
              />
            </div>
          ) : (
            <div
              className="w-16 h-16 sm:w-20 md:w-24 sm:h-20 md:h-24 rounded-lg sm:rounded-xl flex items-center justify-center text-white text-lg sm:text-xl md:text-2xl font-bold flex-shrink-0"
              style={{ backgroundColor: `#${team.PrimaryColor}` }}
            >
              {team.Key}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">{team.FullName}</h1>
            <p className="text-primary-foreground/80 text-sm sm:text-base">
              {team.City}
            </p>
          </div>
        </div>
      </div>

      {/* Roster */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4">
        <div className="w-1 sm:w-1.5 h-5 sm:h-6 bg-accent rounded-full" />
        <h2 className="text-xl sm:text-2xl font-bold text-primary">
          Roster ({players.length} players)
        </h2>
      </div>

      {groupOrder.map((group) => {
        const groupPlayers = positionGroups[group];
        if (!groupPlayers || groupPlayers.length === 0) return null;

        return (
          <div key={group} className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-2 text-muted-foreground">
              {groupLabels[group] || group}
            </h3>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs sm:text-sm w-[40px] sm:w-[60px]">#</TableHead>
                          <TableHead className="text-xs sm:text-sm">Name</TableHead>
                          <TableHead className="text-xs sm:text-sm">Pos</TableHead>
                          <TableHead className="hidden md:table-cell text-xs sm:text-sm">
                            Height / Weight
                          </TableHead>
                          <TableHead className="hidden md:table-cell text-xs sm:text-sm">Age</TableHead>
                          <TableHead className="hidden lg:table-cell text-xs sm:text-sm">Exp</TableHead>
                          <TableHead className="hidden lg:table-cell text-xs sm:text-sm">College</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {groupPlayers.map((player) => (
                          <TableRow key={player.id}>
                            <TableCell className="font-medium text-xs sm:text-sm">
                              {player.jersey}
                            </TableCell>
                            <TableCell className="text-xs sm:text-sm">
                              <div className="flex items-center gap-1 sm:gap-2">
                                {player.headshot && (
                                  <img
                                    src={player.headshot}
                                    alt={player.fullName}
                                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
                                  />
                                )}
                                <span className="truncate">{player.fullName}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs sm:text-sm">
                              <Badge variant="outline" className="text-xs">{player.position}</Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-muted-foreground text-xs sm:text-sm whitespace-nowrap">
                              {player.height} / {player.weight}
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-muted-foreground text-xs sm:text-sm">
                              {player.age || '-'}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell text-muted-foreground text-xs sm:text-sm">
                              {player.experience === 0 ? 'R' : player.experience}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell text-muted-foreground text-xs sm:text-sm">
                              {player.college}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
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
