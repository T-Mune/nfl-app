import { Standing } from '@/types/nfl';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

interface OverallTableProps {
  teams: Standing[];
  season: number;
}

export function OverallTable({ teams, season }: OverallTableProps) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-4 text-xs sm:text-sm text-muted-foreground bg-secondary/50 px-3 sm:px-4 py-2 rounded-md inline-block">
        {season} Season - Overall Standings (All 32 Teams)
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px] text-xs sm:text-sm">#</TableHead>
                  <TableHead className="text-xs sm:text-sm">Team</TableHead>
                  <TableHead className="text-center text-xs sm:text-sm">W</TableHead>
                  <TableHead className="text-center text-xs sm:text-sm">L</TableHead>
                  <TableHead className="text-center text-xs sm:text-sm hidden sm:table-cell">
                    T
                  </TableHead>
                  <TableHead className="text-center text-xs sm:text-sm hidden md:table-cell">
                    PCT
                  </TableHead>
                  <TableHead className="text-center text-xs sm:text-sm hidden lg:table-cell">
                    PF
                  </TableHead>
                  <TableHead className="text-center text-xs sm:text-sm hidden lg:table-cell">
                    PA
                  </TableHead>
                  <TableHead className="text-center text-xs sm:text-sm hidden md:table-cell">
                    DIFF
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((team, index) => (
                  <TableRow key={team.Team}>
                    <TableCell className="text-muted-foreground text-xs sm:text-sm font-medium">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      <Link
                        href={`/teams/${team.Team}`}
                        className="font-medium hover:underline"
                      >
                        <span className="hidden sm:inline">{team.Name}</span>
                        <span className="sm:hidden">{team.Team}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="text-center text-xs sm:text-sm">
                      {team.Wins}
                    </TableCell>
                    <TableCell className="text-center text-xs sm:text-sm">
                      {team.Losses}
                    </TableCell>
                    <TableCell className="text-center text-xs sm:text-sm hidden sm:table-cell">
                      {team.Ties}
                    </TableCell>
                    <TableCell className="text-center text-xs sm:text-sm hidden md:table-cell">
                      {team.Percentage.toFixed(3)}
                    </TableCell>
                    <TableCell className="text-center text-xs sm:text-sm hidden lg:table-cell">
                      {team.PointsFor}
                    </TableCell>
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
        </CardContent>
      </Card>
    </div>
  );
}
