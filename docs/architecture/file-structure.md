# ファイル構造

このドキュメントでは、NFL Stats Webアプリケーションのディレクトリ構造とファイル組織について説明します。

## プロジェクトルート構造

```
nfl-app/
├── src/                      # ソースコード
├── public/                   # 静的ファイル（画像、フォント等）
├── docs/                     # プロジェクトドキュメント
├── node_modules/             # npmパッケージ（Git管理外）
├── .next/                    # Next.jsビルド成果物（Git管理外）
├── package.json              # プロジェクト設定と依存関係
├── tsconfig.json             # TypeScript設定
├── tailwind.config.js        # Tailwind CSS設定
├── next.config.ts            # Next.js設定
├── postcss.config.mjs        # PostCSS設定
├── eslint.config.mjs         # ESLint設定
├── .gitignore                # Git除外ファイルリスト
├── .env.local.example        # 環境変数のサンプル
└── README.md                 # プロジェクト概要
```

## srcディレクトリ構造

`src/`ディレクトリには、アプリケーションの全てのソースコードが含まれます。

```
src/
├── app/                      # Next.js App Router（ページとレイアウト）
│   ├── layout.tsx            # ルートレイアウト（全ページ共通）
│   ├── page.tsx              # ホームページ（Live Scores）
│   ├── news/                 # ニュースページ
│   │   └── page.tsx
│   ├── schedule/             # スケジュールページ
│   │   └── page.tsx
│   ├── standings/            # 順位表ページ
│   │   └── page.tsx
│   ├── teams/                # チーム関連ページ
│   │   ├── page.tsx          # チーム一覧
│   │   └── [teamId]/         # 動的ルート（チーム詳細）
│   │       └── page.tsx
│   └── players/              # 選手検索ページ（今後追加予定）
│       └── page.tsx
│
├── components/               # Reactコンポーネント
│   ├── layout/               # レイアウトコンポーネント
│   │   ├── Header.tsx        # ヘッダーナビゲーション
│   │   └── Footer.tsx        # フッター
│   ├── providers/            # コンテキストプロバイダー
│   │   └── QueryProvider.tsx # React Query プロバイダー
│   ├── scores/               # スコア表示関連コンポーネント
│   │   ├── ScoreCard.tsx     # 個別試合カード
│   │   ├── ScoresList.tsx    # 試合リスト
│   │   └── WeekSelector.tsx  # 週選択UI
│   ├── news/                 # ニュース関連コンポーネント
│   │   ├── NewsCard.tsx      # ニュース記事カード
│   │   └── NewsList.tsx      # ニュース記事リスト
│   ├── schedule/             # スケジュール関連コンポーネント
│   │   └── WeekSelector.tsx  # 週タブ選択
│   ├── standings/            # 順位表関連コンポーネント
│   │   ├── StandingsSelector.tsx    # 表示モード切り替え
│   │   ├── OverallTable.tsx         # 全体順位表
│   │   ├── ConferenceView.tsx       # カンファレンス別表示
│   │   └── DivisionView.tsx         # ディビジョン別表示
│   └── ui/                   # 汎用UIコンポーネント（shadcn/ui）
│       ├── card.tsx          # カードコンテナ
│       ├── badge.tsx         # バッジ・ラベル
│       ├── button.tsx        # ボタン
│       ├── table.tsx         # テーブル
│       ├── tabs.tsx          # タブナビゲーション
│       ├── select.tsx        # セレクトボックス
│       └── sheet.tsx         # スライドインメニュー
│
├── lib/                      # ユーティリティとヘルパー関数
│   ├── api/                  # API統合
│   │   ├── espn.ts           # ESPN API クライアント
│   │   └── sportsdata.ts     # SportsData.io API（旧バージョン、非使用）
│   ├── utils.ts              # 汎用ユーティリティ関数
│   └── nfl-divisions.ts      # NFLディビジョン定義
│
├── types/                    # TypeScript型定義
│   ├── nfl.ts                # NFLドメイン型（Game, Team, Standingなど）
│   └── espn.ts               # ESPN APIレスポンス型
│
└── app/globals.css           # グローバルCSS（Tailwind設定含む）
```

## app/ディレクトリ（ルーティング）

`app/`ディレクトリは、Next.js 16の App Router を使用してページとルーティングを定義します。ファイルシステムベースのルーティングにより、ディレクトリ構造がそのままURLに対応します。

### ルーティングマップ

| ファイルパス | URL | ページ名 | 説明 |
|-------------|-----|---------|------|
| `app/page.tsx` | `/` | Home（Live Scores） | トップページ、ライブスコア表示 |
| `app/news/page.tsx` | `/news` | News | NFLニュース一覧 |
| `app/schedule/page.tsx` | `/schedule` | Schedule | 試合スケジュール |
| `app/standings/page.tsx` | `/standings` | Standings | 順位表 |
| `app/teams/page.tsx` | `/teams` | Teams | チーム一覧 |
| `app/teams/[teamId]/page.tsx` | `/teams/:teamId` | Team Detail | チーム詳細・ロスター |
| `app/players/page.tsx` | `/players` | Players | 選手検索（今後追加予定） |

### ルートレイアウト（app/layout.tsx）

全ページで共通のレイアウトを定義します:
- HTMLドキュメントのルート構造
- メタデータ設定（タイトル、description）
- グローバルスタイル（`globals.css`）のインポート
- ヘッダーとフッターの配置
- React Query プロバイダーの設定

```tsx
// 簡略化した例
export default function RootLayout({ children }: { children: React.Node }) {
  return (
    <html>
      <body>
        <QueryProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  )
}
```

### 動的ルート（app/teams/[teamId]/page.tsx）

`[teamId]`のように角括弧で囲まれたディレクトリは、動的ルート（Dynamic Route）を表します:
- `/teams/KC` → `teamId = "KC"`
- `/teams/SF` → `teamId = "SF"`
- `/teams/NE` → `teamId = "NE"`

パラメータは、ページコンポーネントの`params` Propsとして受け取ります。

## components/ディレクトリ（コンポーネント）

`components/`ディレクトリは、機能別にサブディレクトリで整理されています。

### 組織化の原則

1. **layout/**: ページレイアウト関連（Header, Footer）
2. **providers/**: コンテキストプロバイダー
3. **[feature]/**: 機能別コンポーネント（scores, news, schedule, standings）
4. **ui/**: 汎用UIコンポーネント（shadcn/ui）

### Server vs Client Components

ファイル先頭の`'use client'`ディレクティブの有無で区別されます:

**Server Components（デフォルト）:**
- `ScoresList.tsx`
- `NewsList.tsx`
- `OverallTable.tsx`など

**Client Components（`'use client'`あり）:**
- `Header.tsx`（ナビゲーション状態管理）
- `WeekSelector.tsx`（週選択UI）
- `StandingsSelector.tsx`（タブ切り替え）
- `ui/`以下の全てのコンポーネント

### コンポーネント命名規則

- **PascalCase**: コンポーネント名（例: `ScoreCard.tsx`）
- **単数形**: 単一のアイテムを表示するコンポーネント（例: `NewsCard`）
- **複数形**: リストを表示するコンポーネント（例: `NewsList`）
- **Selector/View**: インタラクティブなUI（例: `WeekSelector`, `ConferenceView`）

## lib/ディレクトリ（ライブラリ）

`lib/`ディレクトリには、ビジネスロジックとユーティリティ関数が含まれます。

### api/ディレクトリ

APIクライアントを定義します:

#### espn.ts

ESPN APIとの統合を担当します。

**主な関数:**
- `getScoresByWeek()`: 指定週の試合スコアを取得
- `getLiveScores()`: 現在進行中の試合を取得
- `getStandings()`: 順位表を取得
- `getTeams()`: チーム一覧を取得
- `getTeamRoster()`: チームロスターを取得
- `getNews()`: ニュース記事を取得

**ヘルパー関数:**
- `getCurrentSeason()`: 現在のシーズン年を取得
- `getSeasonWeeks()`: シーズンタイプごとの週数を取得
- `formatGameDate()`: 試合日時をフォーマット
- `formatNewsDate()`: ニュース公開日時をフォーマット
- `groupStandingsByDivision()`: 順位表をディビジョン別にグループ化

**型変換:**
- ESPN APIレスポンス型 → アプリケーションドメイン型への変換
- 例: `ESPNScoreboard` → `Game[]`

#### sportsdata.ts

旧バージョンで使用していたSportsData.io APIクライアントです（現在は非使用）。

### utils.ts

汎用ユーティリティ関数を定義します。

**主な関数:**
```typescript
// クラス名結合ユーティリティ
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### nfl-divisions.ts

NFLチームのカンファレンスとディビジョン情報を定義します。

**データ構造:**
```typescript
export const NFL_DIVISIONS: Record<string, { conference: string; division: string }> = {
  KC: { conference: 'AFC', division: 'West' },
  SF: { conference: 'NFC', division: 'West' },
  // ...
}
```

## types/ディレクトリ（型定義）

`types/`ディレクトリには、TypeScript型定義が集中管理されています。

### nfl.ts

アプリケーションドメインの型を定義します。

**主な型:**
```typescript
export interface Game {
  id: string
  homeTeam: Team
  awayTeam: Team
  homeScore: number | null
  awayScore: number | null
  status: string
  date: string
  // ...
}

export interface Team {
  Key: string
  FullName: string
  City: string
  WikipediaLogoURL?: string
  Conference?: string
  Division?: string
  // ...
}

export interface Standing {
  teamId: string
  teamName: string
  wins: number
  losses: number
  ties: number
  winPercentage: number
  // ...
}

export interface NewsArticle {
  id: string
  headline: string
  description: string
  articleUrl: string
  imageUrl?: string
  publishedDate: string
  // ...
}
```

### espn.ts

ESPN APIのレスポンス型を定義します。

**主な型:**
```typescript
export interface ESPNScoreboard {
  events: ESPNEvent[]
  leagues: ESPNLeague[]
  season: ESPNSeason
  week: ESPNWeek
}

export interface ESPNEvent {
  id: string
  name: string
  competitions: ESPNCompetition[]
  status: ESPNStatus
  // ...
}
```

## docsディレクトリ（ドキュメント）

`docs/`ディレクトリには、プロジェクトのドキュメントが含まれます。

```
docs/
├── user-guide/               # 非エンジニア向けガイド
│   ├── README.md
│   ├── 01-live-scores.md
│   ├── 02-news.md
│   ├── 03-schedule.md
│   ├── 04-standings.md
│   ├── 05-teams.md
│   └── 06-team-detail.md
├── architecture/             # システムアーキテクチャ
│   ├── README.md
│   ├── tech-stack.md
│   ├── file-structure.md (このファイル)
│   ├── data-flow.md
│   ├── rendering.md
│   ├── styling.md
│   └── deployment.md
├── pages/                    # ページ実装ドキュメント
├── components/               # コンポーネント実装ドキュメント
├── api/                      # API統合ドキュメント
└── development/              # 開発者ガイド
```

## 設定ファイル

### package.json

プロジェクトのメタデータと依存関係を定義します。

**主なセクション:**
- `name`, `version`: プロジェクト名とバージョン
- `scripts`: npmコマンド（dev, build, start, lint）
- `dependencies`: 本番環境の依存関係
- `devDependencies`: 開発環境の依存関係

### tsconfig.json

TypeScriptコンパイラの設定を定義します。

**主な設定:**
- `compilerOptions.strict`: 厳格な型チェック有効
- `compilerOptions.paths`: パスエイリアス（`@/*` → `src/*`）
- `compilerOptions.jsx`: React JSX のサポート
- `include`: コンパイル対象のファイル
- `exclude`: コンパイル除外ファイル（`node_modules`, `.next`）

### tailwind.config.js

Tailwind CSSの設定を定義します。

**主な設定:**
- `content`: Tailwindクラスをスキャンするファイルパターン
- `theme.extend`: カスタムテーマ（色、フォント、スペーシング）
- `plugins`: Tailwindプラグイン

### next.config.ts

Next.jsの設定を定義します。

**主な設定:**
- `images.domains`: 外部画像の許可ドメイン
- `experimental`: 実験的機能の有効化

## ファイル命名規則

### ディレクトリ

- **小文字 + ハイフン**: 複数単語のディレクトリ（例: `user-guide`）
- **小文字**: 単一単語のディレクトリ（例: `app`, `components`）

### ファイル

- **PascalCase**: Reactコンポーネント（例: `ScoreCard.tsx`）
- **camelCase**: ユーティリティ・API（例: `espn.ts`, `utils.ts`）
- **kebab-case**: ドキュメント（例: `01-live-scores.md`）
- **小文字**: 設定ファイル（例: `package.json`, `tsconfig.json`）

## インポートパスエイリアス

`@/`エイリアスを使用して、`src/`ディレクトリからの絶対パスでインポートできます。

```typescript
// 相対パス（避ける）
import { cn } from '../../../lib/utils'

// 絶対パス（推奨）
import { cn } from '@/lib/utils'
```

**設定箇所:**
- `tsconfig.json`: `compilerOptions.paths`
- Next.js が自動的にサポート

## Git管理対象外ファイル

`.gitignore`により、以下のファイル・ディレクトリはGit管理対象外です:

- `node_modules/`: npmパッケージ
- `.next/`: Next.jsビルド成果物
- `.env.local`: 環境変数（機密情報）
- `dist/`, `build/`: ビルド成果物
- `.DS_Store`: macOSシステムファイル

## ベストプラクティス

### ファイル配置

1. **ページ**: `app/`ディレクトリに配置
2. **再利用可能なコンポーネント**: `components/`ディレクトリに配置
3. **ビジネスロジック**: `lib/`ディレクトリに配置
4. **型定義**: `types/`ディレクトリに配置

### コンポーネント分割

1. **100行以上のコンポーネント**: 小さなサブコンポーネントに分割
2. **重複するUI**: 汎用コンポーネントとして`components/ui/`に抽出
3. **機能別グループ**: 関連するコンポーネントを同じディレクトリにまとめる

### インポート順序

```typescript
// 1. 外部ライブラリ
import { useState } from 'react'
import Link from 'next/link'

// 2. 内部モジュール（@/エイリアス）
import { cn } from '@/lib/utils'
import { Team } from '@/types/nfl'

// 3. UIコンポーネント
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
```

---

**最終更新**: 2026年2月
**対象読者**: エンジニア、AI、技術アーキテクト
