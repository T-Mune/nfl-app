# レンダリング戦略

このドキュメントでは、NFL Stats Webアプリケーションのレンダリング戦略とパフォーマンス最適化について説明します。

## レンダリング概要

このアプリケーションは、Next.js 16の App Router による**Server-Side Rendering（SSR）**を主要なレンダリング戦略として採用しています。これにより、高速な初期ロード、優れたSEO、優れたユーザー体験を実現しています。

## SSR (Server-Side Rendering)

### SSRとは

Server-Side Renderingは、ページのHTMLをサーバーサイドで生成し、完全にレンダリングされた状態でクライアント（ブラウザ）に送信する手法です。

**動作の流れ:**
1. ユーザーがページにアクセス
2. Next.jsサーバーがReactコンポーネントを実行
3. データフェッチングとHTMLレンダリング
4. 完成したHTMLをブラウザに送信
5. ブラウザがHTMLを表示（ユーザーはすぐにコンテンツを見ることができる）
6. JavaScriptがダウンロードされ、ページがインタラクティブになる

### このプロジェクトでのSSR実装

全てのページ（`src/app/`以下の`page.tsx`）は、デフォルトでSSRされます。

**例: Live Scoresページ**

```tsx
// src/app/page.tsx
export default async function HomePage({ searchParams }: HomePageProps) {
  // サーバーサイドでデータフェッチング
  const current = await fetchCurrentWeek();
  const { games } = await fetchScores(season, week, seasonType);

  // サーバーサイドでHTMLレンダリング
  return (
    <div>
      <h1>Live Scores</h1>
      <WeekSelector currentWeek={week} />
      <ScoresList games={games} />
    </div>
  )
}
```

このコンポーネントは:
- **async関数**: サーバーサイドでのみ実行される
- **await**: データフェッチングを待機
- **return**: 完成したHTMLを返す

### SSRの利点

1. **高速な初期ロード**:
   - サーバーで生成されたHTMLが即座に表示される
   - JavaScriptのダウンロードを待つ必要がない

2. **SEO最適化**:
   - 検索エンジンが完全にレンダリングされたHTMLを受け取る
   - メタデータ（title, description）が正しく設定される

3. **低速ネットワーク対応**:
   - JavaScriptが大きくても、HTMLは軽量で高速に配信される
   - JavaScript無効の環境でも基本的なコンテンツは表示される

4. **セキュリティ**:
   - API キーやデータベース接続情報がクライアントに露出しない

### SSRの課題と解決策

**課題: データフェッチングがブロッキング**
- 全てのデータが揃うまでHTMLを送信できない
- 一部のデータ取得が遅いと、ページ全体が遅くなる

**解決策: Suspense ストリーミング**
- データの準備ができた部分から順次HTMLを送信
- 詳細は次のセクションで説明

## Suspense ストリーミング

### Suspenseとは

Suspenseは、Reactの機能で、コンポーネントのレンダリングを「一時停止」し、データの準備ができるまで待機できます。Next.js 16では、Suspenseを使って段階的にHTMLをストリーミング送信できます。

**動作の流れ:**
1. ページの骨格（ヘッダー、タイトルなど）を即座に送信
2. データフェッチング中のコンポーネントは、Loading状態を表示
3. データの準備ができたら、Loading状態をコンテンツに置き換え
4. ブラウザに差分のHTMLをストリーミング送信

### このプロジェクトでのSuspense実装

**例: Live Scoresページ**

```tsx
// src/app/page.tsx
export default async function HomePage({ searchParams }: HomePageProps) {
  return (
    <div>
      <h1>Live Scores</h1> {/* 即座に送信 */}
      <WeekSelector /> {/* 即座に送信 */}

      {/* Suspense境界 */}
      <Suspense fallback={<ScoresLoading />}>
        <Scores season={season} week={week} /> {/* データフェッチング */}
      </Suspense>
    </div>
  )
}

async function Scores({ season, week }) {
  // データフェッチング（時間がかかる）
  const { games } = await fetchScores(season, week);
  return <ScoresList games={games} />
}
```

**レンダリングタイムライン:**

```
0ms:    ページの骨格HTMLを送信（h1, WeekSelector）
        ↓ ブラウザに即座に表示
0ms:    <ScoresLoading /> を送信
        ↓ ブラウザにローディング表示
100ms:  データフェッチング中...
200ms:  データ取得完了
250ms:  <ScoresList games={games} /> のHTMLを送信
        ↓ ブラウザの<ScoresLoading />を置き換え
```

### Suspense の利点

1. **段階的な表示**:
   - ページの一部だけ遅くても、他の部分は即座に表示される
   - ユーザーは待ち時間が短く感じる

2. **パフォーマンス最適化**:
   - データフェッチングを並行化できる
   - ブラウザが早い段階でレンダリングを開始できる

3. **ユーザー体験向上**:
   - Loading状態が明確
   - 白い画面が表示される時間が減る

### Suspense使用箇所

このプロジェクトでは、全てのページでSuspenseを使用しています:

- `src/app/page.tsx`: Live Scoresのデータ読み込み
- `src/app/news/page.tsx`: ニュース記事の読み込み
- `src/app/schedule/page.tsx`: スケジュールデータの読み込み
- `src/app/standings/page.tsx`: 順位表データの読み込み
- `src/app/teams/page.tsx`: チーム一覧の読み込み
- `src/app/teams/[teamId]/page.tsx`: チーム詳細の読み込み

## Loading 状態

### Loading Componentsの実装

各ページには、データ読み込み中に表示されるLoading Componentが定義されています。

**例: ScoresLoading**

```tsx
// src/app/page.tsx
function ScoresLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-40 rounded-lg border bg-muted animate-pulse"
        />
      ))}
    </div>
  )
}
```

**特徴:**
- **スケルトンスクリーン**: 実際のコンテンツと同じレイアウト
- **animate-pulse**: Tailwindのアニメーションクラス（点滅効果）
- **bg-muted**: 背景色をミュート（控えめ）にする

### Loading状態の種類

#### 1. ページ全体のLoading

```tsx
<Suspense fallback={<PageLoading />}>
  <PageContent />
</Suspense>
```

#### 2. セクションごとのLoading

```tsx
<div>
  <h1>Title</h1> {/* 即座に表示 */}
  <Suspense fallback={<ContentLoading />}>
    <Content /> {/* データ読み込み */}
  </Suspense>
</div>
```

#### 3. インラインLoading（Client Component）

```tsx
'use client';

function MyComponent() {
  const { data, isLoading } = useQuery(...);

  if (isLoading) return <Spinner />;
  return <Content data={data} />;
}
```

### スケルトンスクリーンのベストプラクティス

1. **実際のレイアウトに近い形状**:
   - カードのLoading → カード形状のスケルトン
   - テーブルのLoading → テーブル形状のスケルトン

2. **適切なアニメーション**:
   - `animate-pulse`: 点滅効果（一般的）
   - `animate-spin`: 回転効果（スピナー）

3. **複数のプレースホルダー**:
   - 実際のコンテンツ数に近い数のスケルトンを表示
   - 例: 通常6つの記事カードが表示されるなら、6つのスケルトンを表示

## Error ハンドリング

### エラー処理の階層

このアプリケーションでは、エラーを複数の層で処理しています。

#### 1. データフェッチング層

```tsx
// src/app/page.tsx
async function fetchScores(season, week, seasonType) {
  try {
    const games = await getScoresByWeek(season, week, seasonType);
    return { games, error: false };
  } catch (error) {
    return { games: null, error: true };
  }
}
```

**特徴:**
- try-catch でエラーをキャッチ
- エラー情報を返り値で伝える
- コンポーネント側でエラー表示を制御

#### 2. コンポーネント層

```tsx
async function Scores({ season, week }) {
  const { games, error } = await fetchScores(season, week);

  if (error || !games) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load scores.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please try again later.
        </p>
      </div>
    );
  }

  return <ScoresList games={games} />;
}
```

**特徴:**
- エラー時は、ユーザーフレンドリーなメッセージを表示
- デザインシステムのスタイリングクラスを使用
- 「再試行」の案内を含む

#### 3. Next.js Error Boundary（将来的な実装）

```tsx
// error.tsx（各ページディレクトリに配置可能）
'use client';

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

### エラーメッセージの設計

**原則:**
1. **ユーザーフレンドリー**: 技術的な詳細を避ける
2. **具体的**: 何が失敗したかを伝える
3. **アクション可能**: 次にすべきことを提案

**例:**
- ❌ 悪い例: `Error: ECONNREFUSED`
- ✅ 良い例: `Failed to load scores. Please try again later.`

### エラー状態の表示

**視覚的な特徴:**
- **色**: `text-destructive`（赤系統）でエラーを示す
- **アイコン**: 警告アイコンやエラーアイコンを表示
- **メッセージ**: 明確で理解しやすい文言

## パフォーマンス最適化

### 1. コード分割（Code Splitting）

Next.js は自動的にルートごとにコードを分割します。

**効果:**
- ホームページにアクセスしても、Newsページのコードはダウンロードされない
- 初期JavaScriptバンドルサイズが小さくなる

**実装:**
- 自動（Next.js が行う）
- 手動の`dynamic import`も可能

### 2. 画像最適化

Next.js の`<Image>`コンポーネントを使用することで、画像を自動最適化できます（このプロジェクトでは`<img>`タグを使用していますが、将来的に移行可能）。

**最適化内容:**
- 自動的なサイズ調整
- WebP形式への変換
- 遅延読み込み（lazy loading）

**現在の実装:**
```tsx
// src/components/news/NewsCard.tsx
<img
  src={article.imageUrl}
  alt={article.headline}
  loading="lazy" // ブラウザネイティブの遅延読み込み
/>
```

### 3. Server Components によるバンドルサイズ削減

Server Components は、JavaScriptバンドルに含まれません。

**例:**
- `ScoresList.tsx`: Server Component → バンドルサイズ 0KB
- `Header.tsx`: Client Component → バンドルサイズに含まれる

**戦略:**
- できるだけ多くのコンポーネントをServer Componentにする
- Client Componentsは最小限に抑える

### 4. Suspense による段階的レンダリング

Suspenseにより、ページの一部だけ遅くても、他の部分は即座に表示されます。

**効果:**
- 初期HTMLの送信が高速化
- ユーザーが待ち時間を短く感じる

### 5. キャッシング戦略

`fetch()`の`revalidate`オプションにより、データをキャッシュします。

**効果:**
- 2回目以降のアクセスが高速化
- API呼び出し削減

## レンダリングパフォーマンスメトリクス

### Core Web Vitals

このアプリケーションは、Googleの Core Web Vitals を意識して最適化されています。

1. **LCP (Largest Contentful Paint)**:
   - 目標: 2.5秒以下
   - 対策: SSR、Suspense、画像最適化

2. **FID (First Input Delay)**:
   - 目標: 100ms以下
   - 対策: Server Components、コード分割

3. **CLS (Cumulative Layout Shift)**:
   - 目標: 0.1以下
   - 対策: スケルトンスクリーン、固定サイズの要素

### Time to Interactive (TTI)

**目標:** 3秒以下

**達成手段:**
- Server Components によるJavaScript削減
- 段階的なハイドレーション

### First Contentful Paint (FCP)

**目標:** 1.8秒以下

**達成手段:**
- SSRによる即座のHTML配信
- Suspense による段階的レンダリング

---

**最終更新**: 2026年2月
**対象読者**: エンジニア、AI、技術アーキテクト
