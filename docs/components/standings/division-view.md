# DivisionView コンポーネント

## 概要

**ファイル:** `src/components/standings/DivisionView.tsx`
**タイプ:** Server Component
**役割:** 8つのディビジョン別の順位表を表示

DivisionViewコンポーネントは、NFLの8つのディビジョン（AFC East, AFC North, AFC South, AFC West, NFC East, NFC North, NFC South, NFC West）をグリッドレイアウトで表示します。各ディビジョンに4チームが含まれます。

---

## Props

```typescript
interface DivisionViewProps {
  standings: Record<string, Standing[]>;
}
```

### standings構造

```typescript
{
  "AFC East": [Standing, Standing, Standing, Standing],
  "AFC North": [Standing, Standing, Standing, Standing],
  "AFC South": [Standing, Standing, Standing, Standing],
  "AFC West": [Standing, Standing, Standing, Standing],
  "NFC East": [Standing, Standing, Standing, Standing],
  "NFC North": [Standing, Standing, Standing, Standing],
  "NFC South": [Standing, Standing, Standing, Standing],
  "NFC West": [Standing, Standing, Standing, Standing]
}
```

各ディビジョンには**常に4チーム**が含まれます。

---

## 実装の詳細

### 1. コンポーネント構造

```tsx
export function DivisionView({ standings }: DivisionViewProps) {
  const afcDivisions = Object.keys(standings)
    .filter((key) => key.startsWith('AFC'))
    .sort();
  const nfcDivisions = Object.keys(standings)
    .filter((key) => key.startsWith('NFC'))
    .sort();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          AFC Divisions
        </h3>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto">
          {afcDivisions.map((div) => (
            <DivisionCard key={div} divisionKey={div} teams={standings[div]} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" />
          NFC Divisions
        </h3>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto">
          {nfcDivisions.map((div) => (
            <DivisionCard key={div} divisionKey={div} teams={standings[div]} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

**データ処理:**
1. AFCディビジョンをフィルター（`startsWith('AFC')`）
2. NFCディビジョンをフィルター（`startsWith('NFC')`）
3. ソート（アルファベット順）

**ソート結果:**
```
AFC: ["AFC East", "AFC North", "AFC South", "AFC West"]
NFC: ["NFC East", "NFC North", "NFC South", "NFC West"]
```

---

### 2. DivisionCard（内部コンポーネント）

```tsx
function DivisionCard({
  divisionKey,
  teams,
}: {
  divisionKey: string;
  teams: Standing[];
}) {
  const isAFC = divisionKey.startsWith('AFC');
  return (
    <Card className="overflow-hidden border-t-4 border-t-primary">
      <CardHeader className="pb-2 bg-secondary/30">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${isAFC ? 'bg-accent' : 'bg-primary'}`}
          />
          {divisionKey}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {/* テーブル */}
      </CardContent>
    </Card>
  );
}
```

**特徴:**
- カードヘッダーにディビジョン名
- AFC: アクセントカラーのドット
- NFC: プライマリカラーのドット
- 上部に太い境界線（`border-t-4`）

---

### 3. テーブル構造

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead className="text-xs sm:text-sm">Team</TableHead>
      <TableHead className="text-center text-xs sm:text-sm">W</TableHead>
      <TableHead className="text-center text-xs sm:text-sm">L</TableHead>
      <TableHead className="text-center text-xs sm:text-sm hidden sm:table-cell">T</TableHead>
      <TableHead className="text-center text-xs sm:text-sm hidden md:table-cell">PCT</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {teams.map((team) => (
      <TableRow key={team.Team}>
        <TableCell className="text-xs sm:text-sm">
          <Link
            href={`/teams/${team.Team}`}
            className="font-medium hover:underline"
          >
            <span className="hidden sm:inline">{team.Name}</span>
            <span className="sm:hidden">{team.Team}</span>
          </Link>
        </TableCell>
        <TableCell className="text-center text-xs sm:text-sm">
          {team.Wins}
        </TableCell>
        <TableCell className="text-center text-xs sm:text-sm">
          {team.Losses}
        </TableCell>
        <TableCell className="text-center text-xs sm:text-sm hidden sm:table-cell">
          {team.Ties}
        </TableCell>
        <TableCell className="text-center text-xs sm:text-sm hidden md:table-cell">
          {team.Percentage.toFixed(3)}
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

**カラム:**
- **Team**: チーム名
- **W**: 勝利数
- **L**: 敗北数
- **T**: 引き分け数（モバイルで非表示）
- **PCT**: 勝率（タブレット以下で非表示）

**注意:**
- ランキング番号（#）なし
- 得失点差（DIFF）なし
- ディビジョン内では順位が自明なため簡略化

---

## レスポンシブデザイン

### グリッドレイアウト

```tsx
<div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto">
```

**レイアウト:**
- **モバイル（< 1024px）**: 1列（縦に4つのディビジョン）
- **デスクトップ（≥ 1024px）**: 2列（横に2つ、縦に2つ）

**ギャップ:**
- モバイル: 12px（`gap-3`）
- デスクトップ: 16px（`sm:gap-4`）

---

### テーブルカラム

#### モバイル（< 640px）

**表示カラム:**
- Team（略称）
- W
- L

**非表示カラム:**
- T
- PCT

#### タブレット（640px - 767px）

**表示カラム:**
- Team（フル名）
- W
- L
- T

**非表示カラム:**
- PCT

#### デスクトップ（≥ 768px）

**表示カラム:**
- すべて（Team, W, L, T, PCT）

---

## ディビジョン識別

### カードヘッダー

```tsx
<CardTitle className="text-base sm:text-lg flex items-center gap-2">
  <span
    className={`w-2 h-2 rounded-full ${isAFC ? 'bg-accent' : 'bg-primary'}`}
  />
  {divisionKey}
</CardTitle>
```

**AFC:**
- アクセントカラーのドット
- 例: "AFC East"

**NFC:**
- プライマリカラーのドット
- 例: "NFC East"

---

## ディビジョンの重要性

### ディビジョン優勝チーム

各ディビジョンの1位チームは自動的にプレーオフ進出（シード1-4）します。

**例（AFC East）:**
```
1. Buffalo Bills (13-4, .765) - Division Winner
2. Miami Dolphins (11-6, .647)
3. New York Jets (7-10, .412)
4. New England Patriots (4-13, .235)
```

### ライバル関係

ディビジョン内のチームは年に2回ずつ対戦します（直接対決）。

**例:**
- Buffalo Bills vs Miami Dolphins（年2回）
- New England Patriots vs New York Jets（年2回）

---

## OverallTableとConferenceViewとの違い

### OverallTable

- 全32チームを1つのテーブルに表示
- リーグ全体の順位

### ConferenceView

- 2つのテーブル（AFC, NFC）
- 各カンファレンス内での順位

### DivisionView

- 8つの小さなテーブル（ディビジョンごと）
- ディビジョン内での順位
- 最も詳細な表示

---

## コード例

### 基本的な使用方法

```tsx
import { DivisionView } from '@/components/standings/DivisionView';

export default async function StandingsPage() {
  const standings = await fetchStandings();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Division Standings</h1>
      <DivisionView standings={standings} />
    </div>
  );
}
```

---

## スタイリング

### カードの境界線

```tsx
<Card className="overflow-hidden border-t-4 border-t-primary">
```

- `border-t-4`: 上部に太い境界線（4px）
- `border-t-primary`: プライマリカラーの境界線
- すべてのディビジョンカードに統一感

### カードヘッダーの背景

```tsx
<CardHeader className="pb-2 bg-secondary/30">
```

- `bg-secondary/30`: 半透明のセカンダリカラー
- 視覚的な区別を提供

---

## 使用しているコンポーネント

### shadcn/ui

- **Card**: カードコンテナ
- **CardHeader**: カードヘッダー
- **CardTitle**: カードタイトル
- **CardContent**: カードの内容
- **Table**: テーブル要素
- **TableHeader**: テーブルヘッダー
- **TableBody**: テーブルボディ
- **TableRow**: テーブル行
- **TableHead**: ヘッダーセル
- **TableCell**: データセル

### Next.js

- **Link**: Team Detailページへのリンク

---

## パフォーマンス

### Server Component

- サーバーサイドレンダリング
- JavaScriptバンドルに含まれない
- 高速な初回表示

### 8つの小さなテーブル

- 各テーブル4行（計32行）
- 軽量で高速なレンダリング

---

**最終更新**: 2026年2月
