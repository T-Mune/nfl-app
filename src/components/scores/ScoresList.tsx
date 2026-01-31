import { Game } from '@/types/nfl';
import { ScoreCard } from './ScoreCard';

interface ScoresListProps {
  games: Game[];
}

export function ScoresList({ games }: ScoresListProps) {
  if (games.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No games scheduled for this week.
      </div>
    );
  }

  // Sort games: in-progress first, then by date
  const sortedGames = [...games].sort((a, b) => {
    if (a.IsInProgress && !b.IsInProgress) return -1;
    if (!a.IsInProgress && b.IsInProgress) return 1;
    return new Date(a.Date).getTime() - new Date(b.Date).getTime();
  });

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {sortedGames.map((game) => (
        <ScoreCard key={game.GameKey} game={game} />
      ))}
    </div>
  );
}
