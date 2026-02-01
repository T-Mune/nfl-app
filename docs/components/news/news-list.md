# NewsList コンポーネント

## 概要

**ファイル:** `src/components/news/NewsList.tsx`
**タイプ:** Server Component
**役割:** ニュース記事のリストを表示

NewsListコンポーネントは、複数のニュース記事をグリッドレイアウトで表示します。シンプルで読みやすいレイアウトを提供します。

---

## Props

```typescript
interface NewsListProps {
  articles: NewsArticle[];
}
```

### Propsの詳細

- **articles**: 表示するニュース記事の配列（`NewsArticle[]`型）

---

## 実装の詳細

### 1. 空の状態処理

```typescript
if (articles.length === 0) {
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground">No news articles available</p>
    </div>
  );
}
```

記事が1つもない場合、メッセージを中央に表示します。

**使用ケース:**
- データ取得エラー
- フィルター適用後に該当記事がない
- APIから記事が返されない

---

### 2. グリッドレイアウト

```tsx
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  {articles.map((article) => (
    <NewsCard key={article.id} article={article} />
  ))}
</div>
```

**レイアウト:**
- **モバイル（< 768px）**: 1列（`grid-cols-1`、デフォルト）
- **タブレット（≥ 768px）**: 2列（`md:grid-cols-2`）
- **デスクトップ（≥ 1024px）**: 3列（`lg:grid-cols-3`）

**ギャップ:**
- すべての画面サイズで24px（`gap-6`）
- ScoresListより大きいギャップ（ニュースカードは画像が大きいため）

---

## レスポンシブデザイン

### モバイル（< 768px）

- 1列レイアウト
- カードが縦に並ぶ
- 各カードが画面幅いっぱいに表示
- 読みやすさを優先

### タブレット（768px - 1023px）

- 2列レイアウト
- 横に2つのカードが並ぶ
- より多くの記事を一度に表示

### デスクトップ（≥ 1024px）

- 3列レイアウト
- 横に3つのカードが並ぶ
- 最大情報密度
- 大画面を有効活用

---

## コード例

### 基本的な使用方法

```tsx
import { NewsList } from '@/components/news/NewsList';

export default async function NewsPage() {
  const articles = await fetchNews();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Latest NFL News</h1>
      <NewsList articles={articles} />
    </div>
  );
}
```

### Suspenseと組み合わせた使用

```tsx
import { Suspense } from 'react';
import { NewsList } from '@/components/news/NewsList';

async function NewsData() {
  const articles = await fetchNews();
  return <NewsList articles={articles} />;
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
      ))}
    </div>
  );
}

export default function NewsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Latest NFL News</h1>
      <Suspense fallback={<LoadingSkeleton />}>
        <NewsData />
      </Suspense>
    </div>
  );
}
```

---

## ScoresListとの比較

### NewsList

```tsx
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
```

- ギャップ: 24px（`gap-6`）
- 理由: ニュースカードは画像が大きく、視覚的に目立つため広いギャップが適切

### ScoresList

```tsx
<div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

- ギャップ: モバイル12px（`gap-3`）、デスクトップ16px（`sm:gap-4`）
- 理由: スコアカードはコンパクトで情報密度が高いため狭いギャップ

---

## パフォーマンス

### Server Component

- **サーバーサイドレンダリング**: データフェッチングがサーバーで完結
- **JavaScriptバンドル削減**: クライアントに送信されるJSが少ない
- **高速な初回表示**: サーバーでHTMLを生成

### キーの使用

```tsx
{articles.map((article) => (
  <NewsCard key={article.id} article={article} />
))}
```

記事の`id`をキーとして使用することで、Reactが効率的にDOMを更新できます。

---

## 使用しているコンポーネント

- **NewsCard**: 個別のニュース記事カード（`./NewsCard`）

---

## 拡張例

### ページネーション機能の追加

```tsx
interface NewsListProps {
  articles: NewsArticle[];
  page?: number;
  totalPages?: number;
}

export function NewsList({ articles, page = 1, totalPages = 1 }: NewsListProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No news articles available</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {page > 1 && (
            <Link href={`/news?page=${page - 1}`}>
              <Button variant="outline">Previous</Button>
            </Link>
          )}
          <span className="flex items-center px-4">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/news?page=${page + 1}`}>
              <Button variant="outline">Next</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
```

### カテゴリフィルター機能の追加

```tsx
interface NewsListProps {
  articles: NewsArticle[];
  category?: string;
}

export function NewsList({ articles, category }: NewsListProps) {
  // カテゴリでフィルター
  const filteredArticles = category
    ? articles.filter((article) =>
        article.categories.some((cat) => cat.description === category)
      )
    : articles;

  if (filteredArticles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {category
            ? `No news articles for ${category}`
            : 'No news articles available'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredArticles.map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  );
}
```

---

## アクセシビリティ

### セマンティックHTML

- グリッドレイアウトは`<div>`で実装
- 各NewsCardは適切なセマンティックHTMLを使用

### キーボード操作

- 各記事カードは個別にフォーカス可能
- Tabキーで順次移動可能

---

## レイアウトの一貫性

### カードの高さ

NewsCardは`h-full`を使用しているため、同じ行のカードは高さが揃います:

```tsx
// NewsCard内
<Link href={article.articleUrl} className="block h-full">
  <Card className="h-full ...">
```

**効果:**
- グリッド内のカードが美しく整列
- 異なる長さのコンテンツでもレイアウトが崩れない

---

**最終更新**: 2026年2月
