# ScoreCard コンポーネント

## 概要

**ファイル:** `src/components/scores/ScoreCard.tsx`
**タイプ:** Server Component
**役割:** 個別の試合情報を表示するカード

ScoreCardコンポーネントは、1つのNFL試合の詳細情報を表示するカードです。試合のステータス（Live/Final/Scheduled）に応じて異なるビジュアルスタイルを適用します。

---

## Props

```typescript
interface ScoreCardProps {
  game: Game;
}
```

### Game型

```typescript
interface Game {
  GameKey: string;
  Season: number;
  Week: number;
  Date: string;
  AwayTeam: string;
  HomeTeam: string;
  AwayTeamName?: string;
  HomeTeamName?: string;
  AwayTeamLogo?: string;
  HomeTeamLogo?: string;
  AwayScore: number | null;
  HomeScore: number | null;
  Channel?: string;
  IsInProgress: boolean;
  IsOver: boolean;
  Closed: boolean;
  // クォーター別スコア
  AwayScoreQuarter1?: number | null;
  AwayScoreQuarter2?: number | null;
  AwayScoreQuarter3?: number | null;
  AwayScoreQuarter4?: number | null;
  AwayScoreOvertime?: number | null;
  HomeScoreQuarter1?: number | null;
  HomeScoreQuarter2?: number | null;
  HomeScoreQuarter3?: number | null;
  HomeScoreQuarter4?: number | null;
  HomeScoreOvertime?: number | null;
  // ライブ試合の詳細
  DownAndDistance?: string;
  Possession?: string;
  RedZone?: boolean;
}
```

---

## ビジュアル状態

### 1. Live（進行中の試合）

**特徴:**
- 境界線が太い（`border-2`）
- アクセントカラーの境界線（`border-accent`）
- 影が強い（`shadow-lg`）
- "LIVE"バッジがアニメーション（`animate-pulse`）

**条件:**
```typescript
const isLive = game.IsInProgress;
```

**表示内容:**
- ダウンとディスタンス情報（例: "2nd & 7"）
- ボールポゼッション（どちらのチームがボールを持っているか）
- レッドゾーンバッジ（ゴール前20ヤード以内）

### 2. Final（終了した試合）

**特徴:**
- 上部に太い境界線（`border-t-4 border-t-primary`）
- クォーター別スコア表を表示
- 勝利チームのスコアを強調（太字）

**条件:**
```typescript
const isFinal = game.IsOver || game.Closed;
```

**表示内容:**
- クォーター別スコア（Q1, Q2, Q3, Q4）
- オーバータイムスコア（ある場合）
- 勝利チームのスコアを太字で表示

### 3. Scheduled（予定されている試合）

**特徴:**
- 標準の境界線
- 日時情報を表示
- スコアは"−"で表示

---

## 実装の詳細

### 1. ヘッダー（ステータスとチャンネル）

```tsx
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
```

**特徴:**
- ライブ試合は"LIVE"バッジで強調
- チャンネル情報を表示（例: "CBS", "FOX"）

### 2. チーム表示（アウェイチーム）

```tsx
<div className="flex justify-between items-center gap-2">
  <Link
    href={`/teams/${game.AwayTeam}`}
    className="flex items-center gap-2 font-medium hover:text-accent transition-colors min-w-0 flex-1"
  >
    {game.AwayTeamLogo && (
      <img src={game.AwayTeamLogo} alt={game.AwayTeam} className="w-6 h-6 flex-shrink-0 object-contain" />
    )}
    <span className="truncate text-sm sm:text-base">{game.AwayTeamName || game.AwayTeam}</span>
  </Link>
  <span className={`text-xl sm:text-2xl font-bold tabular-nums flex-shrink-0 ${isFinal && game.AwayScore !== null && game.HomeScore !== null && game.AwayScore > game.HomeScore ? 'text-primary' : ''}`}>
    {game.AwayScore ?? '-'}
  </span>
</div>
```

**特徴:**
- チームロゴを表示
- チーム名をクリックするとTeam Detailページに遷移
- 勝利チームのスコアを強調表示

### 3. チーム表示（ホームチーム）

同様の構造でホームチームを表示します。

### 4. ライブ試合の詳細情報

```tsx
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
```

**表示内容:**
- ボールポゼッション（例: "KC ball - 2nd & 7"）
- レッドゾーンバッジ

### 5. クォーター別スコア（終了試合）

```tsx
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
```

**特徴:**
- 6列グリッド（チーム名 + Q1-Q4 + OT）
- オーバータイムがある場合のみOT列を表示
- nullの場合は"−"で表示

---

## スタイリングロジック

### 動的境界線

```typescript
className={`overflow-hidden ${isLive ? 'border-accent border-2 shadow-lg' : 'border-t-4 border-t-primary'}`}
```

- **Live**: 太い境界線 + アクセントカラー + 影
- **その他**: 上部のみ太い境界線

### 勝利チームの強調

```typescript
className={`text-xl sm:text-2xl font-bold tabular-nums flex-shrink-0 ${isFinal && game.AwayScore !== null && game.HomeScore !== null && game.AwayScore > game.HomeScore ? 'text-primary' : ''}`}
```

終了試合で勝利チームのスコアをプライマリカラーで表示します。

---

## 使用しているコンポーネント

### shadcn/ui

- **Card**: カードコンテナ
- **CardContent**: カードの内容
- **Badge**: ステータスバッジ

### Next.js

- **Link**: チーム詳細ページへのリンク

### ヘルパー関数

- **getGameStatus**: 試合のステータステキストを取得（`@/lib/api/espn`）

---

## コード例

### 基本的な使用方法

```tsx
import { ScoreCard } from '@/components/scores/ScoreCard';

export function ScoresPage({ games }: { games: Game[] }) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {games.map((game) => (
        <ScoreCard key={game.GameKey} game={game} />
      ))}
    </div>
  );
}
```

---

## レスポンシブ対応

- **モバイル**: スコアとテキストサイズが小さくなる（`text-sm`）
- **デスクトップ**: より大きなスコア表示（`sm:text-2xl`）

---

**最終更新**: 2026年2月
