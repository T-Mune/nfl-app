# スタイリング

このドキュメントでは、NFL Stats Webアプリケーションのスタイリングアーキテクチャとデザインシステムについて説明します。

## スタイリング概要

このアプリケーションは、**Tailwind CSS v4**をメインのスタイリング手法として採用し、**CSS変数**によるテーマシステムを実装しています。また、**shadcn/ui**コンポーネントを使用して、一貫性のあるデザインを実現しています。

## Tailwind CSS v4

### Tailwind CSSとは

Tailwind CSSは、ユーティリティファーストのCSSフレームワークです。予め定義された小さなクラスを組み合わせてスタイルを作成します。

**例:**
```tsx
<div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md">
  コンテンツ
</div>
```

これは以下のCSSと同等です:
```css
.my-div {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  background-color: var(--primary);
  color: var(--primary-foreground);
  border-radius: 0.375rem;
}
```

### Tailwindを選んだ理由

1. **開発速度の向上**:
   - HTMLとCSSを行き来する必要がない
   - クラス名を考える必要がない

2. **一貫性**:
   - 予め定義されたスケール（サイズ、色）により、デザインが統一される
   - チーム全体で同じ設計言語を使用

3. **パフォーマンス**:
   - 未使用のCSSが最終ビルドに含まれない
   - 本番ビルドのCSSファイルサイズが非常に小さい

4. **レスポンシブデザイン**:
   - `sm:`, `md:`, `lg:`などのプレフィックスで簡単に対応
   - モバイルファーストのアプローチ

### Tailwind設定ファイル

#### tailwind.config.js

```javascript
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Tailwindクラスをスキャンするファイル
  ],
  theme: {
    extend: {
      // カスタムテーマ拡張
    },
  },
  plugins: [],
}
```

#### src/app/globals.css

```css
@import "tailwindcss";

/* CSS変数によるテーマ定義 */
@theme {
  --color-background: 255 255 255;
  --color-foreground: 10 10 10;
  --color-primary: 13 37 134;
  --color-primary-foreground: 248 250 252;
  /* ... */
}
```

### Tailwindユーティリティクラスの主な種類

#### レイアウト

```tsx
<div className="flex">           {/* display: flex */}
<div className="grid">           {/* display: grid */}
<div className="block">          {/* display: block */}
<div className="hidden">         {/* display: none */}
```

#### Flexbox

```tsx
<div className="flex items-center justify-between">
  {/* align-items: center; justify-content: space-between */}
</div>
```

#### Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1列（モバイル）、2列（タブレット）、3列（デスクトップ）*/}
</div>
```

#### スペーシング

```tsx
<div className="p-4">      {/* padding: 1rem */}
<div className="px-4">     {/* padding-left/right: 1rem */}
<div className="py-2">     {/* padding-top/bottom: 0.5rem */}
<div className="m-4">      {/* margin: 1rem */}
<div className="gap-2">    {/* gap: 0.5rem */}
```

#### テキスト

```tsx
<h1 className="text-2xl font-bold text-primary">
  {/* font-size: 1.5rem; font-weight: 700; color: var(--primary) */}
</h1>
```

#### 色

```tsx
<div className="bg-primary text-primary-foreground">
  {/* background: var(--primary); color: var(--primary-foreground) */}
</div>
```

## テーマシステム（CSS変数）

### CSS変数によるテーマ管理

このアプリケーションでは、Tailwind CSS v4のネイティブCSS変数機能を使用してテーマを管理しています。

#### テーマ定義

```css
/* src/app/globals.css */
@theme {
  /* 背景色 */
  --color-background: 255 255 255;          /* 白 */
  --color-foreground: 10 10 10;             /* ほぼ黒 */

  /* プライマリカラー（NFLテーマ） */
  --color-primary: 13 37 134;               /* NFL ブルー */
  --color-primary-foreground: 248 250 252;  /* 白系 */

  /* アクセントカラー */
  --color-accent: 213 63 140;               /* NFL レッド/ピンク */
  --color-accent-foreground: 248 250 252;   /* 白系 */

  /* セカンダリ */
  --color-secondary: 240 244 248;           /* 薄いグレー */
  --color-secondary-foreground: 15 23 42;   /* 濃いグレー */

  /* ミュート（控えめな色） */
  --color-muted: 240 244 248;
  --color-muted-foreground: 100 116 139;

  /* ボーダー */
  --color-border: 226 232 240;

  /* 破壊的アクション（削除、エラーなど） */
  --color-destructive: 239 68 68;           /* 赤 */
  --color-destructive-foreground: 255 255 255;
}
```

#### CSS変数の使用

Tailwindクラスは、自動的にCSS変数を参照します:

```tsx
<div className="bg-primary text-primary-foreground">
  {/* background-color: rgb(13 37 134); color: rgb(248 250 252); */}
</div>
```

### NFLテーマカラー

このアプリケーションは、NFLの公式カラースキームを模したテーマを使用しています:

- **プライマリ**: NFL ブルー（`#0D2586`）
- **アクセント**: NFL レッド/ピンク（`#D53F8C`）

これにより、NFLブランドとの一貫性を保っています。

### ダークモード対応（将来的な実装）

CSS変数を使用しているため、ダークモードの実装が容易です:

```css
@theme {
  /* ライトモード */
  --color-background: 255 255 255;
  --color-foreground: 10 10 10;
}

@media (prefers-color-scheme: dark) {
  @theme {
    /* ダークモード */
    --color-background: 10 10 10;
    --color-foreground: 255 255 255;
  }
}
```

## レスポンシブブレークポイント

Tailwind CSSは、モバイルファーストのレスポンシブデザインをサポートしています。

### ブレークポイント定義

| プレフィックス | 最小幅 | デバイス |
|---------------|--------|----------|
| （なし） | 0px | モバイル（デフォルト） |
| `sm:` | 640px | 大きめのスマートフォン |
| `md:` | 768px | タブレット |
| `lg:` | 1024px | デスクトップ |
| `xl:` | 1280px | 大きなデスクトップ |
| `2xl:` | 1536px | 超大型画面 |

### レスポンシブクラスの使用例

#### グリッドレイアウト

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* モバイル: 1列、タブレット: 2列、デスクトップ: 3列 */}
</div>
```

#### テキストサイズ

```tsx
<h1 className="text-2xl sm:text-3xl font-bold">
  {/* モバイル: 1.5rem、スマホ大: 1.875rem */}
</h1>
```

#### スペーシング

```tsx
<div className="p-4 sm:p-6 lg:p-8">
  {/* モバイル: 1rem、スマホ大: 1.5rem、デスクトップ: 2rem */}
</div>
```

#### 表示/非表示

```tsx
<div className="block md:hidden">
  {/* モバイルのみ表示、タブレット以上では非表示 */}
</div>

<div className="hidden md:block">
  {/* タブレット以上で表示、モバイルでは非表示 */}
</div>
```

### このプロジェクトでの実装例

#### ヘッダーナビゲーション

```tsx
// src/components/layout/Header.tsx
<nav className="hidden md:flex items-center space-x-1">
  {/* デスクトップ: 横並びナビゲーション */}
</nav>

<Sheet className="md:hidden">
  {/* モバイル: ハンバーガーメニュー */}
</Sheet>
```

#### ニュースカードグリッド

```tsx
// src/app/news/page.tsx
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  {/* モバイル: 1列、タブレット: 2列、デスクトップ: 3列 */}
  {articles.map((article) => (
    <NewsCard article={article} />
  ))}
</div>
```

## コンポーネントスタイリング

### shadcn/uiコンポーネント

shadcn/uiは、Tailwind CSSでスタイリングされた再利用可能なコンポーネント集です。

#### コンポーネント一覧

| コンポーネント | 用途 | ファイル |
|---------------|------|---------|
| Card | コンテンツコンテナ | `src/components/ui/card.tsx` |
| Badge | ラベル・タグ | `src/components/ui/badge.tsx` |
| Button | ボタン | `src/components/ui/button.tsx` |
| Table | データテーブル | `src/components/ui/table.tsx` |
| Tabs | タブナビゲーション | `src/components/ui/tabs.tsx` |
| Select | ドロップダウン選択 | `src/components/ui/select.tsx` |
| Sheet | スライドインメニュー | `src/components/ui/sheet.tsx` |

#### Cardコンポーネント例

```tsx
// src/components/ui/card.tsx
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
)

// 使用例
<Card>
  <CardHeader>
    <CardTitle>タイトル</CardTitle>
  </CardHeader>
  <CardContent>
    コンテンツ
  </CardContent>
</Card>
```

#### Badgeコンポーネント例

```tsx
// src/components/ui/badge.tsx
const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border border-border bg-background",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// 使用例
<Badge variant="default">デフォルト</Badge>
<Badge variant="secondary">セカンダリ</Badge>
<Badge variant="outline">アウトライン</Badge>
```

### カスタムコンポーネントスタイリング

#### スコアカード

```tsx
// src/components/scores/ScoreCard.tsx
<Card className="overflow-hidden border-t-4 border-t-primary hover:shadow-lg transition-shadow">
  {/* カスタムスタイル: 上部ボーダー、ホバー時の影 */}
  <CardContent>
    {/* コンテンツ */}
  </CardContent>
</Card>
```

#### ニュースカード

```tsx
// src/components/news/NewsCard.tsx
<Card className="h-full overflow-hidden border-t-4 border-t-primary hover:shadow-lg transition-shadow">
  {/* 画像 */}
  <div className="relative w-full aspect-video overflow-hidden bg-muted">
    <img src={article.imageUrl} className="w-full h-full object-cover" />
  </div>

  {/* コンテンツ */}
  <div className="p-4 flex flex-col flex-1 space-y-3">
    <h3 className="font-semibold text-base sm:text-lg line-clamp-2">
      {article.headline}
    </h3>
    <p className="text-sm text-muted-foreground line-clamp-3">
      {article.description}
    </p>
  </div>
</Card>
```

### cn()ユーティリティ関数

クラス名を条件付きで結合するためのユーティリティ関数です。

```typescript
// src/lib/utils.ts
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 使用例
<div className={cn(
  'px-4 py-2 rounded-md',
  isActive ? 'bg-accent text-accent-foreground' : 'bg-secondary',
  className // 外部から渡されたクラス名も結合
)}>
```

**機能:**
- `clsx`: 条件付きクラス名の生成
- `twMerge`: Tailwindクラスの競合を解決（後から指定されたクラスが優先）

**例:**
```typescript
cn('px-4', 'px-2') // → 'px-2' (後から指定された方が優先)
cn('text-red-500', isError && 'text-destructive') // → 条件付きクラス
```

## デザインパターン

### 1. カード主体のレイアウト

このアプリケーションでは、カード（Card）を主要なコンテンツコンテナとして使用しています。

**利点:**
- 明確な視覚的区切り
- 一貫性のあるデザイン
- モバイルでの表示が美しい

**実装箇所:**
- Live Scores: スコアカード
- News: 記事カード
- Teams: チームカード
- Standings: 順位表カード

### 2. グリッドレイアウト

レスポンシブなグリッドレイアウトを使用して、デバイスに応じてカラム数を調整します。

```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  {items.map(item => <Card key={item.id}>{item.content}</Card>)}
</div>
```

### 3. アクセントカラーの使用

ページタイトルや重要な要素には、アクセントカラーを使用します。

```tsx
<div className="flex items-center gap-2">
  <div className="w-1.5 h-8 bg-accent rounded-full" /> {/* アクセントバー */}
  <h1 className="text-3xl font-bold text-primary">Live Scores</h1>
</div>
```

### 4. ホバーエフェクト

インタラクティブな要素には、ホバー時のフィードバックを提供します。

```tsx
<Card className="hover:shadow-lg transition-shadow">
  {/* ホバー時に影が濃くなる */}
</Card>

<Link className="hover:bg-secondary transition-colors">
  {/* ホバー時に背景色が変わる */}
</Link>
```

### 5. トランジション

状態変化には、スムーズなトランジションを適用します。

```tsx
<div className="transition-all duration-300">
  {/* 300msのトランジション */}
</div>
```

## アクセシビリティ

### カラーコントラスト

WCAG 2.1 AAレベルのコントラスト比を満たすように色を選定しています。

**例:**
- `text-primary`（NFLブルー）と `bg-background`（白）: 十分なコントラスト
- `text-muted-foreground` と `bg-background`: 読みやすいコントラスト

### フォーカス表示

キーボードナビゲーション時のフォーカスリングを明確に表示します（ブラウザデフォルト）。

### セマンティックHTML

意味のあるHTMLタグを使用しています:
- `<header>`, `<main>`, `<footer>`
- `<h1>`, `<h2>`, `<h3>` の適切な階層
- `<button>`, `<a>` の適切な使い分け

---

**最終更新**: 2026年2月
**対象読者**: エンジニア、AI、技術アーキテクト
