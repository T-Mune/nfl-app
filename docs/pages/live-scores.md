# Live Scores ページ実装

## 基本情報

| 項目 | 値 |
|------|-----|
| **ファイル** | `src/app/page.tsx` |
| **ルート** | `/` |
| **コンポーネントタイプ** | Server Component |
| **データソース** | ESPN Scoreboard API |

## 概要

Live Scoresページは、アプリケーションのトップページであり、指定された週のNFL試合スコアを表示します。ユーザーは週選択UIを使用して、異なる週や異なるシーズンタイプ（プレシーズン、レギュラーシーズン、ポストシーズン）の試合を閲覧できます。

## コンポーネント構造

```tsx
HomePage (Server Component)
├── PageHeader (静的)
│   ├── Title: "Live Scores"
│   └── WeekSelector (Client Component)
├── SeasonInfo Badge (静的)
└── Suspense
    └── Scores (Server Component)
        ├── fetchScores()
        └── ScoresList (Server Component)
            └── ScoreCard[] (Server Component)
```

## Props

### HomePageProps

```tsx
interface HomePageProps {
  searchParams: Promise<{
    week?: string;
    season?: string;
    seasonType?: string;
  }>;
}
```

**searchParams:**
- `week`: 表示する週番号（文字列）
- `season`: 表示するシーズン年（文字列）
- `seasonType`: シーズンタイプ（1=プレシーズン、2=レギュラー、3=ポストシーズン）

**URL例:**
- `/` - デフォルト（現在の週）
- `/?week=10` - Week 10を表示
- `/?week=10&season=2025&seasonType=2` - 2025年、Week 10、レギュラーシーズン

## データフェッチング

### fetchCurrentWeek()

現在進行中の週を取得します。

```tsx
async function fetchCurrentWeek(): Promise<{
  week: number;
  season: number;
  seasonType: number;
}> {
  try {
    const result = await getLiveScores();
    return {
      week: result.week,
      season: result.season,
      seasonType: result.seasonType,
    };
  } catch {
    return {
      week: 1,
      season: getCurrentSeason(),
      seasonType: SeasonType.REGULAR,
    };
  }
}
```

**動作:**
1. `getLiveScores()` を呼び出し、現在進行中の試合情報を取得
2. レスポンスから週、シーズン、シーズンタイプを抽出
3. エラー時はデフォルト値を返す（Week 1、現在シーズン、レギュラーシーズン）

**使用API:**
- `getLiveScores()`: `src/lib/api/espn.ts`

### fetchScores()

指定された週の試合スコアを取得します。

```tsx
async function fetchScores(
  season: number,
  week: number,
  seasonType: number
): Promise<FetchResult> {
  try {
    const games = await getScoresByWeek(season, week, seasonType);
    return { games, error: false, season, week, seasonType };
  } catch {
    return { games: null, error: true, season, week, seasonType };
  }
}
```

**パラメータ:**
- `season`: シーズン年（例: 2025）
- `week`: 週番号（1～18）
- `seasonType`: シーズンタイプ（1, 2, 3）

**返り値:**
```tsx
interface FetchResult {
  games: Game[] | null;
  error: boolean;
  season: number;
  week: number;
  seasonType: number;
}
```

**使用API:**
- `getScoresByWeek()`: `src/lib/api/espn.ts`

**キャッシング:**
- 60秒間キャッシュされる（ISR）

## ページコンポーネント

### HomePage

メインのページコンポーネントです。

```tsx
export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const current = await fetchCurrentWeek();

  const season = params.season ? parseInt(params.season, 10) : current.season;
  const week = params.week ? parseInt(params.week, 10) : current.week;
  const seasonType = params.seasonType
    ? parseInt(params.seasonType, 10)
    : current.seasonType;
  const weeks = getSeasonWeeks(seasonType);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-1 sm:w-1.5 h-6 sm:h-8 bg-accent rounded-full" />
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Live Scores</h1>
        </div>
        <WeekSelector
          weeks={weeks}
          currentWeek={week}
          season={season}
          seasonType={seasonType}
          currentSeason={current.season}
          currentSeasonType={current.seasonType}
        />
      </div>

      <div className="mb-4 text-xs sm:text-sm text-muted-foreground bg-secondary/50 px-3 sm:px-4 py-2 rounded-md inline-block">
        {season} Season - Week {week}
        {week === current.week &&
          season === current.season &&
          seasonType === current.seasonType && (
            <span className="ml-2 text-accent font-medium">(Current)</span>
          )}
      </div>

      <Suspense
        key={`${season}-${week}-${seasonType}`}
        fallback={<ScoresLoading />}
      >
        <Scores season={season} week={week} seasonType={seasonType} />
      </Suspense>
    </div>
  );
}
```

**処理フロー:**
1. `searchParams` から URLクエリパラメータを取得
2. `fetchCurrentWeek()` で現在の週情報を取得
3. URLパラメータがあればそれを使用、なければ現在の週を使用
4. `getSeasonWeeks()` でシーズンタイプに応じた週数を取得
5. ページヘッダーと週選択UIを表示
6. シーズン情報バッジを表示（現在の週の場合は "(Current)" を追加）
7. Suspense でスコアコンテンツをラップし、読み込み中は `ScoresLoading` を表示

**key属性:**
```tsx
key={`${season}-${week}-${seasonType}`}
```
- シーズン、週、シーズンタイプが変わるたびにSuspenseを再マウント
- これにより、異なる週に切り替えたときに確実に再フェッチされる

## Scoresコンポーネント

データフェッチングとコンテンツ表示を担当します。

```tsx
async function Scores({
  season,
  week,
  seasonType,
}: {
  season: number;
  week: number;
  seasonType: number;
}) {
  const { games, error } = await fetchScores(season, week, seasonType);

  if (error || !games) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load scores.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please try again later.
        </p>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No games found for this week.
      </div>
    );
  }

  return <ScoresList games={games} />;
}
```

**処理フロー:**
1. `fetchScores()` を呼び出してデータを取得
2. エラー時またはデータがnullの場合、エラーメッセージを表示
3. 試合データが空の場合、「試合なし」メッセージを表示
4. データがある場合、`ScoresList` コンポーネントに渡して表示

## ScoresLoadingコンポーネント

読み込み中に表示されるスケルトンスクリーンです。

```tsx
function ScoresLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-40 rounded-lg border bg-muted animate-pulse"
        />
      ))}
    </div>
  );
}
```

**特徴:**
- 6つのスケルトンカードを表示
- 実際のスコアカードと同じグリッドレイアウト
- `animate-pulse` クラスで点滅アニメーション
- レスポンシブ（モバイル: 1列、タブレット: 2列、デスクトップ: 3列）

## 使用コンポーネント

### WeekSelector

週を選択するためのUIコンポーネントです（Client Component）。

**ファイル:** `src/components/scores/WeekSelector.tsx`

**Props:**
```tsx
interface WeekSelectorProps {
  weeks: number[];
  currentWeek: number;
  season: number;
  seasonType: number;
  currentSeason: number;
  currentSeasonType: number;
}
```

**機能:**
- ドロップダウンメニューで週を選択
- シーズンタイプの切り替え（Preseason, Regular Season, Postseason）
- "Current Week" オプションで現在の週に戻る
- URLクエリパラメータを更新してページを再読み込み

### ScoresList

試合のリストを表示するコンポーネントです（Server Component）。

**ファイル:** `src/components/scores/ScoresList.tsx`

**Props:**
```tsx
interface ScoresListProps {
  games: Game[];
}
```

**機能:**
- `Game[]` を受け取り、各試合を `ScoreCard` で表示
- レスポンシブグリッドレイアウト

### ScoreCard

個別の試合を表示するカードコンポーネントです（Server Component）。

**ファイル:** `src/components/scores/ScoreCard.tsx`

**Props:**
```tsx
interface ScoreCardProps {
  game: Game;
}
```

**機能:**
- 試合の状態（LIVE、Final、予定）を表示
- スコアとクォーター別得点を表示
- チームロゴと名前を表示
- チーム名をクリックするとチーム詳細ページに遷移

## データフロー図

```
ユーザーがページアクセス
  ↓
HomePage コンポーネント実行
  ↓
fetchCurrentWeek() - 現在の週を取得
  ↓
searchParams から週、シーズンを決定
  ↓
ページヘッダーとWeekSelector を即座に表示
  ↓
Suspense 境界
  ↓
ScoresLoading を表示
  ↓
Scores コンポーネント実行
  ↓
fetchScores() - ESPN API呼び出し
  ↓
getScoresByWeek() - データ取得（60秒キャッシュ）
  ↓
Game[] 型に変換
  ↓
ScoresList → ScoreCard[] でレンダリング
  ↓
HTMLをクライアントに送信
  ↓
ScoresLoading が ScoresList に置き換わる
```

## パフォーマンス最適化

### 1. Server Component

ページ全体とScoresコンポーネントをServer Componentとして実装:
- JavaScriptバンドルサイズ削減
- 初期HTMLの即座配信

### 2. Suspense Streaming

Suspenseにより段階的にレンダリング:
- ページヘッダーが即座に表示
- データ読み込み中はスケルトンスクリーン
- データ取得完了後、コンテンツに置き換え

### 3. ISRキャッシング

`getScoresByWeek()` は60秒間キャッシュ:
- 同じ週のページに複数ユーザーがアクセスしてもAPIは1回のみ呼び出し
- 2回目以降のアクセスは高速化

### 4. Suspense key

```tsx
key={`${season}-${week}-${seasonType}`}
```
- 週が変わるたびにSuspenseを再マウント
- 確実にデータの再取得が行われる

## エラーハンドリング

### APIエラー

```tsx
try {
  const games = await getScoresByWeek(season, week, seasonType);
  return { games, error: false };
} catch {
  return { games: null, error: true };
}
```

**対応:**
- エラー発生時、ユーザーフレンドリーなメッセージを表示
- 再試行の案内を提供

### データなし

```tsx
if (games.length === 0) {
  return <div>No games found for this week.</div>;
}
```

**対応:**
- 空配列の場合、「試合なし」メッセージを表示
- エラーとは区別

## コード例

### 完全なページコンポーネント

```tsx
import { Suspense } from 'react';
import { ScoresList } from '@/components/scores/ScoresList';
import { WeekSelector } from '@/components/scores/WeekSelector';
import {
  getScoresByWeek,
  getCurrentSeason,
  getSeasonWeeks,
  getLiveScores,
  SeasonType,
} from '@/lib/api/espn';
import { Game } from '@/types/nfl';

// ... fetchScores, fetchCurrentWeek, Scores, ScoresLoading ...

export default async function HomePage({ searchParams }: HomePageProps) {
  // 実装は上記参照
}
```

## 関連ドキュメント

- [WeekSelector コンポーネント](../components/scores/week-selector.md)
- [ScoresList コンポーネント](../components/scores/scores-list.md)
- [ScoreCard コンポーネント](../components/scores/score-card.md)
- [ESPN API エンドポイント](../api/endpoints.md)

---

**最終更新**: 2026年2月
**対象ページ**: `/`
