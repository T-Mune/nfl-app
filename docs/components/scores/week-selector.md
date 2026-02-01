# WeekSelector コンポーネント

## 概要

**ファイル:** `src/components/scores/WeekSelector.tsx`
**タイプ:** Client Component
**役割:** 週・シーズンタイプ・シーズンを選択するUI

WeekSelectorコンポーネントは、ユーザーが表示したい週、シーズンタイプ（Preseason/Regular/Postseason）、シーズン（年）を選択できるナビゲーションUIです。

---

## なぜClient Componentか

WeekSelectorは以下の理由でClient Componentとして実装されています:

1. **ユーザーインタラクション**: ドロップダウン選択とボタンクリック
2. **ブラウザAPI**: `window.location.href`でページ遷移
3. **動的スタイリング**: 選択状態に応じたUI更新
4. **イベントハンドラー**: `onChange`イベントの処理

---

## Props

```typescript
interface WeekSelectorProps {
  weeks: number[];         // 利用可能な週の配列（例: [1, 2, 3, ..., 18]）
  currentWeek: number;     // 現在表示中の週
  season: number;          // 現在表示中のシーズン（例: 2025）
  seasonType: number;      // 現在表示中のシーズンタイプ（1: Pre, 2: Regular, 3: Post）
  currentSeason: number;   // 最新のシーズン
  currentSeasonType?: number; // 最新のシーズンタイプ（オプショナル）
}
```

---

## 実装の詳細

### 1. 前週/次週ボタン

```typescript
const prevWeek = currentWeek > 1 ? currentWeek - 1 : null;
const nextWeek = currentWeek < weeks.length ? currentWeek + 1 : null;
```

**ロジック:**
- **prevWeek**: 第1週でなければ前の週を表示可能
- **nextWeek**: 最終週でなければ次の週を表示可能
- `null`の場合はボタンを無効化

**UI:**
```tsx
{prevWeek ? (
  <Link href={buildUrl(prevWeek)}>
    <Button variant="outline" size="sm" className="hidden sm:flex">
      ← Week {prevWeek}
    </Button>
    <Button variant="outline" size="sm" className="sm:hidden">
      ←
    </Button>
  </Link>
) : (
  <Button variant="outline" size="sm" disabled className="hidden sm:flex">
    ← Week 0
  </Button>
)}
```

**レスポンシブ:**
- デスクトップ: "← Week 5"（週番号あり）
- モバイル: "←"（矢印のみ）

---

### 2. シーズンタイプセレクター

```tsx
<select
  value={seasonType}
  onChange={(e) => {
    const newSeasonType = parseInt(e.target.value, 10);
    window.location.href = buildUrl(1, season, newSeasonType);
  }}
  className="h-9 rounded-md border border-input bg-background px-2 sm:px-3 py-1 text-xs sm:text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
  title={getSeasonTypeLabel(seasonType)}
>
  <option value={1}>{getSeasonTypeShortLabel(1)}</option>
  <option value={2}>{getSeasonTypeShortLabel(2)}</option>
  <option value={3}>{getSeasonTypeShortLabel(3)}</option>
</select>
```

**シーズンタイプ:**
- `1`: Preseason（プレシーズン）
- `2`: Regular（レギュラーシーズン）
- `3`: Postseason（ポストシーズン、プレーオフ）

**動作:**
- シーズンタイプを変更すると第1週にリセット
- ページ全体を再読み込み（`window.location.href`）

**ヘルパー関数:**
- `getSeasonTypeLabel()`: "Preseason", "Regular Season", "Postseason"
- `getSeasonTypeShortLabel()`: "Pre", "Regular", "Post"

---

### 3. 週セレクター

```tsx
<select
  value={currentWeek}
  onChange={(e) => {
    const week = parseInt(e.target.value, 10);
    window.location.href = buildUrl(week);
  }}
  className="h-9 rounded-md border border-input bg-background px-2 sm:px-3 py-1 text-xs sm:text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
>
  {weeks.map((week) => (
    <option key={week} value={week}>
      Week {week}
    </option>
  ))}
</select>
```

**動作:**
- 週を選択すると選択した週のデータを表示
- シーズンとシーズンタイプは維持

---

### 4. シーズンセレクター

```tsx
<select
  value={season}
  onChange={(e) => {
    const newSeason = parseInt(e.target.value, 10);
    window.location.href = buildUrl(currentWeek, newSeason);
  }}
  className="h-9 rounded-md border border-input bg-background px-2 sm:px-3 py-1 text-xs sm:text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
>
  {[currentSeason, currentSeason - 1, currentSeason - 2].map((s) => (
    <option key={s} value={s}>
      {s}
    </option>
  ))}
</select>
```

**表示シーズン:**
- 現在のシーズン（例: 2025）
- 前年（2024）
- 前々年（2023）

**動作:**
- シーズンを変更しても週番号は維持
- シーズンタイプも維持

---

### 5. URL構築関数

```typescript
const buildUrl = (w: number, s?: number, st?: number) => {
  const params = new URLSearchParams();
  params.set('week', String(w));
  params.set('season', String(s ?? season));
  params.set('seasonType', String(st ?? seasonType));
  return `/?${params.toString()}`;
};
```

**パラメータ:**
- `w`: 週番号（必須）
- `s`: シーズン（オプション、未指定なら現在のシーズン）
- `st`: シーズンタイプ（オプション、未指定なら現在のシーズンタイプ）

**生成されるURL例:**
```
/?week=5&season=2025&seasonType=2
/?week=1&season=2024&seasonType=1
```

---

## レイアウト

### レスポンシブフレックスボックス

```tsx
<div className="flex flex-wrap items-center gap-2">
```

**特徴:**
- `flex-wrap`: モバイルで複数行に折り返し
- `items-center`: 縦方向に中央揃え
- `gap-2`: 各要素間に8pxの間隔

### モバイル対応

- **ボタンテキスト**: デスクトップでは"← Week 5"、モバイルでは"←"
- **セレクターサイズ**: テキストサイズとパディングが調整される
  - モバイル: `text-xs px-2`
  - デスクトップ: `sm:text-sm sm:px-3`

---

## ユーザーエクスペリエンス

### 週の切り替え

**ボタンでの切り替え（高速）:**
- 前週/次週ボタンで1週ずつ移動
- よく使われる操作のショートカット

**ドロップダウンでの切り替え（柔軟）:**
- 任意の週に直接ジャンプ
- 大きな週の移動に便利

### シーズンタイプの切り替え

**自動的に第1週にリセット:**
- Regular SeasonからPostseasonに切り替えると、Week 1（ワイルドカードラウンド）にリセット
- ユーザーの混乱を防ぐ

### シーズンの切り替え

**過去のシーズンにアクセス:**
- 過去2年分のデータを閲覧可能
- 歴史的な試合結果を確認

---

## コード例

### 基本的な使用方法

```tsx
import { WeekSelector } from '@/components/scores/WeekSelector';

export default async function LiveScoresPage({ searchParams }: { searchParams: Promise<{ week?: string }> }) {
  const params = await searchParams;
  const currentWeek = parseInt(params.week ?? '1', 10);
  const currentSeason = 2025;
  const seasonType = 2; // Regular Season

  // 週の配列を生成（レギュラーシーズンは18週）
  const weeks = Array.from({ length: 18 }, (_, i) => i + 1);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <WeekSelector
          weeks={weeks}
          currentWeek={currentWeek}
          season={currentSeason}
          seasonType={seasonType}
          currentSeason={currentSeason}
        />
      </div>
      {/* ... スコア表示 ... */}
    </div>
  );
}
```

---

## スタイリング

### セレクター共通スタイル

```css
h-9                    /* 高さ: 36px */
rounded-md             /* 角丸 */
border border-input    /* 境界線 */
bg-background          /* 背景色 */
px-2 sm:px-3           /* 左右パディング */
py-1                   /* 上下パディング */
text-xs sm:text-sm     /* テキストサイズ */
shadow-sm              /* 軽い影 */
focus:outline-none     /* フォーカス時のoutlineを削除 */
focus:ring-1           /* フォーカス時にリング表示 */
focus:ring-ring        /* リングの色 */
```

### ボタンスタイル

- **variant="outline"**: 境界線のみのボタン
- **size="sm"**: 小サイズ
- **disabled**: 無効化されたボタンは薄いグレー

---

## アクセシビリティ

### セマンティックHTML

- `<select>`タグを使用
- `<option>`で選択肢を提供

### キーボード操作

- **Tab**: 次のセレクターに移動
- **矢印キー**: ドロップダウン内で選択
- **Enter**: 選択を確定

### title属性

```tsx
title={getSeasonTypeLabel(seasonType)}
```

シーズンタイプセレクターにツールチップを追加（例: "Regular Season"）

---

## パフォーマンス

### ページ遷移

```typescript
window.location.href = buildUrl(week);
```

**特徴:**
- フルページリロード
- サーバーで新しいデータを取得
- URLが更新される（ブラウザ履歴に残る）

**代替案（将来的な改善）:**
- Next.jsの`useRouter().push()`でクライアントサイド遷移
- より高速だがServer Componentsとの互換性を考慮する必要あり

---

**最終更新**: 2026年2月
