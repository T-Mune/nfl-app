# ScoresList コンポーネント

## 概要

**ファイル:** `src/components/scores/ScoresList.tsx`
**タイプ:** Server Component
**役割:** 試合のリストを表示

ScoresListコンポーネントは、複数の試合をグリッドレイアウトで表示します。試合を進行状況と日時でソートし、最も重要な試合（進行中の試合）を優先的に表示します。

---

## Props

```typescript
interface ScoresListProps {
  games: Game[];
}
```

### Propsの詳細

- **games**: 表示する試合の配列（`Game[]`型）

---

## 実装の詳細

### 1. 空の状態処理

```typescript
if (games.length === 0) {
  return (
    <div className="text-center py-8 text-muted-foreground">
      No games scheduled for this week.
    </div>
  );
}
```

試合が1つもない場合、メッセージを表示します。

**使用ケース:**
- シーズンオフの週
- プレシーズン未開始
- データ取得エラー

---

### 2. 試合のソート

```typescript
const sortedGames = [...games].sort((a, b) => {
  // 進行中の試合を最優先
  if (a.IsInProgress && !b.IsInProgress) return -1;
  if (!a.IsInProgress && b.IsInProgress) return 1;

  // それ以外は日時順
  return new Date(a.Date).getTime() - new Date(b.Date).getTime();
});
```

**ソート順:**
1. **進行中の試合（Live）**: 最優先で表示
2. **その他の試合**: 日時の早い順

**理由:**
- ユーザーは進行中の試合を最も見たい
- ライブスコアがページの上部に表示される

**例:**
```
[Live] KC vs BUF (進行中)
[Live] SF vs DAL (進行中)
[Scheduled] LAR vs SEA (13:00)
[Scheduled] NE vs MIA (16:00)
[Final] PHI vs NYG (終了)
```

---

### 3. グリッドレイアウト

```tsx
<div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {sortedGames.map((game) => (
    <ScoreCard key={game.GameKey} game={game} />
  ))}
</div>
```

**レイアウト:**
- **モバイル（< 768px）**: 1列（`grid-cols-1`）
- **タブレット（≥ 768px）**: 2列（`md:grid-cols-2`）
- **デスクトップ（≥ 1024px）**: 3列（`lg:grid-cols-3`）

**ギャップ:**
- モバイル: 12px（`gap-3`）
- デスクトップ: 16px（`sm:gap-4`）

---

## ソートロジックの詳細

### なぜ進行中の試合を優先するか

```typescript
if (a.IsInProgress && !b.IsInProgress) return -1; // aを前に
if (!a.IsInProgress && b.IsInProgress) return 1;  // bを前に
```

**ユーザーエクスペリエンス:**
- リアルタイムで変化する試合を見逃さない
- スクロールせずにライブスコアが見える
- 重要な情報を最初に提示

### 日時順ソート

```typescript
return new Date(a.Date).getTime() - new Date(b.Date).getTime();
```

**日時の比較:**
- `getTime()`: UnixタイムスタンプでDate型を比較
- 早い試合が先に表示される

---

## レスポンシブデザイン

### モバイル（< 768px）

- 1列レイアウト
- カードが縦に並ぶ
- 各カードが画面幅いっぱいに表示

### タブレット（768px - 1023px）

- 2列レイアウト
- 横に2つのカードが並ぶ
- より多くの試合を一度に表示

### デスクトップ（≥ 1024px）

- 3列レイアウト
- 横に3つのカードが並ぶ
- 最大情報密度

---

## コード例

### 基本的な使用方法

```tsx
import { ScoresList } from '@/components/scores/ScoresList';

export default async function LiveScoresPage() {
  const games = await fetchGames();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Live Scores</h1>
      <ScoresList games={games} />
    </div>
  );
}
```

### Suspenseと組み合わせた使用

```tsx
import { Suspense } from 'react';
import { ScoresList } from '@/components/scores/ScoresList';

async function ScoresData({ week }: { week: number }) {
  const games = await fetchGames(week);
  return <ScoresList games={games} />;
}

export default function LiveScoresPage({ week }: { week: number }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Live Scores - Week {week}</h1>
      <Suspense fallback={<LoadingSpinner />}>
        <ScoresData week={week} />
      </Suspense>
    </div>
  );
}
```

---

## パフォーマンス

### Server Component

- **サーバーサイドレンダリング**: データフェッチングがサーバーで完結
- **JavaScriptバンドル削減**: クライアントに送信されるJSが少ない
- **高速な初回表示**: サーバーでHTMLを生成

### ソートの最適化

```typescript
const sortedGames = [...games].sort((a, b) => {
  // 早期リターンで比較回数を最小化
  if (a.IsInProgress && !b.IsInProgress) return -1;
  if (!a.IsInProgress && b.IsInProgress) return 1;
  return new Date(a.Date).getTime() - new Date(b.Date).getTime();
});
```

**時間計算量:** O(n log n)（標準的なソートアルゴリズム）

---

## 使用しているコンポーネント

- **ScoreCard**: 個別の試合カード（`./ScoreCard`）

---

## 拡張例

### フィルタリング機能の追加

```tsx
interface ScoresListProps {
  games: Game[];
  filter?: 'all' | 'live' | 'final' | 'scheduled';
}

export function ScoresList({ games, filter = 'all' }: ScoresListProps) {
  // フィルタリング
  const filteredGames = games.filter((game) => {
    if (filter === 'live') return game.IsInProgress;
    if (filter === 'final') return game.IsOver || game.Closed;
    if (filter === 'scheduled') return !game.IsInProgress && !game.IsOver;
    return true; // 'all'
  });

  if (filteredGames.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No games match the filter.
      </div>
    );
  }

  const sortedGames = [...filteredGames].sort((a, b) => {
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
```

---

**最終更新**: 2026年2月
