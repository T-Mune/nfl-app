# Standings ページ実装

## 基本情報

| 項目 | 値 |
|------|-----|
| **ファイル** | `src/app/standings/page.tsx` |
| **ルート** | `/standings` |
| **コンポーネントタイプ** | Server Component |
| **データソース** | ESPN Standings API |

## 概要

Standingsページは、NFL全チームの順位表を表示します。データはディビジョン別にグループ化され、3つの表示モード（全体、カンファレンス別、ディビジョン別）で表示できます。

## コンポーネント構造

```tsx
StandingsPage (Server Component)
├── PageHeader (静的)
└── Suspense
    └── StandingsContent (Server Component)
        ├── fetchStandingsData()
        ├── SeasonInfo Badge
        └── StandingsSelector (Client Component)
            ├── OverallTable
            ├── ConferenceView
            └── DivisionView
```

## データフェッチング

### fetchStandingsData()

```tsx
async function fetchStandingsData(): Promise<FetchResult> {
  const season = getCurrentSeason();

  try {
    const standings = await getStandings(season);
    const grouped = groupStandingsByDivision(standings);
    return { standings: grouped, error: false, season };
  } catch {
    return { standings: null, error: true, season };
  }
}
```

**使用API:**
- `getStandings()`: `src/lib/api/espn.ts`
- `groupStandingsByDivision()`: ディビジョン別にグループ化するヘルパー関数

**返り値:**
```tsx
interface FetchResult {
  standings: Record<string, Standing[]> | null;
  error: boolean;
  season: number;
}
```

**データ構造:**
```typescript
{
  "AFC East": [Standing, Standing, Standing, Standing],
  "AFC North": [Standing, Standing, Standing, Standing],
  "AFC South": [Standing, Standing, Standing, Standing],
  "AFC West": [Standing, Standing, Standing, Standing],
  "NFC East": [Standing, Standing, Standing, Standing],
  // ...
}
```

## ページコンポーネント

### StandingsPage

```tsx
export default function StandingsPage() {
  return (
    <div>
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="w-1 sm:w-1.5 h-6 sm:h-8 bg-accent rounded-full" />
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Standings</h1>
      </div>
      <Suspense fallback={<StandingsLoading />}>
        <StandingsContent />
      </Suspense>
    </div>
  );
}
```

### StandingsContent

```tsx
async function StandingsContent() {
  const { standings, error, season } = await fetchStandingsData();

  if (error || !standings) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load standings.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please check your API configuration.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 text-xs sm:text-sm text-muted-foreground bg-secondary/50 px-3 sm:px-4 py-2 rounded-md inline-block">
        {season} Season Standings
      </div>
      <StandingsSelector standings={standings} season={season} />
    </div>
  );
}
```

### StandingsLoading

```tsx
function StandingsLoading() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
      ))}
    </div>
  );
}
```

## 使用コンポーネント

### StandingsSelector

**ファイル:** `src/components/standings/StandingsSelector.tsx`（Client Component）

**Props:**
```tsx
interface StandingsSelectorProps {
  standings: Record<string, Standing[]>;
  season: number;
}
```

**機能:**
- 3つの表示モードタブ（Overall、By Conference、By Division）
- クライアントサイドの状態管理（useState）
- 選択されたモードに応じて異なるコンポーネントを表示

### OverallTable

**ファイル:** `src/components/standings/OverallTable.tsx`

**機能:**
- 全32チームを1つの大きなテーブルで表示
- 勝率順にソート

### ConferenceView

**ファイル:** `src/components/standings/ConferenceView.tsx`

**機能:**
- AFCとNFCの2つのテーブルに分けて表示
- 各カンファレンス内で勝率順にソート

### DivisionView

**ファイル:** `src/components/standings/DivisionView.tsx`

**機能:**
- 8つのディビジョンカードで表示
- 各ディビジョン内で勝率順にソート

## データフロー

```
ユーザーがページアクセス
  ↓
StandingsPage コンポーネント実行
  ↓
ページヘッダー即座に表示
  ↓
Suspense 境界
  ↓
StandingsLoading を表示
  ↓
StandingsContent コンポーネント実行
  ↓
fetchStandingsData()
  ↓
getStandings() - ESPN API呼び出し（60秒キャッシュ）
  ↓
groupStandingsByDivision() - ディビジョン別にグループ化
  ↓
StandingsSelector にデータを渡す
  ↓
HTMLをクライアントに送信
  ↓
ユーザーが表示モードタブをクリック
  ↓
クライアントサイドで対応するビューコンポーネントを表示
```

---

**最終更新**: 2026年2月
**対象ページ**: `/standings`
