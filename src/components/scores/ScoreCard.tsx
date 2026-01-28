import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Game } from '@/types/nfl';
import { getGameStatus } from '@/lib/api/espn';
import Link from 'next/link';

interface ScoreCardProps {
  game: Game;
}

export function ScoreCard({ game }: ScoreCardProps) {
  const status = getGameStatus(game);
  const isLive = game.IsInProgress;
  const isFinal = game.IsOver || game.Closed;

  return (
    <Card className={isLive ? 'border-green-500 border-2' : ''}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <Badge variant={isLive ? 'default' : isFinal ? 'secondary' : 'outline'}>
            {status}
          </Badge>
          {game.Channel && (
            <span className="text-xs text-muted-foreground">{game.Channel}</span>
          )}
        </div>

        <div className="space-y-2">
          {/* Away Team */}
          <div className="flex justify-between items-center">
            <Link
              href={`/teams/${game.AwayTeam}`}
              className="font-medium hover:underline"
            >
              {game.AwayTeam}
            </Link>
            <span className="text-2xl font-bold tabular-nums">
              {game.AwayScore ?? '-'}
            </span>
          </div>

          {/* Home Team */}
          <div className="flex justify-between items-center">
            <Link
              href={`/teams/${game.HomeTeam}`}
              className="font-medium hover:underline"
            >
              {game.HomeTeam}
            </Link>
            <span className="text-2xl font-bold tabular-nums">
              {game.HomeScore ?? '-'}
            </span>
          </div>
        </div>

        {/* Game details for in-progress games */}
        {isLive && game.DownAndDistance && (
          <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
            <p>
              {game.Possession && (
                <span className="font-medium">{game.Possession} ball - </span>
              )}
              {game.DownAndDistance}
            </p>
            {game.RedZone && (
              <Badge variant="destructive" className="mt-1">
                Red Zone
              </Badge>
            )}
          </div>
        )}

        {/* Quarter scores for final games */}
        {isFinal && (
          <div className="mt-3 pt-3 border-t">
            <div className="grid grid-cols-6 gap-1 text-xs text-center text-muted-foreground">
              <div></div>
              <div>Q1</div>
              <div>Q2</div>
              <div>Q3</div>
              <div>Q4</div>
              {(game.AwayScoreOvertime !== null || game.HomeScoreOvertime !== null) && (
                <div>OT</div>
              )}
            </div>
            <div className="grid grid-cols-6 gap-1 text-xs text-center">
              <div className="text-left">{game.AwayTeam}</div>
              <div>{game.AwayScoreQuarter1 ?? '-'}</div>
              <div>{game.AwayScoreQuarter2 ?? '-'}</div>
              <div>{game.AwayScoreQuarter3 ?? '-'}</div>
              <div>{game.AwayScoreQuarter4 ?? '-'}</div>
              {game.AwayScoreOvertime !== null && <div>{game.AwayScoreOvertime}</div>}
            </div>
            <div className="grid grid-cols-6 gap-1 text-xs text-center">
              <div className="text-left">{game.HomeTeam}</div>
              <div>{game.HomeScoreQuarter1 ?? '-'}</div>
              <div>{game.HomeScoreQuarter2 ?? '-'}</div>
              <div>{game.HomeScoreQuarter3 ?? '-'}</div>
              <div>{game.HomeScoreQuarter4 ?? '-'}</div>
              {game.HomeScoreOvertime !== null && <div>{game.HomeScoreOvertime}</div>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
