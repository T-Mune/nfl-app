# Schedule ページ実装

## 基本情報

| 項目 | 値 |
|------|-----|
| **ファイル** | `src/app/schedule/page.tsx` |
| **ルート** | `/schedule` |
| **コンポーネントタイプ** | Server Component |
| **データソース** | ESPN Scoreboard API（全週） |

## 概要

Scheduleページは、NFLシーズン全体の試合スケジュールを表示します。プレシーズン、レギュラーシーズン、ポストシーズンの全ての週の試合を事前に取得し、週タブで切り替えて表示します。

## コンポーネント構造

```tsx
SchedulePage (Server Component)
├── PageHeader (静的)
└── Suspense
    └── ScheduleContent (Server Component)
        ├── fetchScheduleData()
        └── WeekSelector (Client Component)
            └── 選択された週の試合を表示
```

## データフェッチング

### fetchScheduleData()

全てのシーズンタイプの全ての週のデータを一度に取得します。

```tsx
async function fetchScheduleData(): Promise<FetchResult> {
  const season = getCurrentSeason();
  const seasonTypes = [
    SeasonType.PRESEASON,
    SeasonType.REGULAR,
    SeasonType.POSTSEASON,
  ];

  try {
    const allPromises = seasonTypes.flatMap((seasonType) => {
      const weeks = getSeasonWeeks(seasonType);
      return weeks.map(async (week) => {
        try {
          const games = await getScoresByWeek(season, week, seasonType);
          return { seasonType, week, games };
        } catch {
          return { seasonType, week, games: [] };
        }
      });
    });

    const results = await Promise.all(allPromises);

    const games: Record<string, Game[]> = {};
    for (const { seasonType, week, games: weekGames } of results) {
      if (weekGames.length > 0) {
        games[`${seasonType}-${week}`] = weekGames;
      }
    }

    return { games, error: false, season, seasonTypes };
  } catch {
    return { games: {}, error: true, season, seasonTypes: [] };
  }
}
```

**特徴:**
- 全シーズンタイプ（プレシーズン、レギュラー、ポストシーズン）の全週を並行取得
- `Promise.all()` で並行実行し、パフォーマンスを最適化
- データを `{seasonType}-{week}` キーの辞書形式で保存
- 個別の週でエラーが発生しても、他の週のデータは取得される

**返り値:**
```tsx
interface FetchResult {
  games: Record<string, Game[]>; // key: "seasonType-week"
  error: boolean;
  season: number;
  seasonTypes: number[];
}
```

**データ構造例:**
```typescript
{
  "1-1": [Game, Game, ...],  // Preseason Week 1
  "1-2": [Game, Game, ...],  // Preseason Week 2
  "2-1": [Game, Game, ...],  // Regular Season Week 1
  "2-2": [Game, Game, ...],  // Regular Season Week 2
  // ...
}
```

## ページコンポーネント

### SchedulePage

```tsx
export default function SchedulePage() {
  return (
    <div>
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="w-1 sm:w-1.5 h-6 sm:h-8 bg-accent rounded-full" />
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Schedule</h1>
      </div>
      <Suspense fallback={<ScheduleLoading />}>
        <ScheduleContent />
      </Suspense>
    </div>
  );
}
```

### ScheduleContent

```tsx
async function ScheduleContent() {
  const { games, error, season, seasonTypes } = await fetchScheduleData();

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load schedule.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please try again later.
        </p>
      </div>
    );
  }

  if (Object.keys(games).length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No schedule data available.
      </div>
    );
  }

  return (
    <WeekSelector games={games} season={season} seasonTypes={seasonTypes} />
  );
}
```

### ScheduleLoading

```tsx
function ScheduleLoading() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-full bg-muted animate-pulse rounded" />
      <div className="h-64 w-full bg-muted animate-pulse rounded" />
    </div>
  );
}
```

## 使用コンポーネント

### WeekSelector

**ファイル:** `src/components/schedule/WeekSelector.tsx`（Client Component）

**Props:**
```tsx
interface WeekSelectorProps {
  games: Record<string, Game[]>;
  season: number;
  seasonTypes: number[];
}
```

**機能:**
- シーズンタイプタブ（Preseason、Regular Season、Postseason）
- 週タブ（Week 1、Week 2、...）
- 選択された週の試合をScoresListで表示
- クライアントサイドの状態管理（useState）

## データフロー

```
ユーザーがページアクセス
  ↓
SchedulePage コンポーネント実行
  ↓
ページヘッダー即座に表示
  ↓
Suspense 境界
  ↓
ScheduleLoading を表示
  ↓
ScheduleContent コンポーネント実行
  ↓
fetchScheduleData() - 全週のデータを並行取得
  ↓
Promise.all() で27週分のAPI呼び出し
  （Preseason 4週 + Regular 18週 + Postseason 5週）
  ↓
データを辞書形式に整理
  ↓
WeekSelector にデータを渡す
  ↓
HTMLをクライアントに送信
  ↓
ScheduleLoading が WeekSelector に置き換わる
  ↓
ユーザーが週タブをクリック
  ↓
クライアントサイドで対応する試合データを表示
```

## パフォーマンス最適化

### 1. 並行データ取得

`Promise.all()` により、全週のデータを並行取得:
- 順次取得より大幅に高速化
- 例: 27週 × 200ms = 5.4秒 → 並行取得で約500ms

### 2. クライアントサイドの週切り替え

全データを最初に取得しているため:
- 週タブのクリックで即座に表示切り替え
- 追加のAPI呼び出し不要
- スムーズなユーザー体験

### 3. エラーハンドリング

個別の週でエラーが発生しても:
- 他の週のデータは正常に取得される
- 部分的なデータでもページを表示

---

**最終更新**: 2026年2月
**対象ページ**: `/schedule`
