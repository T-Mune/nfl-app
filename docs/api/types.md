# データ型定義

このドキュメントでは、アプリケーションで使用するデータ型の詳細を説明します。

## 型定義ファイル

```
src/types/
├── nfl.ts        # アプリケーションドメイン型
└── espn.ts       # ESPN APIレスポンス型
```

## アプリケーションドメイン型

**ファイル:** `src/types/nfl.ts`

### Game（試合）

```typescript
export interface Game {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  date: string;
  quarter?: string;
  clock?: string;
  isLive: boolean;
  isFinal: boolean;
  quarterScores?: {
    home: (number | null)[];
    away: (number | null)[];
  };
}
```

**フィールド説明:**
- `id`: 試合の一意識別子
- `homeTeam`, `awayTeam`: ホームチームとアウェイチーム
- `homeScore`, `awayScore`: 各チームの得点（試合前はnull）
- `status`: 試合状態（"STATUS_SCHEDULED", "STATUS_IN_PROGRESS", "STATUS_FINAL"）
- `date`: 試合日時（ISO 8601形式）
- `isLive`, `isFinal`: 試合状態のブール値

### Team（チーム）

```typescript
export interface Team {
  Key: string;
  FullName: string;
  City: string;
  WikipediaLogoURL?: string;
  PrimaryColor?: string;
  Conference?: string;
  Division?: string;
}
```

### Standing（順位）

```typescript
export interface Standing {
  teamId: string;
  teamName: string;
  abbreviation: string;
  wins: number;
  losses: number;
  ties: number;
  winPercentage: number;
  pointsFor: number;
  pointsAgainst: number;
  pointDifferential: number;
  divisionRecord?: string;
  conferenceRecord?: string;
  homeRecord?: string;
  awayRecord?: string;
  streak?: string;
  rank: number;
}
```

### NewsArticle（ニュース記事）

```typescript
export interface NewsArticle {
  id: string;
  headline: string;
  description: string;
  articleUrl: string;
  imageUrl?: string;
  imageAlt?: string;
  publishedDate: string;
  byline?: string;
  isPremium: boolean;
  categories: NewsCategory[];
}

export interface NewsCategory {
  description: string;
  type: 'team' | 'athlete' | 'topic';
}
```

## ESPN APIレスポンス型

**ファイル:** `src/types/espn.ts`

### ESPNScoreboard

```typescript
export interface ESPNScoreboard {
  leagues: ESPNLeague[];
  season: ESPNSeason;
  week: ESPNWeek;
  events: ESPNEvent[];
}

export interface ESPNEvent {
  id: string;
  name: string;
  date: string;
  competitions: ESPNCompetition[];
  status: ESPNStatus;
}

export interface ESPNCompetition {
  id: string;
  competitors: ESPNCompetitor[];
  status: ESPNStatus;
}

export interface ESPNCompetitor {
  team: ESPNTeam;
  score: string;
  homeAway: 'home' | 'away';
  linescores?: ESPNLinescore[];
}
```

## 型変換関数

ESPN APIのレスポンスをアプリケーション型に変換します。

**ファイル:** `src/lib/api/espn.ts`

### convertESPNEventToGame()

```typescript
function convertESPNEventToGame(event: ESPNEvent): Game {
  const competition = event.competitions[0];
  const homeTeam = competition.competitors.find(c => c.homeAway === 'home');
  const awayTeam = competition.competitors.find(c => c.homeAway === 'away');

  return {
    id: event.id,
    homeTeam: {
      Key: homeTeam.team.abbreviation,
      FullName: homeTeam.team.displayName,
      City: homeTeam.team.location,
      WikipediaLogoURL: homeTeam.team.logo,
    },
    awayTeam: { /* 同様 */ },
    homeScore: parseInt(homeTeam.score) || null,
    awayScore: parseInt(awayTeam.score) || null,
    status: competition.status.type.name,
    date: event.date,
    isLive: competition.status.type.name === 'STATUS_IN_PROGRESS',
    isFinal: competition.status.type.name === 'STATUS_FINAL',
    // ...
  };
}
```

**変換の流れ:**
```
ESPNEvent → Game
  - event.id → game.id
  - competitor[home].team → game.homeTeam
  - competitor[away].team → game.awayTeam
  - competitor[home].score → game.homeScore (parseIntしてnullableに)
  - status.type.name → game.status
```

### その他の変換関数

- `convertESPNTeam()`: ESPN Team → Team
- `convertESPNNewsArticle()`: ESPN News → NewsArticle
- `convertESPNStanding()`: ESPN Standing → Standing

## 型の使用例

### ページコンポーネント

```typescript
async function Scores() {
  const games: Game[] = await getScoresByWeek(2025, 10, 2);
  return <ScoresList games={games} />;
}
```

### コンポーネントProps

```typescript
interface ScoresListProps {
  games: Game[];
}

export function ScoresList({ games }: ScoresListProps) {
  return (
    <div>
      {games.map(game => (
        <ScoreCard key={game.id} game={game} />
      ))}
    </div>
  );
}
```

---

**最終更新**: 2026年2月
