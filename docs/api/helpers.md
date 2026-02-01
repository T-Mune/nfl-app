# ヘルパー関数

このドキュメントでは、ESPN API統合で使用されるヘルパー関数の詳細を説明します。

**ファイル:** `src/lib/api/espn.ts`

## シーズンユーティリティ

### getCurrentSeason()

現在のNFLシーズン年を取得します。

```typescript
export function getCurrentSeason(): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 0-11 → 1-12

  // NFLシーズンは9月開始、2月終了
  // 1～2月は前年のシーズン
  return month >= 3 ? year : year - 1;
}
```

**ロジック:**
- 3月～12月: 現在の年がシーズン年
- 1月～2月: 前年がシーズン年（Super Bowl期間）

**使用例:**
```typescript
const season = getCurrentSeason(); // 2026年2月 → 2025
```

---

### getSeasonWeeks()

シーズンタイプごとの週数を取得します。

```typescript
export function getSeasonWeeks(seasonType: number): number[] {
  switch (seasonType) {
    case SeasonType.PRESEASON:
      return Array.from({ length: 4 }, (_, i) => i + 1); // [1,2,3,4]
    case SeasonType.REGULAR:
      return Array.from({ length: 18 }, (_, i) => i + 1); // [1,2,...,18]
    case SeasonType.POSTSEASON:
      return Array.from({ length: 5 }, (_, i) => i + 1); // [1,2,3,4,5]
    default:
      return [];
  }
}
```

**SeasonType定数:**
```typescript
export enum SeasonType {
  PRESEASON = 1,
  REGULAR = 2,
  POSTSEASON = 3,
}
```

**使用例:**
```typescript
const weeks = getSeasonWeeks(SeasonType.REGULAR); // [1,2,3,...,18]
```

---

## 日時フォーマット

### formatGameDate()

試合日時を人間が読みやすい形式にフォーマットします。

```typescript
export function formatGameDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'M/d h:mm a'); // 例: "2/1 1:00 PM"
}
```

**使用ライブラリ:** `date-fns`

**使用例:**
```typescript
const formatted = formatGameDate('2026-02-01T13:00:00Z');
// → "2/1 1:00 PM"
```

---

### formatNewsDate()

ニュース記事の公開日時を相対時刻でフォーマットします。

```typescript
export function formatNewsDate(dateString: string): string {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
}
```

**使用ライブラリ:** `date-fns`

**使用例:**
```typescript
const formatted = formatNewsDate('2026-02-01T10:00:00Z');
// → "2 hours ago"
```

**出力パターン:**
- 1時間以内: "X minutes ago"
- 24時間以内: "X hours ago"
- 1週間以内: "X days ago"
- それ以上: 実際の日付

---

## 試合状態ヘルパー

### getGameStatus()

試合の状態文字列を取得します。

```typescript
export function getGameStatus(game: Game): string {
  if (game.isLive) {
    return game.quarter && game.clock
      ? `${game.quarter} ${game.clock}`
      : 'LIVE';
  }
  if (game.isFinal) {
    return 'Final';
  }
  return formatGameDate(game.date);
}
```

**使用例:**
```typescript
const status = getGameStatus(game);
// 試合中: "Q3 5:32" または "LIVE"
// 終了: "Final"
// 予定: "2/1 1:00 PM"
```

---

## グループ化ヘルパー

### groupStandingsByDivision()

順位データをディビジョン別にグループ化します。

```typescript
export function groupStandingsByDivision(
  standings: Standing[]
): Record<string, Standing[]> {
  const grouped: Record<string, Standing[]> = {};

  for (const standing of standings) {
    const team = NFL_DIVISIONS[standing.abbreviation];
    if (!team) continue;

    const key = `${team.conference} ${team.division}`;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(standing);
  }

  // 各グループ内を勝率順にソート
  for (const key in grouped) {
    grouped[key].sort((a, b) => b.winPercentage - a.winPercentage);
  }

  return grouped;
}
```

**返り値:**
```typescript
{
  "AFC East": [Standing, Standing, Standing, Standing],
  "AFC North": [Standing, Standing, Standing, Standing],
  // ...
}
```

**使用例:**
```typescript
const standings = await getStandings(2025);
const grouped = groupStandingsByDivision(standings);
```

---

## NFLディビジョン定義

**ファイル:** `src/lib/nfl-divisions.ts`

```typescript
export const NFL_DIVISIONS: Record<string, { conference: string; division: string }> = {
  'KC': { conference: 'AFC', division: 'West' },
  'SF': { conference: 'NFC', division: 'West' },
  'NE': { conference: 'AFC', division: 'East' },
  // ... 全32チーム
};
```

**使用例:**
```typescript
const divInfo = NFL_DIVISIONS['KC'];
// { conference: 'AFC', division: 'West' }
```

---

## ユーティリティ関数まとめ

| 関数 | 用途 | 返り値 |
|------|------|--------|
| `getCurrentSeason()` | 現在のシーズン年 | `number` |
| `getSeasonWeeks()` | シーズンタイプごとの週数配列 | `number[]` |
| `formatGameDate()` | 試合日時をフォーマット | `string` |
| `formatNewsDate()` | ニュース日時を相対時刻に | `string` |
| `getGameStatus()` | 試合状態を文字列に | `string` |
| `groupStandingsByDivision()` | 順位をディビジョン別に | `Record<string, Standing[]>` |

---

**最終更新**: 2026年2月
