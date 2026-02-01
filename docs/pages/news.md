# News ページ実装

## 基本情報

| 項目 | 値 |
|------|-----|
| **ファイル** | `src/app/news/page.tsx` |
| **ルート** | `/news` |
| **コンポーネントタイプ** | Server Component |
| **データソース** | ESPN News API |

## 概要

Newsページは、ESPN提供の最新NFL関連ニュース記事を一覧表示します。記事にはカテゴリバッジ（チーム、選手など）とプレミアム記事の識別が含まれます。

## コンポーネント構造

```tsx
NewsPage (Server Component)
├── PageHeader (静的)
└── Suspense
    └── NewsContent (Server Component)
        ├── fetchNewsData()
        └── NewsList (Server Component)
            └── NewsCard[] (Server Component)
```

## データフェッチング

### fetchNewsData()

```tsx
async function fetchNewsData(): Promise<FetchResult> {
  try {
    const articles = await getNews();
    return { articles, error: false };
  } catch {
    return { articles: null, error: true };
  }
}
```

**使用API:**
- `getNews()`: `src/lib/api/espn.ts`
- キャッシング: 30秒間（ニュースは速報性が重要）

**返り値:**
```tsx
interface FetchResult {
  articles: NewsArticle[] | null;
  error: boolean;
}
```

## ページコンポーネント

### NewsPage

```tsx
export default function NewsPage() {
  return (
    <div>
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="w-1 sm:w-1.5 h-6 sm:h-8 bg-accent rounded-full" />
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">News</h1>
      </div>
      <Suspense fallback={<NewsLoading />}>
        <NewsContent />
      </Suspense>
    </div>
  );
}
```

### NewsContent

```tsx
async function NewsContent() {
  const { articles, error } = await fetchNewsData();

  if (error || !articles) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load news articles.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please try again later.
        </p>
      </div>
    );
  }

  return <NewsList articles={articles} />;
}
```

### NewsLoading

```tsx
function NewsLoading() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-96 rounded-lg border border-border bg-muted animate-pulse"
        />
      ))}
    </div>
  );
}
```

**特徴:**
- 6つのスケルトンカード（高さ96 = 384px）
- ニュースカードよりも高い（画像を含むため）

## 使用コンポーネント

### NewsList

**ファイル:** `src/components/news/NewsList.tsx`

**Props:**
```tsx
interface NewsListProps {
  articles: NewsArticle[];
}
```

**機能:**
- 記事配列を受け取り、グリッドレイアウトで表示
- 空の場合は「記事なし」メッセージ

### NewsCard

**ファイル:** `src/components/news/NewsCard.tsx`

**Props:**
```tsx
interface NewsCardProps {
  article: NewsArticle;
}
```

**機能:**
- サムネイル画像の表示
- カテゴリバッジ（チーム、選手、トピック）
- 見出しと説明
- 公開日時と著者
- プレミアム記事バッジ
- 外部リンク（ESPNサイトへ）

## データフロー

```
ユーザーがページアクセス
  ↓
NewsPage コンポーネント実行
  ↓
ページヘッダー即座に表示
  ↓
Suspense 境界
  ↓
NewsLoading を表示
  ↓
NewsContent コンポーネント実行
  ↓
fetchNewsData() - ESPN API呼び出し
  ↓
getNews() - データ取得（30秒キャッシュ）
  ↓
NewsArticle[] 型に変換
  ↓
NewsList → NewsCard[] でレンダリング
  ↓
HTMLをクライアントに送信
```

## パフォーマンス最適化

### 1. 30秒キャッシング

ニュースは速報性が重要なため、比較的短い30秒のキャッシュ時間:
- 最新ニュースを迅速に提供
- API呼び出しを削減

### 2. 画像の遅延読み込み

```tsx
<img loading="lazy" />
```
- ブラウザネイティブのlazyロードを使用
- ビューポート外の画像は読み込まれない

---

**最終更新**: 2026年2月
**対象ページ**: `/news`
