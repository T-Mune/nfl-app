import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getPlayer } from '@/lib/api/sportsdata';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Player } from '@/types/nfl';

interface PlayerPageProps {
  params: Promise<{ playerId: string }>;
}

interface FetchResult {
  player: Player | null;
  error: boolean;
}

async function fetchPlayerData(playerId: string): Promise<FetchResult> {
  try {
    const player = await getPlayer(parseInt(playerId, 10));
    return { player, error: false };
  } catch {
    return { player: null, error: true };
  }
}

async function PlayerDetail({ playerId }: { playerId: string }) {
  const { player, error } = await fetchPlayerData(playerId);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load player details.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please check your API configuration.
        </p>
      </div>
    );
  }

  if (!player) {
    notFound();
  }

  const birthDate = player.BirthDate
    ? new Date(player.BirthDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  return (
    <div>
      {/* Player Header */}
      <div className="flex items-start gap-6 mb-8">
        {player.PhotoUrl ? (
          <img
            src={player.PhotoUrl}
            alt={`${player.FirstName} ${player.LastName}`}
            className="w-32 h-32 rounded-lg object-cover"
          />
        ) : (
          <div className="w-32 h-32 rounded-lg bg-muted flex items-center justify-center text-2xl font-bold">
            {player.FirstName?.[0]}
            {player.LastName?.[0]}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold">
            {player.FirstName} {player.LastName}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <Link
              href={`/teams/${player.Team}`}
              className="text-lg hover:underline"
            >
              {player.Team}
            </Link>
            <span className="text-muted-foreground">#{player.Number}</span>
          </div>
          <div className="flex gap-2 mt-2">
            <Badge variant="default">{player.Position}</Badge>
            <Badge
              variant={player.Status === 'Active' ? 'default' : 'secondary'}
            >
              {player.Status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Player Info */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Height
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{player.Height || 'N/A'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Weight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {player.Weight ? `${player.Weight} lbs` : 'N/A'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {player.Experience
                ? `${player.Experience} year${player.Experience !== 1 ? 's' : ''}`
                : 'Rookie'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              College
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{player.College || 'N/A'}</div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle>Player Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Birth Date
              </dt>
              <dd className="text-lg">{birthDate}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Fantasy Position
              </dt>
              <dd className="text-lg">{player.FantasyPosition || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Jersey Number
              </dt>
              <dd className="text-lg">{player.Number || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Status
              </dt>
              <dd className="text-lg">{player.Status}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}

function PlayerLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-6">
        <div className="w-32 h-32 bg-muted animate-pulse rounded-lg" />
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { playerId } = await params;

  return (
    <Suspense fallback={<PlayerLoading />}>
      <PlayerDetail playerId={playerId} />
    </Suspense>
  );
}
