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
    <Card className={`overflow-hidden ${isLive ? 'border-accent border-2 shadow-lg' : 'border-t-4 border-t-primary'}`}>
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-2 bg-secondary/50">
          <Badge
            variant={isLive ? 'default' : isFinal ? 'secondary' : 'outline'}
            className={isLive ? 'bg-accent text-accent-foreground animate-pulse' : ''}
          >
            {isLive ? 'LIVE' : status}
          </Badge>
          {game.Channel && (
            <span className="text-xs text-muted-foreground font-medium">{game.Channel}</span>
          )}
        </div>

        <div className="p-4 space-y-3">
          {/* Away Team */}
          <div className="flex justify-between items-center">
            <Link
              href={`/teams/${game.AwayTeam}`}
              className="flex items-center gap-2 font-medium hover:text-accent transition-colors"
            >
              {game.AwayTeamLogo && (
                <img src={game.AwayTeamLogo} alt={game.AwayTeam} className="w-6 h-6 object-contain" />
              )}
              <span>{game.AwayTeamName || game.AwayTeam}</span>
            </Link>
            <span className={`text-2xl font-bold tabular-nums ${isFinal && game.AwayScore !== null && game.HomeScore !== null && game.AwayScore > game.HomeScore ? 'text-primary' : ''}`}>
              {game.AwayScore ?? '-'}
            </span>
          </div>

          {/* Home Team */}
          <div className="flex justify-between items-center">
            <Link
              href={`/teams/${game.HomeTeam}`}
              className="flex items-center gap-2 font-medium hover:text-accent transition-colors"
            >
              {game.HomeTeamLogo && (
                <img src={game.HomeTeamLogo} alt={game.HomeTeam} className="w-6 h-6 object-contain" />
              )}
              <span>{game.HomeTeamName || game.HomeTeam}</span>
            </Link>
            <span className={`text-2xl font-bold tabular-nums ${isFinal && game.AwayScore !== null && game.HomeScore !== null && game.HomeScore > game.AwayScore ? 'text-primary' : ''}`}>
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
          <div className="px-4 pb-4">
            <div className="pt-3 border-t border-border/50">
              <div className="grid grid-cols-6 gap-1 text-xs text-center text-muted-foreground font-medium">
                <div></div>
                <div className="bg-secondary/50 rounded py-1">Q1</div>
                <div className="bg-secondary/50 rounded py-1">Q2</div>
                <div className="bg-secondary/50 rounded py-1">Q3</div>
                <div className="bg-secondary/50 rounded py-1">Q4</div>
                {(game.AwayScoreOvertime !== null || game.HomeScoreOvertime !== null) && (
                  <div className="bg-accent/20 rounded py-1 text-accent">OT</div>
                )}
              </div>
              <div className="grid grid-cols-6 gap-1 text-xs text-center mt-1">
                <div className="text-left font-medium">{game.AwayTeam}</div>
                <div className="py-1">{game.AwayScoreQuarter1 ?? '-'}</div>
                <div className="py-1">{game.AwayScoreQuarter2 ?? '-'}</div>
                <div className="py-1">{game.AwayScoreQuarter3 ?? '-'}</div>
                <div className="py-1">{game.AwayScoreQuarter4 ?? '-'}</div>
                {game.AwayScoreOvertime !== null && <div className="py-1">{game.AwayScoreOvertime}</div>}
              </div>
              <div className="grid grid-cols-6 gap-1 text-xs text-center">
                <div className="text-left font-medium">{game.HomeTeam}</div>
                <div className="py-1">{game.HomeScoreQuarter1 ?? '-'}</div>
                <div className="py-1">{game.HomeScoreQuarter2 ?? '-'}</div>
                <div className="py-1">{game.HomeScoreQuarter3 ?? '-'}</div>
                <div className="py-1">{game.HomeScoreQuarter4 ?? '-'}</div>
                {game.HomeScoreOvertime !== null && <div className="py-1">{game.HomeScoreOvertime}</div>}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
