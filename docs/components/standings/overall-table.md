# OverallTable コンポーネント

## 概要

**ファイル:** `src/components/standings/OverallTable.tsx`
**タイプ:** Server Component
**役割:** 全32チームの順位表を表示

OverallTableコンポーネントは、NFL全32チームを1つのテーブルに表示します。勝率順にソートされ、各チームの成績統計を提供します。

---

## Props

```typescript
interface OverallTableProps {
  teams: Standing[];  // ソート済みのチーム配列
  season: number;     // シーズン（例: 2025）
}
```

### Standing型

```typescript
interface Standing {
  Team: string;          // チーム略称（例: "KC"）
  Name: string;          // チーム名（例: "Kansas City Chiefs"）
  Conference: string;    // カンファレンス（"AFC" or "NFC"）
  Division: string;      // ディビジョン（例: "West"）
  Wins: number;          // 勝利数
  Losses: number;        // 敗北数
  Ties: number;          // 引き分け数
  Percentage: number;    // 勝率（0.0 - 1.0）
  PointsFor: number;     // 総得点
  PointsAgainst: number; // 総失点
  NetPoints: number;     // 得失点差
}
```

---

## 実装の詳細

### 1. ヘッダー

```tsx
<div className="mb-4 text-xs sm:text-sm text-muted-foreground bg-secondary/50 px-3 sm:px-4 py-2 rounded-md inline-block">
  {season} Season - Overall Standings (All 32 Teams)
</div>
```

シーズンとチーム数を表示します。

---

### 2. テーブル構造

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[50px] text-xs sm:text-sm">#</TableHead>
      <TableHead className="text-xs sm:text-sm">Team</TableHead>
      <TableHead className="text-center text-xs sm:text-sm">W</TableHead>
      <TableHead className="text-center text-xs sm:text-sm">L</TableHead>
      <TableHead className="text-center text-xs sm:text-sm hidden sm:table-cell">T</TableHead>
      <TableHead className="text-center text-xs sm:text-sm hidden md:table-cell">PCT</TableHead>
      <TableHead className="text-center text-xs sm:text-sm hidden lg:table-cell">PF</TableHead>
      <TableHead className="text-center text-xs sm:text-sm hidden lg:table-cell">PA</TableHead>
      <TableHead className="text-center text-xs sm:text-sm hidden md:table-cell">DIFF</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {/* テーブル行 */}
  </TableBody>
</Table>
```

**カラム:**
- **#**: ランキング順位（1-32）
- **Team**: チーム名
- **W**: 勝利数（Wins）
- **L**: 敗北数（Losses）
- **T**: 引き分け数（Ties） - モバイルで非表示
- **PCT**: 勝率（Percentage） - タブレット以下で非表示
- **PF**: 総得点（Points For） - デスクトップのみ
- **PA**: 総失点（Points Against） - デスクトップのみ
- **DIFF**: 得失点差（Net Points） - タブレット以上

---

### 3. テーブル行の実装

```tsx
{teams.map((team, index) => (
  <TableRow key={team.Team}>
    <TableCell className="text-muted-foreground text-xs sm:text-sm font-medium">
      {index + 1}
    </TableCell>
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
    <TableCell className="text-center text-xs sm:text-sm hidden lg:table-cell">
      {team.PointsFor}
    </TableCell>
    <TableCell className="text-center text-xs sm:text-sm hidden lg:table-cell">
      {team.PointsAgainst}
    </TableCell>
    <TableCell
      className={`text-center text-xs sm:text-sm hidden md:table-cell ${
        team.NetPoints > 0
          ? 'text-green-600'
          : team.NetPoints < 0
            ? 'text-red-600'
            : ''
      }`}
    >
      {team.NetPoints > 0 ? '+' : ''}
      {team.NetPoints}
    </TableCell>
  </TableRow>
))}
```

---

## レスポンシブ対応

### モバイル（< 640px）

**表示カラム:**
- #
- Team（略称のみ、例: "KC"）
- W
- L

**非表示カラム:**
- T（引き分け数）
- PCT（勝率）
- PF（総得点）
- PA（総失点）
- DIFF（得失点差）

---

### タブレット（640px - 1023px）

**表示カラム:**
- #
- Team（フル名、例: "Kansas City Chiefs"）
- W
- L
- T
- DIFF

**非表示カラム:**
- PCT
- PF
- PA

---

### デスクトップ（≥ 1024px）

**表示カラム:**
- すべて（#, Team, W, L, T, PCT, PF, PA, DIFF）

---

## 特殊なスタイリング

### 1. ランキング番号

```tsx
<TableCell className="text-muted-foreground text-xs sm:text-sm font-medium">
  {index + 1}
</TableCell>
```

- `text-muted-foreground`: グレー表示（控えめ）
- `font-medium`: やや太字

---

### 2. チーム名リンク

```tsx
<Link
  href={`/teams/${team.Team}`}
  className="font-medium hover:underline"
>
  <span className="hidden sm:inline">{team.Name}</span>
  <span className="sm:hidden">{team.Team}</span>
</Link>
```

**レスポンシブテキスト:**
- モバイル: 略称（"KC"）
- デスクトップ: フル名（"Kansas City Chiefs"）

**インタラクション:**
- クリックするとTeam Detailページに遷移
- ホバー時に下線を表示

---

### 3. 勝率のフォーマット

```tsx
{team.Percentage.toFixed(3)}
```

**例:**
- `0.824` → "0.824"
- `0.706` → "0.706"

小数点以下3桁で表示（NFL標準）

---

### 4. 得失点差の色分け

```tsx
className={`text-center text-xs sm:text-sm hidden md:table-cell ${
  team.NetPoints > 0
    ? 'text-green-600'
    : team.NetPoints < 0
      ? 'text-red-600'
      : ''
}`}
```

**色:**
- **正の値**: 緑（`text-green-600`）
- **負の値**: 赤（`text-red-600`）
- **ゼロ**: デフォルト

**符号の表示:**
```tsx
{team.NetPoints > 0 ? '+' : ''}
{team.NetPoints}
```

- 正の値: "+123"
- 負の値: "-45"
- ゼロ: "0"

---

## コード例

### 基本的な使用方法

```tsx
import { OverallTable } from '@/components/standings/OverallTable';

export default async function StandingsPage() {
  const standings = await fetchStandings();
  const season = 2025;

  // 全チームを取得してソート
  const allTeams = Object.values(standings).flat();
  const sortedTeams = allTeams.sort((a, b) => {
    if (b.Percentage !== a.Percentage) return b.Percentage - a.Percentage;
    if (b.Wins !== a.Wins) return b.Wins - a.Wins;
    return b.NetPoints - a.NetPoints;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Overall Standings</h1>
      <OverallTable teams={sortedTeams} season={season} />
    </div>
  );
}
```

---

## テーブルのスクロール

```tsx
<div className="overflow-x-auto">
  <Table>
    {/* テーブル内容 */}
  </Table>
</div>
```

**動作:**
- モバイルで横スクロール可能
- カラムが画面に収まらない場合に有効
- ユーザーは左右にスワイプして全カラムを表示できる

---

## パフォーマンス

### Server Component

- サーバーサイドレンダリング
- JavaScriptバンドルに含まれない
- 高速な初回表示

### 32行のレンダリング

- NFLは常に32チーム
- テーブル行数が固定
- パフォーマンスへの影響は最小限

---

## 使用しているコンポーネント

### shadcn/ui

- **Card**: カードコンテナ
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

## アクセシビリティ

### セマンティックHTML

- `<table>`要素を使用
- `<thead>`, `<tbody>`で構造化
- 適切な`<th>`, `<td>`

### テキストサイズ

- `text-xs sm:text-sm`: 小さすぎず大きすぎず
- モバイルで読みやすいサイズ

---

**最終更新**: 2026年2月
