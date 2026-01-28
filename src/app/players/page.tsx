'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { Player } from '@/types/nfl';

async function fetchPlayers(): Promise<Player[]> {
  const response = await fetch('/api/players');
  if (!response.ok) {
    throw new Error('Failed to fetch players');
  }
  return response.json();
}

export default function PlayersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState<string>('');
  const [teamFilter, setTeamFilter] = useState<string>('');

  const { data: players, isLoading, error } = useQuery({
    queryKey: ['players'],
    queryFn: fetchPlayers,
  });

  const filteredPlayers = useMemo(() => {
    if (!players) return [];

    return players
      .filter((player) => player.Active)
      .filter((player) => {
        const fullName =
          `${player.FirstName} ${player.LastName}`.toLowerCase();
        const matchesSearch =
          !searchTerm || fullName.includes(searchTerm.toLowerCase());
        const matchesPosition =
          !positionFilter || player.Position === positionFilter;
        const matchesTeam = !teamFilter || player.Team === teamFilter;
        return matchesSearch && matchesPosition && matchesTeam;
      })
      .slice(0, 100); // Limit results for performance
  }, [players, searchTerm, positionFilter, teamFilter]);

  const positions = useMemo(() => {
    if (!players) return [];
    const posSet = new Set(players.map((p) => p.Position).filter(Boolean));
    return Array.from(posSet).sort();
  }, [players]);

  const teams = useMemo(() => {
    if (!players) return [];
    const teamSet = new Set(players.map((p) => p.Team).filter(Boolean));
    return Array.from(teamSet).sort();
  }, [players]);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load players.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please check your API configuration.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Players</h1>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md bg-background"
            />
            <select
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="">All Positions</option>
              {positions.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="">All Teams</option>
              {teams.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
            {(searchTerm || positionFilter || teamFilter) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setPositionFilter('');
                  setTeamFilter('');
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading ? (
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            Showing {filteredPlayers.length} players
            {filteredPlayers.length === 100 && ' (limited to 100 results)'}
          </p>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead className="hidden md:table-cell">#</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlayers.map((player) => (
                    <TableRow key={player.PlayerID}>
                      <TableCell>
                        <Link
                          href={`/players/${player.PlayerID}`}
                          className="font-medium hover:underline"
                        >
                          {player.FirstName} {player.LastName}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/teams/${player.Team}`}
                          className="hover:underline"
                        >
                          {player.Team}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{player.Position}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {player.Number || '-'}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge
                          variant={
                            player.Status === 'Active' ? 'default' : 'secondary'
                          }
                        >
                          {player.Status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredPlayers.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No players found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
