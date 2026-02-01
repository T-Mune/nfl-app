# データフロー

このドキュメントでは、NFL Stats Webアプリケーションにおけるデータの流れを詳しく説明します。

## 概要

このアプリケーションのデータフローは、以下の主要な概念に基づいています:

1. **Server-First**: データフェッチングは主にサーバーサイドで実行
2. **Type-Safe**: 型システムによる安全なデータ変換
3. **Cached**: キャッシングによる高速化とAPI呼び出し削減
4. **Progressive**: 段階的なデータ読み込みとレンダリング

## Server Components vs Client Components の違い

React 19とNext.js 16では、コンポーネントを2種類に分類できます。

### Server Components とは

Server Componentsは、サーバーサイドでのみレンダリングされるReactコンポーネントです。クライアント（ブラウザ）には、レンダリング結果のHTMLのみが送信されます。

**特徴:**
- サーバーサイドでデータフェッチングを直接実行できる
- JavaScriptバンドルサイズに含まれない（クライアント側のJSが軽量化）
- データベースやAPIキーなどのセンシティブな情報に直接アクセスできる
- ブラウザAPIやReact Hooksは使用できない

**例:**
```tsx
// src/components/scores/ScoresList.tsx
// Server Component（'use client'ディレクティブなし）
export function ScoresList({ games }: ScoresListProps) {
  if (games.length === 0) {
    return <div>No games found</div>
  }

  return (
    <div>
      {games.map((game) => (
        <ScoreCard key={game.id} game={game} />
      ))}
    </div>
  )
}
```

**利点:**
- 初期ロードが高速（HTMLが即座に配信される）
- SEO最適化（検索エンジンが完全なHTMLを受け取る）
- セキュリティ（API キーなどが露出しない）

### Client Components とは

Client Componentsは、ブラウザでレンダリングされるReactコンポーネントです。JavaScriptバンドルに含まれ、ブラウザでインタラクティブになります。

**特徴:**
- React Hooks（useState, useEffect など）が使用できる
- ブラウザAPI（localStorage, windowなど）にアクセスできる
- ユーザーイベント（クリック、入力など）を処理できる
- ファイル先頭に`'use client'`ディレクティブが必要

**例:**
```tsx
// src/components/layout/Header.tsx
'use client';

export function Header() {
  const [isOpen, setIsOpen] = useState(false); // useState が使える

  return (
    <header>
      <button onClick={() => setIsOpen(!isOpen)}> {/* クリックイベントを処理 */}
        Menu
      </button>
    </header>
  )
}
```

**利点:**
- インタラクティブなUI
- クライアントサイドの状態管理
- ブラウザAPIの使用

### なぜこの区別が重要か

Server ComponentsとClient Componentsを適切に使い分けることで、以下の利点が得られます:

1. **パフォーマンス最適化:**
   - Server Components: JavaScriptバンドルに含まれないため、ブラウザに送信するJSが少なくなる
   - Client Components: 必要な部分のみをインタラクティブにする

2. **セキュリティ:**
   - Server Components: API キーやデータベース接続情報をクライアントに露出しない
   - Client Components: 公開情報のみを扱う

3. **開発体験:**
   - Server Components: データフェッチングがシンプルになる（async/awaitを直接使える）
   - Client Components: ユーザーインタラクションを直感的に実装できる

### どのように判断するか

**Server Componentにするべき場合:**
- データフェッチングのみを行う
- ユーザーインタラクションがない
- SEOが重要
- API キーなどのセンシティブ情報を扱う

**Client Componentにするべき場合:**
- useState, useEffectなどのHooksが必要
- ユーザーイベント（クリック、入力）を処理
- ブラウザAPIを使用
- サードパーティのUIライブラリを使用（多くはClient Component）

### 実例を用いた説明

#### 例1: Live Scoresページ

```tsx
// src/app/page.tsx - Server Component
export default async function HomePage({ searchParams }: HomePageProps) {
  // サーバーサイドでデータフェッチング
  const { games } = await fetchScores(season, week, seasonType);

  return (
    <div>
      <h1>Live Scores</h1>
      {/* WeekSelector は Client Component（ユーザーインタラクション） */}
      <WeekSelector currentWeek={week} />
      {/* ScoresList は Server Component（データ表示のみ） */}
      <ScoresList games={games} />
    </div>
  )
}
```

このページでは:
- **ページ自体（HomePage）**: Server Component - データフェッチング
- **WeekSelector**: Client Component - 週選択のインタラクション
- **ScoresList**: Server Component - データ表示のみ

#### 例2: ヘッダーナビゲーション

```tsx
// src/components/layout/Header.tsx - Client Component
'use client';

export function Header() {
  const pathname = usePathname(); // ブラウザAPIを使用
  const [isOpen, setIsOpen] = useState(false); // 状態管理

  return (
    <header>
      {/* 現在のパスに応じてナビゲーションをハイライト */}
      {navigation.map((item) => (
        <Link
          href={item.href}
          className={pathname === item.href ? 'active' : ''}
        >
          {item.name}
        </Link>
      ))}
    </header>
  )
}
```

このコンポーネントは:
- `usePathname()`: 現在のURLパスを取得（ブラウザAPI）
- `useState()`: モバイルメニューの開閉状態を管理
- クリックイベント: ユーザーインタラクション

これらの機能を使うため、Client Componentである必要があります。

## データフェッチングパターン

### データがどこから来るか

このアプリケーションのデータは、ESPN（大手スポーツメディア）が提供するAPIから取得されます。

**ESPN APIエンドポイント:**
- **Scoreboard**: 試合スコアと状態
- **Teams**: チーム一覧と情報
- **Team Roster**: チームロスター（選手名簿）
- **Standings**: 順位表
- **News**: ニュース記事

**API統合コード:**
- ファイル: `src/lib/api/espn.ts`
- 関数: `getScoresByWeek()`, `getTeams()`, `getStandings()`, `getNews()` など

### データがどのように流れるか（ステップバイステップ）

#### 1. ユーザーがページにアクセス

ユーザーがブラウザでURL（例: `/`）にアクセスします。

```
ユーザー → ブラウザ → Vercel（Next.jsサーバー）
```

#### 2. Next.jsサーバーがページコンポーネントをレンダリング

Next.jsサーバーは、リクエストされたURLに対応するページコンポーネント（`src/app/page.tsx`）を実行します。

```tsx
// src/app/page.tsx
export default async function HomePage({ searchParams }) {
  // ステップ3: データフェッチング関数を呼び出し
  const { games } = await fetchScores(season, week, seasonType);

  // ステップ6: HTMLをレンダリング
  return <ScoresList games={games} />
}
```

#### 3. データフェッチング関数がESPN APIを呼び出し

`fetchScores()`関数内で、`getScoresByWeek()`が呼び出されます。

```tsx
// src/app/page.tsx
async function fetchScores(season, week, seasonType) {
  const games = await getScoresByWeek(season, week, seasonType);
  return { games, error: false };
}
```

#### 4. ESPN APIからデータを取得

`getScoresByWeek()`は、ESPN APIにHTTPリクエストを送信します。

```tsx
// src/lib/api/espn.ts
export async function getScoresByWeek(season: number, week: number, seasonType: number) {
  const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?...`;
  const res = await fetch(url, { next: { revalidate: 60 } }); // キャッシュ60秒
  const data: ESPNScoreboard = await res.json();

  // ステップ5: 型変換
  return data.events.map(convertESPNEventToGame);
}
```

#### 5. 型変換（ESPN型 → アプリ型）

ESPN APIのレスポンス（`ESPNScoreboard`型）を、アプリケーション独自の`Game[]`型に変換します。

```typescript
// ESPN型（複雑）→ アプリ型（シンプル）
ESPNScoreboard → Game[]

// 例
{
  events: [
    { id: '1', competitions: [...], status: {...} }
  ]
}
↓
[
  { id: '1', homeTeam: {...}, awayTeam: {...}, homeScore: 27, awayScore: 24, ... }
]
```

#### 6. HTMLレンダリング

Server Componentは、取得したデータを使ってHTMLをレンダリングします。

```tsx
<ScoresList games={games} />
↓
<div>
  <ScoreCard game={game1} />
  <ScoreCard game={game2} />
  ...
</div>
```

#### 7. HTMLをクライアントに送信

Next.jsサーバーは、レンダリングされたHTMLをブラウザに送信します。

```
Vercel（Next.jsサーバー）→ HTML → ブラウザ → ユーザーに表示
```

#### 8. クライアントサイドのハイドレーション

ブラウザは、HTMLを表示した後、必要なJavaScript（Client Components）をダウンロードして実行し、インタラクティブにします。

```
HTML（静的）+ JavaScript → インタラクティブなページ
```

### ユーザーがページにアクセスしてからデータが表示されるまでの流れ

**タイムライン:**

```
0ms:    ユーザーがURLにアクセス
        ↓
50ms:   Next.jsサーバーがリクエストを受信
        ↓
100ms:  データフェッチング開始（ESPN API呼び出し）
        ↓
200ms:  ESPN APIからレスポンスを受信
        ↓
250ms:  型変換とHTMLレンダリング
        ↓
300ms:  HTMLをブラウザに送信
        ↓
350ms:  ブラウザがHTMLを表示（ユーザーはコンテンツを見ることができる）
        ↓
500ms:  JavaScriptダウンロードとハイドレーション
        ↓
550ms:  ページが完全にインタラクティブになる
```

### キャッシュがある場合とない場合の違い

#### キャッシュなし（初回アクセス）

```
ユーザー → Next.js → ESPN API（ネットワーク通信）→ データ → レンダリング → HTML
所要時間: 300～500ms
```

#### キャッシュあり（2回目以降、60秒以内）

```
ユーザー → Next.js → キャッシュ（即座）→ データ → レンダリング → HTML
所要時間: 50～100ms
```

**キャッシュの効果:**
- 応答時間が約5～10倍高速化
- ESPN APIへの負荷削減
- ユーザー体験の向上

## キャッシング戦略

### なぜキャッシュが必要か

1. **パフォーマンス**: 同じデータを何度もフェッチする必要がない
2. **コスト削減**: API呼び出し回数を減らす
3. **ユーザー体験**: ページの読み込みが高速になる
4. **信頼性**: APIの一時的な障害時でも、キャッシュからデータを提供できる
5. **APIレート制限**: 過剰なリクエストを防ぐ

### どのようにキャッシュしているか（Next.jsの仕組み）

Next.js 16は、`fetch()`関数に組み込みのキャッシング機能を提供します。

**基本構文:**
```typescript
fetch(url, { next: { revalidate: 秒数 } })
```

**動作:**
1. 初回リクエスト: APIを呼び出し、レスポンスをキャッシュに保存
2. 再検証時間内の再リクエスト: キャッシュから即座に返す
3. 再検証時間経過後: バックグラウンドでAPIを呼び出し、キャッシュを更新

これは**ISR（Incremental Static Regeneration）**と呼ばれる仕組みです。

### 各エンドポイントのキャッシュ時間と理由

#### Scores（試合スコア）: 60秒

```typescript
// src/lib/api/espn.ts
fetch(url, { next: { revalidate: 60 } })
```

**理由:**
- 試合は進行中でもスコアが頻繁に変わるため、比較的短いキャッシュ時間
- しかし、毎秒更新する必要はない（60秒でも十分リアルタイム感がある）
- サーバー負荷とリアルタイム性のバランス

#### News（ニュース記事）: 30秒

```typescript
fetch(url, { next: { revalidate: 30 } })
```

**理由:**
- ニュースは速報性が重要
- 新しい記事が頻繁に公開される
- 短いキャッシュ時間で最新情報を提供

#### Standings（順位表）: 60秒

```typescript
fetch(url, { next: { revalidate: 60 } })
```

**理由:**
- 順位表は試合終了後にのみ更新される
- 試合中は変わらないため、長めのキャッシュでOK
- API呼び出し削減を優先

#### Teams & Roster（チーム・ロスター）: 300秒（5分）

```typescript
fetch(url, { next: { revalidate: 300 } })
```

**理由:**
- チーム情報とロスターはほとんど変わらない
- シーズン中でも、選手の追加・削除は稀
- 長いキャッシュ時間でAPI呼び出しを大幅に削減

### キャッシュの効果（パフォーマンス、API呼び出し削減）

#### パフォーマンス向上

**キャッシュなし:**
- 初回ロード: 300ms
- 2回目ロード: 300ms
- 3回目ロード: 300ms

**キャッシュあり（60秒）:**
- 初回ロード: 300ms（キャッシュに保存）
- 2回目ロード（30秒後）: 50ms（キャッシュから取得）
- 3回目ロード（50秒後）: 50ms（キャッシュから取得）
- 4回目ロード（90秒後）: 300ms（再検証）

**平均ロード時間:**
- キャッシュなし: 300ms
- キャッシュあり: 約100ms（3倍高速化）

#### API呼び出し削減

**シナリオ**: 1000人のユーザーが1時間にLive Scoresページを訪問

**キャッシュなし:**
- API呼び出し: 1000回
- ESPN APIへの負荷: 高

**キャッシュあり（60秒）:**
- API呼び出し: 約60回（1時間 = 60分、1分ごとに1回）
- ESPN APIへの負荷: 94%削減

**コスト削減:**
- API呼び出しが有料の場合、大幅なコスト削減
- ESPN APIの場合、無料だが、過剰なリクエストを防ぐ

## 型安全性フロー

### TypeScriptによる型チェックの流れ

このアプリケーションでは、データが流れる全ての段階で型が定義されています。

```
ESPN API → ESPNScoreboard型 → 変換関数 → Game[]型 → コンポーネントProps → 表示
```

各段階で型が保証されるため、実行時エラーが大幅に減ります。

### ESPNレスポンス → アプリ型 → コンポーネント の変換過程

#### 1. ESPN APIレスポンス（外部型）

```typescript
// src/types/espn.ts
export interface ESPNScoreboard {
  events: ESPNEvent[];
  leagues: ESPNLeague[];
  season: ESPNSeason;
  week: ESPNWeek;
}

export interface ESPNEvent {
  id: string;
  name: string;
  competitions: ESPNCompetition[];
  status: ESPNStatus;
}
```

#### 2. 変換関数

```typescript
// src/lib/api/espn.ts
function convertESPNEventToGame(event: ESPNEvent): Game {
  const competition = event.competitions[0];
  const homeTeam = competition.competitors.find(c => c.homeAway === 'home');
  const awayTeam = competition.competitors.find(c => c.homeAway === 'away');

  return {
    id: event.id,
    homeTeam: { /* ... */ },
    awayTeam: { /* ... */ },
    homeScore: parseInt(homeTeam.score) || null,
    awayScore: parseInt(awayTeam.score) || null,
    status: event.status.type.name,
    // ...
  };
}
```

#### 3. アプリケーション型（内部型）

```typescript
// src/types/nfl.ts
export interface Game {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  date: string;
}
```

#### 4. コンポーネントProps

```typescript
// src/components/scores/ScoreCard.tsx
interface ScoreCardProps {
  game: Game; // 型安全
}

export function ScoreCard({ game }: ScoreCardProps) {
  // game.homeScore は number | null型として扱われる
  // game.invalidField → TypeScriptエラー！
}
```

### なぜ型安全性が重要か

1. **バグの早期発見**: コンパイル時に型エラーを検出
2. **リファクタリングの安全性**: 型が変わると、影響範囲が明確
3. **開発体験の向上**: IDE の自動補完が強力
4. **ドキュメント**: 型定義がコードの意図を伝える

### どのようにエラーを防いでいるか

**例: プロパティの誤字**

```typescript
// エラー例
const score = game.homescore; // TypeScriptエラー: 'homescore' は存在しません
const score = game.homeScore; // OK
```

**例: null チェック**

```typescript
// エラー例
const total = game.homeScore + game.awayScore; // エラー: null の可能性
// 正しい方法
const total = (game.homeScore || 0) + (game.awayScore || 0); // OK
```

**例: 型の不一致**

```typescript
// エラー例
<ScoreCard game="invalid" /> // エラー: string は Game型ではない
<ScoreCard game={gameObject} /> // OK
```

---

**最終更新**: 2026年2月
**対象読者**: エンジニア、AI、技術アーキテクト
