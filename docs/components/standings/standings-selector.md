# StandingsSelector コンポーネント

## 概要

**ファイル:** `src/components/standings/StandingsSelector.tsx`
**タイプ:** Client Component
**役割:** 順位表の表示モードを切り替えるタブUI

StandingsSelectorコンポーネントは、ユーザーが3つの異なる順位表ビュー（Overall/Conference/Division）を切り替えることができるタブインターフェースを提供します。

---

## なぜClient Componentか

StandingsSelectorは以下の理由でClient Componentとして実装されています:

1. **状態管理**: 選択中のビューモードを管理（`useState`）
2. **ユーザーインタラクション**: タブのクリックイベント処理
3. **動的コンテンツ切り替え**: ビューモードに応じてコンポーネントを切り替え
4. **データ処理**: クライアントサイドでデータをソート・フィルター

---

## Props

```typescript
interface StandingsSelectorProps {
  standings: Record<string, Standing[]>; // ディビジョンごとの順位表
  season: number;                         // シーズン（例: 2025）
}
```

### standings構造

```typescript
{
  "AFC East": [Standing, Standing, ...],
  "AFC North": [Standing, Standing, ...],
  "AFC South": [Standing, Standing, ...],
  "AFC West": [Standing, Standing, ...],
  "NFC East": [Standing, Standing, ...],
  "NFC North": [Standing, Standing, ...],
  "NFC South": [Standing, Standing, ...],
  "NFC West": [Standing, Standing, ...]
}
```

---

## 状態管理

### ViewMode型

```typescript
type ViewMode = 'overall' | 'conference' | 'division';
```

**3つのビューモード:**
- **overall**: 全32チームを勝率順に表示
- **conference**: AFC/NFCごとに16チームずつ表示
- **division**: 8つのディビジョンごとに4チームずつ表示

### useState

```typescript
const [viewMode, setViewMode] = useState<ViewMode>('division');
```

**デフォルト:** `'division'`（ディビジョン別表示）

**理由:**
- 最も詳細な表示
- チーム同士の直接対決が分かりやすい
- NFLファンが最も興味を持つビュー

---

## データ処理

### 1. 全チームの取得

```typescript
const allTeams = Object.values(standings).flat();
```

ディビジョンごとの配列をフラット化して全32チームを取得します。

---

### 2. Overall（全体順位）のソート

```typescript
const sortedTeams = [...allTeams].sort((a, b) => {
  // 1. 勝率で比較
  if (b.Percentage !== a.Percentage) return b.Percentage - a.Percentage;

  // 2. 勝率が同じ場合は勝利数で比較
  if (b.Wins !== a.Wins) return b.Wins - a.Wins;

  // 3. 勝利数も同じ場合は得失点差で比較
  return b.NetPoints - a.NetPoints;
});
```

**ソート基準（優先順）:**
1. **勝率**（Percentage）: 高い方が上
2. **勝利数**（Wins）: 勝率が同じ場合、勝利数が多い方が上
3. **得失点差**（NetPoints）: 勝率・勝利数が同じ場合、得失点差が大きい方が上

**例:**
```
1. Kansas City Chiefs (14-3, .824)
2. Buffalo Bills (13-4, .765)
3. Baltimore Ravens (12-5, .706)
...
32. Carolina Panthers (3-14, .176)
```

---

### 3. Conference（カンファレンス別）のフィルターとソート

```typescript
const afcTeams = allTeams
  .filter((team) => team.Conference === 'AFC')
  .sort((a, b) => {
    if (b.Percentage !== a.Percentage) return b.Percentage - a.Percentage;
    if (b.Wins !== a.Wins) return b.Wins - a.Wins;
    return b.NetPoints - a.NetPoints;
  });

const nfcTeams = allTeams
  .filter((team) => team.Conference === 'NFC')
  .sort((a, b) => {
    if (b.Percentage !== a.Percentage) return b.Percentage - a.Percentage;
    if (b.Wins !== a.Wins) return b.Wins - a.Wins;
    return b.NetPoints - a.NetPoints;
  });
```

**処理:**
1. AFC/NFCでフィルター（各16チーム）
2. カンファレンス内で勝率順にソート

---

## 実装の詳細

### 1. タブUI（shadcn/ui Tabs）

```tsx
<Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
  <TabsList className="mb-4 grid grid-cols-3 w-full sm:w-auto">
    <TabsTrigger value="overall" className="text-sm sm:text-base">
      Overall
    </TabsTrigger>
    <TabsTrigger value="conference" className="text-sm sm:text-base">
      Conference
    </TabsTrigger>
    <TabsTrigger value="division" className="text-sm sm:text-base">
      Division
    </TabsTrigger>
  </TabsList>
</Tabs>
```

**特徴:**
- `grid grid-cols-3`: 3つのタブを均等に配置
- `w-full sm:w-auto`: モバイルで幅いっぱい、デスクトップで自動幅
- アクティブなタブは自動的にハイライト

---

### 2. タブコンテンツ

```tsx
<TabsContent value="overall">
  <OverallTable teams={sortedTeams} season={season} />
</TabsContent>

<TabsContent value="conference">
  <ConferenceView afcTeams={afcTeams} nfcTeams={nfcTeams} />
</TabsContent>

<TabsContent value="division">
  <DivisionView standings={standings} />
</TabsContent>
```

**動作:**
- 選択されたタブに対応するコンポーネントのみ表示
- 他のタブコンテンツは非表示（`display: none`）

---

## 各ビューモードの説明

### Overall（全体順位）

**表示内容:**
- 全32チームを1つのテーブルに表示
- 勝率順にランキング

**使用ケース:**
- リーグ全体の順位を一目で確認
- プレーオフシード順位の確認
- 強豪チームと弱小チームの比較

**コンポーネント:** `OverallTable`

---

### Conference（カンファレンス別）

**表示内容:**
- AFC: 16チーム
- NFC: 16チーム
- 各カンファレンス内で勝率順

**使用ケース:**
- プレーオフ進出チームの確認（各カンファレンス7チーム）
- カンファレンス内の競争状況
- ワイルドカード争いの確認

**コンポーネント:** `ConferenceView`

---

### Division（ディビジョン別）

**表示内容:**
- 8つのディビジョン（AFC East, AFC North, ...）
- 各ディビジョンに4チーム
- グリッドレイアウトで表示

**使用ケース:**
- ディビジョン優勝争いの確認
- 同地区ライバルとの比較
- ディビジョン内の直接対決記録

**コンポーネント:** `DivisionView`

---

## レスポンシブデザイン

### モバイル（< 640px）

- タブリストが画面幅いっぱい（`w-full`）
- テキストサイズ: 小（`text-sm`）
- 3つのタブが均等に配置

### デスクトップ（≥ 640px）

- タブリストが自動幅（`sm:w-auto`）
- テキストサイズ: 標準（`sm:text-base`）
- コンテンツに合わせて幅が調整される

---

## コード例

### 基本的な使用方法

```tsx
import { StandingsSelector } from '@/components/standings/StandingsSelector';

export default async function StandingsPage() {
  const standings = await fetchStandings();
  const season = 2025;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Standings</h1>
      <StandingsSelector standings={standings} season={season} />
    </div>
  );
}
```

---

## パフォーマンス

### メモ化の余地

現在は毎回ソートを実行していますが、将来的には`useMemo`でメモ化可能:

```typescript
const sortedTeams = useMemo(
  () =>
    [...allTeams].sort((a, b) => {
      if (b.Percentage !== a.Percentage) return b.Percentage - a.Percentage;
      if (b.Wins !== a.Wins) return b.Wins - a.Wins;
      return b.NetPoints - a.NetPoints;
    }),
  [allTeams]
);
```

---

## 使用しているコンポーネント

### shadcn/ui

- **Tabs**: タブコンテナ
- **TabsList**: タブボタンのリスト
- **TabsTrigger**: 個別のタブボタン
- **TabsContent**: タブの内容

### カスタムコンポーネント

- **OverallTable**: 全体順位表（`./OverallTable`）
- **ConferenceView**: カンファレンス別表示（`./ConferenceView`）
- **DivisionView**: ディビジョン別表示（`./DivisionView`）

---

## アクセシビリティ

### キーボード操作

- **Tab**: タブ間を移動
- **矢印キー**: タブ間を移動（Tabsコンポーネントの機能）
- **Enter/Space**: タブを選択

### ARIAロール

shadcn/uiのTabsコンポーネントは自動的に適切なARIA属性を設定:
- `role="tablist"`
- `role="tab"`
- `role="tabpanel"`
- `aria-selected`
- `aria-controls`

---

**最終更新**: 2026年2月
