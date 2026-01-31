import { Standing } from '@/types/nfl';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface DivisionViewProps {
  standings: Record<string, Standing[]>;
}

function DivisionCard({
  divisionKey,
  teams,
}: {
  divisionKey: string;
  teams: Standing[];
}) {
  const isAFC = divisionKey.startsWith('AFC');
  return (
    <Card className="overflow-hidden border-t-4 border-t-primary">
      <CardHeader className="pb-2 bg-secondary/30">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${isAFC ? 'bg-accent' : 'bg-primary'}`}
          />
          {divisionKey}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sm:text-sm">Team</TableHead>
                <TableHead className="text-center text-xs sm:text-sm">W</TableHead>
                <TableHead className="text-center text-xs sm:text-sm">L</TableHead>
                <TableHead className="text-center text-xs sm:text-sm hidden sm:table-cell">
                  T
                </TableHead>
                <TableHead className="text-center text-xs sm:text-sm hidden md:table-cell">
                  PCT
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((team) => (
                <TableRow key={team.Team}>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export function DivisionView({ standings }: DivisionViewProps) {
  const afcDivisions = Object.keys(standings)
    .filter((key) => key.startsWith('AFC'))
    .sort();
  const nfcDivisions = Object.keys(standings)
    .filter((key) => key.startsWith('NFC'))
    .sort();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          AFC Divisions
        </h3>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto">
          {afcDivisions.map((div) => (
            <DivisionCard key={div} divisionKey={div} teams={standings[div]} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" />
          NFC Divisions
        </h3>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto">
          {nfcDivisions.map((div) => (
            <DivisionCard key={div} divisionKey={div} teams={standings[div]} />
          ))}
        </div>
      </div>
    </div>
  );
}
