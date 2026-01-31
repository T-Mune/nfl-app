'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Game } from '@/types/nfl';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { formatGameDate, formatGameTime } from '@/lib/api/espn';

interface WeekSelectorProps {
  games: Record<number, Game[]>;
  season: number;
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

export function WeekSelector({ games, season }: WeekSelectorProps) {
  const weekNumbers = Object.keys(games)
    .map(Number)
    .sort((a, b) => a - b);

  const [selectedWeek, setSelectedWeek] = useState(String(weekNumbers[0] || 1));

  const currentGames = games[Number(selectedWeek)] || [];

  return (
    <div>
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="text-xs sm:text-sm text-muted-foreground bg-secondary/50 px-3 sm:px-4 py-2 rounded-md">
          {season} Season Schedule
        </div>
        <Select value={selectedWeek} onValueChange={setSelectedWeek}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select week" />
          </SelectTrigger>
          <SelectContent>
            {weekNumbers.map((week) => (
              <SelectItem key={week} value={String(week)}>
                Week {week}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
              {currentGames
                .sort(
                  (a, b) =>
                    new Date(a.Date).getTime() - new Date(b.Date).getTime()
                )
                .map((game) => (
                  <TableRow key={game.GameKey}>
                    <TableCell className="text-xs sm:text-sm whitespace-nowrap">
                      {formatGameDate(game.Date)}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm hidden sm:table-cell whitespace-nowrap">
                      {formatGameTime(game.Date)}
                    </TableCell>
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
    </div>
  );
}
