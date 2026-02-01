# NewsCard コンポーネント

## 概要

**ファイル:** `src/components/news/NewsCard.tsx`
**タイプ:** Server Component
**役割:** 個別のニュース記事を表示するカード

NewsCardコンポーネントは、1つのNFLニュース記事を視覚的に魅力的なカード形式で表示します。画像、見出し、説明、カテゴリバッジ、公開日、著者情報を含みます。

---

## Props

```typescript
interface NewsCardProps {
  article: NewsArticle;
}
```

### NewsArticle型

```typescript
interface NewsArticle {
  id: string;
  headline: string;
  description: string;
  publishedDate: string;
  articleUrl: string;
  byline?: string;          // 著者名
  imageUrl?: string;        // 記事画像URL
  imageAlt?: string;        // 画像の代替テキスト
  isPremium: boolean;       // プレミアム記事かどうか
  categories: Category[];   // カテゴリ配列
}

interface Category {
  description: string;      // カテゴリ名（例: "Kansas City Chiefs"）
  type: string;            // カテゴリタイプ（"team", "athlete", "league"）
}
```

---

## 実装の詳細

### 1. カード全体がリンク

```tsx
<Link
  href={article.articleUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="block h-full"
>
  <Card className="h-full overflow-hidden border-t-4 border-t-primary hover:shadow-lg transition-shadow">
    {/* カード内容 */}
  </Card>
</Link>
```

**特徴:**
- カード全体がクリック可能
- 外部リンク（ESPN記事）を新しいタブで開く
- ホバー時に影が強くなる（`hover:shadow-lg`）
- 高さいっぱいに表示（`h-full`）

**セキュリティ:**
- `rel="noopener noreferrer"`: 外部サイトが元のページにアクセスできないようにする

---

### 2. 記事画像

```tsx
{article.imageUrl ? (
  <div className="relative w-full aspect-video overflow-hidden bg-muted">
    <img
      src={article.imageUrl}
      alt={article.imageAlt || article.headline}
      className="w-full h-full object-cover"
      loading="lazy"
    />
  </div>
) : (
  <div className="relative w-full aspect-video bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
    <span className="text-muted-foreground text-xs font-medium">NFL</span>
  </div>
)}
```

**画像がある場合:**
- `aspect-video`: 16:9のアスペクト比
- `object-cover`: 画像をトリミングしてカードに収める
- `loading="lazy"`: 遅延読み込みでパフォーマンス向上
- 代替テキストを設定（アクセシビリティ）

**画像がない場合:**
- グラデーション背景を表示
- "NFL"テキストをプレースホルダーとして表示

---

### 3. カテゴリバッジ

```tsx
{article.categories.length > 0 && (
  <div className="flex flex-wrap gap-1.5">
    {article.categories.map((category, index) => (
      <Badge
        key={index}
        variant={
          category.type === 'team'
            ? 'default'
            : category.type === 'athlete'
              ? 'secondary'
              : 'outline'
        }
        className="text-xs"
      >
        {category.description}
      </Badge>
    ))}
  </div>
)}
```

**バッジの色:**
- **Team（チーム）**: デフォルト（プライマリカラー）
- **Athlete（選手）**: セカンダリカラー
- **League（リーグ）**: アウトライン（境界線のみ）

**例:**
```
[Kansas City Chiefs] [Patrick Mahomes] [AFC West]
```

---

### 4. 見出しと説明

```tsx
{/* 見出し */}
<h3 className="font-semibold text-base sm:text-lg line-clamp-2 leading-tight">
  {article.headline}
</h3>

{/* 説明 */}
<p className="text-sm text-muted-foreground line-clamp-3 flex-1">
  {article.description}
</p>
```

**特徴:**
- **line-clamp-2**: 見出しを2行に制限（超過分は省略記号）
- **line-clamp-3**: 説明を3行に制限
- **flex-1**: 説明がカードの残りスペースを占める

**レスポンシブ:**
- モバイル: `text-base`（16px）
- デスクトップ: `sm:text-lg`（18px）

---

### 5. フッター（日付・著者・プレミアムバッジ）

```tsx
<div className="flex items-center justify-between gap-2 pt-2 text-xs text-muted-foreground border-t">
  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
    <span>{formatNewsDate(article.publishedDate)}</span>
    {article.byline && (
      <span className="truncate">By {article.byline}</span>
    )}
  </div>
  <div className="flex items-center gap-1.5 flex-shrink-0">
    {article.isPremium && (
      <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20">
        Premium
      </Badge>
    )}
    <ExternalLink className="w-4 h-4 text-muted-foreground" />
  </div>
</div>
```

**左側:**
- 公開日（例: "2 hours ago", "Jan 15, 2025"）
- 著者名（例: "By Adam Schefter"）
- `truncate`: 著者名が長い場合は省略

**右側:**
- プレミアムバッジ（有料記事の場合）
- 外部リンクアイコン

**formatNewsDate():**
- 相対時刻表示（24時間以内: "2 hours ago"）
- 絶対日付表示（24時間以降: "Jan 15, 2025"）

---

## スタイリング

### カードの境界線

```tsx
className="h-full overflow-hidden border-t-4 border-t-primary hover:shadow-lg transition-shadow"
```

- `border-t-4`: 上部に太い境界線（4px）
- `border-t-primary`: プライマリカラーの境界線
- `hover:shadow-lg`: ホバー時に影を強く
- `transition-shadow`: 影のアニメーション

### レスポンシブテキスト

- **見出し**: `text-base sm:text-lg`（モバイル16px、デスクトップ18px）
- **説明**: `text-sm`（14px）
- **フッター**: `text-xs`（12px）

### 画像アスペクト比

```tsx
className="relative w-full aspect-video"
```

- `aspect-video`: 16:9の比率（動画のような横長画像）
- どのカードも一貫した高さを保つ

---

## 使用しているコンポーネント

### shadcn/ui

- **Card**: カードコンテナ
- **CardContent**: カードの内容
- **Badge**: カテゴリとプレミアムバッジ

### lucide-react

- **ExternalLink**: 外部リンクアイコン

### Next.js

- **Link**: クライアントサイドルーティング（外部リンクにも使用）

### ヘルパー関数

- **formatNewsDate**: 日付を相対時刻または絶対日付にフォーマット（`@/lib/api/espn`）

---

## コード例

### 基本的な使用方法

```tsx
import { NewsCard } from '@/components/news/NewsCard';

export function NewsPage({ articles }: { articles: NewsArticle[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  );
}
```

---

## アクセシビリティ

### 画像の代替テキスト

```tsx
alt={article.imageAlt || article.headline}
```

画像に代替テキストを提供（スクリーンリーダー対応）

### セマンティックHTML

- `<h3>`: 見出しタグ
- `<p>`: 段落タグ
- `<a>`: リンクタグ

### キーボード操作

- カード全体がクリック可能なリンク
- Tabキーでフォーカス可能
- Enterキーでリンクを開く

---

## パフォーマンス

### 画像の遅延読み込み

```tsx
loading="lazy"
```

ビューポートに入るまで画像を読み込まない（初回表示を高速化）

### Server Component

- サーバーサイドレンダリング
- JavaScriptバンドルに含まれない
- 高速な初回表示

---

## プレミアム記事の識別

### Premiumバッジ

```tsx
{article.isPremium && (
  <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20">
    Premium
  </Badge>
)}
```

**スタイル:**
- 黄色のテキストと背景
- ダークモードでも見やすい色調整

**ユーザーエクスペリエンス:**
- プレミアム記事を一目で識別
- クリックするとESPN+のページに遷移

---

**最終更新**: 2026年2月
