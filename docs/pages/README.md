# ページ実装ドキュメント

このドキュメントでは、NFL Stats Webアプリケーションの各ページの技術実装について説明します。

## 対象読者

このドキュメントは、以下の方を対象としています:
- **エンジニア**: ページの実装を理解し、修正や拡張を行いたい開発者
- **AI**: コードベースを理解し、自動化やサポートを行いたいAIエージェント

## ページ一覧

このアプリケーションには、以下の6つのメインページがあります:

| ページ名 | URL | ファイル | タイプ |
|---------|-----|---------|--------|
| Live Scores | `/` | `src/app/page.tsx` | Server Component |
| News | `/news` | `src/app/news/page.tsx` | Server Component |
| Schedule | `/schedule` | `src/app/schedule/page.tsx` | Server Component |
| Standings | `/standings` | `src/app/standings/page.tsx` | Server Component |
| Teams | `/teams` | `src/app/teams/page.tsx` | Server Component |
| Team Detail | `/teams/[teamId]` | `src/app/teams/[teamId]/page.tsx` | Server Component |

## ページ実装の共通パターン

全てのページは、以下の共通パターンに従って実装されています。

### 1. Server Componentとしての実装

全てのページコンポーネントは、Server Componentとして実装されています。

**理由:**
- サーバーサイドでデータフェッチングを実行
- SEO最適化（検索エンジンが完全なHTMLを受け取る）
- 初期ロードの高速化
- API キーなどの機密情報を保護

**特徴:**
- `async`関数として定義
- `await`でデータフェッチングを待機
- `'use client'`ディレクティブなし

### 2. データフェッチングパターン

各ページは、以下のパターンでデータを取得します:

```tsx
// 1. データフェッチング関数を定義
async function fetchData(): Promise<FetchResult> {
  try {
    const data = await getDataFromAPI();
    return { data, error: false };
  } catch {
    return { data: null, error: true };
  }
}

// 2. コンテンツコンポーネントを定義
async function Content() {
  const { data, error } = await fetchData();

  if (error || !data) {
    return <ErrorMessage />;
  }

  return <DataDisplay data={data} />;
}

// 3. ページコンポーネントでSuspenseを使用
export default function Page() {
  return (
    <div>
      <PageHeader />
      <Suspense fallback={<LoadingComponent />}>
        <Content />
      </Suspense>
    </div>
  )
}
```

**利点:**
- エラーハンドリングが明確
- Loading状態の表示が容易
- 段階的なレンダリング（Suspense）

### 3. Suspense境界

全てのページは、Suspenseを使用してデータ読み込み中の状態を管理しています。

**パターン:**
```tsx
<Suspense fallback={<LoadingComponent />}>
  <AsyncContentComponent />
</Suspense>
```

**効果:**
- ページの骨格（ヘッダー、タイトル）が即座に表示される
- データ読み込み中はLoading UIが表示される
- データ取得完了後、コンテンツに置き換わる

### 4. エラーハンドリング

全てのページは、一貫したエラーハンドリングを実装しています。

**パターン:**
```tsx
if (error || !data) {
  return (
    <div className="text-center py-8">
      <p className="text-destructive">Failed to load [content].</p>
      <p className="text-sm text-muted-foreground mt-2">
        Please try again later.
      </p>
    </div>
  );
}
```

**特徴:**
- ユーザーフレンドリーなエラーメッセージ
- 一貫性のあるスタイリング
- 再試行の案内

### 5. ローディング状態

各ページには、専用のLoading Componentが定義されています。

**パターン:**
```tsx
function PageLoading() {
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
- スケルトンスクリーン（実際のコンテンツと同じレイアウト）
- `animate-pulse`による点滅効果
- レスポンシブグリッド

## ルーティングマップ

Next.js App Routerは、ファイルシステムベースのルーティングを使用します。

### 静的ルート

| ファイルパス | URL | ページ |
|-------------|-----|--------|
| `app/page.tsx` | `/` | Live Scores |
| `app/news/page.tsx` | `/news` | News |
| `app/schedule/page.tsx` | `/schedule` | Schedule |
| `app/standings/page.tsx` | `/standings` | Standings |
| `app/teams/page.tsx` | `/teams` | Teams |

### 動的ルート

| ファイルパス | URL例 | パラメータ |
|-------------|-------|-----------|
| `app/teams/[teamId]/page.tsx` | `/teams/KC` | `teamId = "KC"` |
| `app/teams/[teamId]/page.tsx` | `/teams/SF` | `teamId = "SF"` |

**動的パラメータの取得:**
```tsx
export default async function TeamPage({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = await params;
  // teamId を使用してデータを取得
}
```

## searchParams の使用

一部のページは、URLクエリパラメータを使用します。

**例: Live Scoresページ**

```tsx
export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<{ week?: string; season?: string; seasonType?: string }>
}) {
  const params = await searchParams;
  const week = params.week ? parseInt(params.week, 10) : defaultWeek;
  const season = params.season ? parseInt(params.season, 10) : defaultSeason;
  // ...
}
```

**URL例:**
- `/` - デフォルト（現在の週）
- `/?week=10` - Week 10を表示
- `/?week=10&season=2025&seasonType=2` - 2025シーズン、Week 10、レギュラーシーズンを表示

## ページヘッダーパターン

全てのページは、一貫性のあるヘッダーデザインを使用しています。

```tsx
<div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
  <div className="w-1 sm:w-1.5 h-6 sm:h-8 bg-accent rounded-full" />
  <h1 className="text-2xl sm:text-3xl font-bold text-primary">
    Page Title
  </h1>
</div>
```

**構成要素:**
- **アクセントバー**: 左側の縦線（`bg-accent`）
- **タイトル**: 大きく太字のテキスト（`text-primary`）
- **レスポンシブ**: スマートフォンでは小さめに表示

## データの流れ

各ページにおけるデータの流れは以下の通りです:

```
1. ユーザーがページにアクセス
   ↓
2. Next.jsサーバーがページコンポーネントを実行
   ↓
3. データフェッチング関数がESPN APIを呼び出し
   ↓
4. ESPN APIレスポンス → アプリ型へ変換
   ↓
5. Server ComponentがHTMLをレンダリング
   ↓
6. HTMLをブラウザに送信
   ↓
7. ブラウザがHTMLを表示（ユーザーはコンテンツを見る）
   ↓
8. JavaScriptがダウンロードされ、ページがインタラクティブになる
```

## コンポーネント階層

各ページは、以下のような階層構造を持っています:

```
PageComponent (Server Component)
├── PageHeader (静的、即座に表示)
├── AdditionalUI (例: WeekSelector - Client Component)
└── Suspense
    └── ContentComponent (Server Component)
        ├── DataFetchingLogic
        └── DisplayComponents
            ├── ListComponent (Server Component)
            └── CardComponent (Server Component)
```

## パフォーマンス最適化

### 1. Server Components

ページの大部分をServer Componentとして実装することで:
- JavaScriptバンドルサイズを削減
- 初期ロードを高速化
- SEOを最適化

### 2. Suspense Streaming

Suspenseを使用することで:
- ページの骨格を即座に表示
- データ読み込み中もUIが表示される
- ユーザー体験の向上

### 3. キャッシング

ESPN APIのデータは、適切にキャッシュされます:
- Scores: 60秒
- News: 30秒
- Standings: 60秒
- Teams: 300秒

## 個別ページドキュメント

各ページの詳細な実装については、以下のドキュメントをご覧ください:

### [live-scores.md](./live-scores.md)
Live Scoresページの実装詳細です。

**内容:**
- ファイル: `src/app/page.tsx`
- ルート: `/`
- searchParamsの使用
- 週選択機能
- データフェッチング

### [news.md](./news.md)
Newsページの実装詳細です。

**内容:**
- ファイル: `src/app/news/page.tsx`
- ルート: `/news`
- ニュース記事の取得と表示
- カテゴリバッジ

### [schedule.md](./schedule.md)
Scheduleページの実装詳細です。

**内容:**
- ファイル: `src/app/schedule/page.tsx`
- ルート: `/schedule`
- 全週の試合データ取得
- シーズンタイプ別表示

### [standings.md](./standings.md)
Standingsページの実装詳細です。

**内容:**
- ファイル: `src/app/standings/page.tsx`
- ルート: `/standings`
- 順位表データの取得
- ディビジョン別グループ化

### [teams.md](./teams.md)
Teamsページの実装詳細です。

**内容:**
- ファイル: `src/app/teams/page.tsx`
- ルート: `/teams`
- チーム一覧の取得
- カンファレンス・ディビジョン別グループ化

### [team-detail.md](./team-detail.md)
Team Detailページの実装詳細です。

**内容:**
- ファイル: `src/app/teams/[teamId]/page.tsx`
- ルート: `/teams/[teamId]`
- 動的ルートパラメータ
- チームロスターの取得

## 新しいページの追加方法

新しいページを追加する場合は、以下の手順に従ってください:

### 1. ページファイルの作成

```bash
# 例: Playersページを追加
touch src/app/players/page.tsx
```

### 2. ページコンポーネントの実装

```tsx
// src/app/players/page.tsx
import { Suspense } from 'react';

async function PlayersContent() {
  const { data, error } = await fetchPlayers();

  if (error || !data) {
    return <ErrorMessage />;
  }

  return <PlayersList players={data} />;
}

function PlayersLoading() {
  return <SkeletonGrid />;
}

export default function PlayersPage() {
  return (
    <div>
      <PageHeader title="Players" />
      <Suspense fallback={<PlayersLoading />}>
        <PlayersContent />
      </Suspense>
    </div>
  )
}
```

### 3. ナビゲーションへの追加

```tsx
// src/components/layout/Header.tsx
const navigation = [
  { name: 'Live', href: '/' },
  { name: 'News', href: '/news' },
  { name: 'Schedule', href: '/schedule' },
  { name: 'Standings', href: '/standings' },
  { name: 'Teams', href: '/teams' },
  { name: 'Players', href: '/players' }, // 追加
];
```

### 4. データフェッチング関数の実装

```tsx
// src/lib/api/espn.ts に追加
export async function getPlayers() {
  const res = await fetch('https://api.espn.com/...', {
    next: { revalidate: 300 }
  });
  const data = await res.json();
  return data.map(convertToPlayer);
}
```

## ベストプラクティス

### 1. Server Component優先

ページとコンテンツ表示コンポーネントは、可能な限りServer Componentとして実装します。

**理由:**
- パフォーマンス向上
- SEO最適化
- セキュリティ

### 2. Suspenseの使用

データフェッチングを含むコンポーネントは、Suspenseでラップします。

**理由:**
- 段階的レンダリング
- Loading状態の管理が容易

### 3. エラーハンドリング

全てのデータフェッチングに、try-catchとエラー表示を実装します。

**理由:**
- ユーザー体験の向上
- デバッグの容易化

### 4. 型安全性

全てのPropsと関数に型定義を追加します。

**理由:**
- バグの早期発見
- リファクタリングの安全性

---

**最終更新**: 2026年2月
**対象読者**: エンジニア、AI
