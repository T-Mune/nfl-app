# ConferenceView コンポーネント

## 概要

**ファイル:** `src/components/standings/ConferenceView.tsx`
**タイプ:** Server Component
**役割:** AFC/NFCカンファレンス別の順位表を表示

ConferenceViewコンポーネントは、AFC（16チーム）とNFC（16チーム）の順位表を2つの独立したテーブルで表示します。各カンファレンス内で勝率順にソートされています。

---

## Props

```typescript
interface ConferenceViewProps {
  afcTeams: Standing[];  // AFCチーム（16チーム）
  nfcTeams: Standing[];  // NFCチーム（16チーム）
}
```

**注意:** Propsで渡されるチームは既にフィルターとソート済みです（`StandingsSelector`で処理）

---

## 実装の詳細

### 1. コンポーネント構造

```tsx
export function ConferenceView({ afcTeams, nfcTeams }: ConferenceViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          AFC Conference
        </h3>
        <ConferenceTable teams={afcTeams} conference="AFC" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" />
          NFC Conference
        </h3>
        <ConferenceTable teams={nfcTeams} conference="NFC" />
      </div>
    </div>
  );
}
```

**レイアウト:**
- `space-y-6`: 2つのテーブル間に24pxの縦方向スペース
- 各カンファレンスに見出しとテーブル
- AFC: アクセントカラーのドット
- NFC: プライマリカラーのドット

---

### 2. ConferenceTable（内部コンポーネント）

```tsx
function ConferenceTable({
  teams,
  conference,
}: {
  teams: Standing[];
  conference: string;
}) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-4 text-xs sm:text-sm text-muted-foreground bg-secondary/50 px-3 sm:px-4 py-2 rounded-md inline-block">
        {conference} Conference - {teams.length} Teams
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              {/* テーブル内容 */}
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

**特徴:**
- 再利用可能な内部コンポーネント
- AFCとNFCで共通のテーブルレイアウト
- カンファレンス名とチーム数を表示

---

### 3. テーブルヘッダー

```tsx
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
```

**カラム:** OverallTableと同じ構成

---

### 4. テーブル行

```tsx
<TableBody>
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
      {/* 他のセル */}
    </TableRow>
  ))}
</TableBody>
```

**ランキング番号:**
- `index + 1`: カンファレンス内での順位（1-16）

---

## レスポンシブ対応

OverallTableと同じレスポンシブルールを適用します:

### モバイル（< 640px）

**表示カラム:**
- #
- Team（略称）
- W
- L

### タブレット（640px - 1023px）

**表示カラム:**
- #
- Team（フル名）
- W
- L
- T
- DIFF

### デスクトップ（≥ 1024px）

**表示カラム:**
- すべて（#, Team, W, L, T, PCT, PF, PA, DIFF）

---

## カンファレンス識別

### 視覚的識別

```tsx
<h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
  <span className="w-2 h-2 rounded-full bg-accent" />
  AFC Conference
</h3>
```

**AFC:**
- アクセントカラーのドット（`bg-accent`）
- 通常は青系の色

**NFC:**
- プライマリカラーのドット（`bg-primary`）
- 通常は赤系の色

---

## プレーオフとの関連

### プレーオフシード

NFLプレーオフでは各カンファレンスから7チームが進出します:
- **シード1-4**: ディビジョン優勝チーム
- **シード5-7**: ワイルドカード（勝率順）

ConferenceViewは、プレーオフ進出チームを判断するのに最適なビューです。

**例（AFC）:**
```
1. Kansas City Chiefs (14-3) - Div Winner, Seed 1
2. Buffalo Bills (13-4) - Div Winner, Seed 2
3. Baltimore Ravens (12-5) - Div Winner, Seed 3
4. Houston Texans (10-7) - Div Winner, Seed 4
5. Los Angeles Chargers (11-6) - Wild Card, Seed 5
6. Pittsburgh Steelers (10-7) - Wild Card, Seed 6
7. Denver Broncos (10-7) - Wild Card, Seed 7
8. Cincinnati Bengals (9-8) - Out
...
```

---

## OverallTableとの違い

### OverallTable

- 全32チームを1つのテーブルに表示
- リーグ全体の順位

### ConferenceView

- 2つのテーブル（AFC, NFC）
- 各カンファレンス内での順位
- プレーオフシード順位を確認しやすい

---

## コード例

### 基本的な使用方法

```tsx
import { ConferenceView } from '@/components/standings/ConferenceView';

export default async function StandingsPage() {
  const standings = await fetchStandings();

  // AFCチームをフィルターしてソート
  const afcTeams = Object.values(standings)
    .flat()
    .filter((team) => team.Conference === 'AFC')
    .sort((a, b) => {
      if (b.Percentage !== a.Percentage) return b.Percentage - a.Percentage;
      if (b.Wins !== a.Wins) return b.Wins - a.Wins;
      return b.NetPoints - a.NetPoints;
    });

  // NFCチームをフィルターしてソート
  const nfcTeams = Object.values(standings)
    .flat()
    .filter((team) => team.Conference === 'NFC')
    .sort((a, b) => {
      if (b.Percentage !== a.Percentage) return b.Percentage - a.Percentage;
      if (b.Wins !== a.Wins) return b.Wins - a.Wins;
      return b.NetPoints - a.NetPoints;
    });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Conference Standings</h1>
      <ConferenceView afcTeams={afcTeams} nfcTeams={nfcTeams} />
    </div>
  );
}
```

---

## スタイリングの詳細

### 得失点差の色分け

```tsx
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
```

OverallTableと同じ色分けロジックを使用します。

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

## パフォーマンス

### Server Component

- サーバーサイドレンダリング
- JavaScriptバンドルに含まれない
- 高速な初回表示

### 2つのテーブル

- 各テーブル16行（計32行）
- OverallTableと同じパフォーマンス特性

---

**最終更新**: 2026年2月
