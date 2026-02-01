# NFL Stats - Live Scores & Statistics

NFL Stats Webアプリケーションは、NFLの試合情報をリアルタイムで提供するモダンなWebアプリケーションです。ESPN APIをデータソースとして、試合スコア、ニュース、スケジュール、順位表、チーム情報を一つのプラットフォームで閲覧できます。

## What is This?

This is a modern web application that provides real-time NFL game information, including live scores, news, schedules, standings, and team rosters. Built with Next.js 16 and powered by ESPN's API, it delivers a fast, responsive, and user-friendly experience across all devices.

NFL Stats Webアプリケーションは、アメリカンフットボール（NFL）の最新情報を提供するWebサイトです。試合のライブスコア、ニュース記事、試合スケジュール、チーム順位表、ロスター情報などを、スマートフォン、タブレット、デスクトップで快適に閲覧できます。

## Features

### ユーザー向け機能

- **📊 Live Scores** - リアルタイムの試合スコアと状態表示
  - 進行中の試合を約60秒ごとに自動更新
  - クォーター別の得点内訳
  - 週・シーズンタイプの切り替え

- **📰 Latest NFL News** - 最新のNFL関連ニュース記事
  - ESPN提供の記事を約30秒ごとに更新
  - チーム・選手別のカテゴリバッジ
  - プレミアム記事の識別

- **📅 Weekly Schedule** - シーズン全体の試合スケジュール
  - プレシーズン、レギュラーシーズン、ポストシーズン対応
  - 週タブによる簡単な切り替え

- **🏆 Standings** - チーム順位表
  - 全体順位、カンファレンス別、ディビジョン別の3つの表示モード
  - 詳細な成績情報（勝敗、勝率、得失点差など）

- **🏈 Team Rosters** - 全32チームの選手名簿
  - ポジション別にグループ化された選手情報
  - 背番号、身長、体重、経験年数、出身大学などの詳細

- **📱 Responsive Design** - 全デバイス対応
  - モバイルファースト設計
  - スマートフォン、タブレット、デスクトップで最適化された表示

## Technology Stack

### Core Framework

- **Next.js 16.1.6** - React ベースのフルスタックフレームワーク（App Router）
- **React 19.2.3** - UIライブラリ
- **TypeScript 5** - 静的型付けによる安全性向上

### Styling & UI

- **Tailwind CSS v4** - ユーティリティファーストのCSSフレームワーク
- **shadcn/ui** - 再利用可能なUIコンポーネントライブラリ
- **Radix UI** - アクセシブルなUIプリミティブ

### Data & State Management

- **@tanstack/react-query 5.90.20** - サーバーステート管理
- **ESPN API** - NFLデータソース（公開API）

### Development Tools

- **ESLint 9** - コード品質管理
- **PostCSS** - CSS変換ツール

## Quick Start

### Prerequisites

- **Node.js** 20以上
- **npm** または **yarn**

### Installation

```bash
# リポジトリをクローン
git clone https://github.com/your-username/nfl-app.git
cd nfl-app

# 依存関係をインストール
npm install
```

### Local Development

```bash
# 開発サーバーを起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

### Build for Production

```bash
# 本番ビルド
npm run build

# 本番サーバーを起動
npm start
```

## Project Structure

```
nfl-app/
├── src/
│   ├── app/                   # Next.js App Router ページ
│   │   ├── page.tsx           # Home - Live Scores
│   │   ├── news/              # News ページ
│   │   ├── schedule/          # Schedule ページ
│   │   ├── standings/         # Standings ページ
│   │   └── teams/             # Teams & Team Detail ページ
│   ├── components/            # Reactコンポーネント
│   │   ├── layout/            # Header, Footer
│   │   ├── scores/            # スコア表示コンポーネント
│   │   ├── news/              # ニュース表示コンポーネント
│   │   ├── standings/         # 順位表表示コンポーネント
│   │   └── ui/                # shadcn/uiコンポーネント
│   ├── lib/                   # ユーティリティ
│   │   └── api/               # API統合
│   │       └── espn.ts        # ESPN API クライアント
│   └── types/                 # TypeScript型定義
│       ├── nfl.ts             # アプリケーションドメイン型
│       └── espn.ts            # ESPN APIレスポンス型
├── docs/                      # プロジェクトドキュメント
│   ├── user-guide/            # 非エンジニア向けガイド
│   ├── architecture/          # システムアーキテクチャ
│   ├── pages/                 # ページ実装ドキュメント
│   ├── components/            # コンポーネント実装ドキュメント
│   ├── api/                   # API統合ドキュメント
│   └── development/           # 開発者ガイド
├── public/                    # 静的ファイル
├── package.json               # プロジェクト設定
├── tsconfig.json              # TypeScript設定
├── tailwind.config.js         # Tailwind CSS設定
└── next.config.ts             # Next.js設定
```

## Documentation

包括的なドキュメントが `docs/` ディレクトリに用意されています。

### 📚 For All Users

- **[docs/user-guide/](./docs/user-guide/README.md)** - アプリケーションの使い方
  - 各ページの機能説明
  - ステップバイステップガイド
  - よくある質問（FAQ）

### 🏗️ For Developers

- **[docs/architecture/](./docs/architecture/README.md)** - システムアーキテクチャ
  - テクノロジースタック
  - ファイル構造
  - データフロー
  - レンダリング戦略
  - スタイリング
  - デプロイメント

- **[docs/pages/](./docs/pages/README.md)** - ページ実装ドキュメント
  - 各ページの技術実装
  - データフェッチング
  - コンポーネント階層

- **[docs/components/](./docs/components/README.md)** - コンポーネント実装
  - 各コンポーネントの詳細
  - Server vs Client Components
  - Props とデータフロー

- **[docs/api/](./docs/api/README.md)** - API統合
  - ESPN API エンドポイント
  - データ型定義
  - ヘルパー関数

- **[docs/development/](./docs/development/README.md)** - 開発ガイド
  - セットアップ手順
  - コーディング規約
  - ワークフロー

## Key Architecture Decisions

### Server-First Architecture

このアプリケーションは、Next.js 16の **Server Components** を主要なレンダリング手法として採用しています。

**利点:**
- **高速な初期ロード**: サーバーで生成されたHTMLが即座に配信される
- **SEO最適化**: 検索エンジンが完全なHTMLを受け取る
- **セキュリティ**: API キーなどの機密情報がクライアントに露出しない
- **パフォーマンス**: JavaScriptバンドルサイズの削減

### Type Safety with TypeScript

全てのコードにTypeScript型定義を適用し、コンパイル時にバグを検出します。

### Progressive Enhancement

基本機能は全てのデバイスで動作し、高性能デバイスではさらに高度な機能が有効になります。

### Caching Strategy

ESPN APIからのデータを適切にキャッシュ（30秒～300秒）し、パフォーマンスとAPI呼び出し削減を実現しています。

## Deployment

### Vercel（推奨）

このアプリケーションは、Vercelへのデプロイに最適化されています。

1. GitHubリポジトリをVercelにインポート
2. 自動的にビルドとデプロイが実行されます
3. mainブランチへのプッシュで自動デプロイ

詳細は [docs/architecture/deployment.md](./docs/architecture/deployment.md) をご覧ください。

### 環境変数

現在、環境変数は不要です（ESPN APIは認証不要のため）。

## Performance Highlights

- **初期ロード**: Server Components により、初期HTMLが即座に配信
- **段階的ロード**: Suspense により、データの準備ができた部分から順次表示
- **キャッシング**: ISRにより、2回目以降のアクセスが高速化
- **コード分割**: ルートごとに自動的にJavaScriptを分割

## Browser Support

- Chrome（最新版）
- Firefox（最新版）
- Safari（最新版）
- Edge（最新版）

## Contributing

コントリビューションを歓迎します。プルリクエストを送る前に、以下を確認してください:

1. `npm run lint` でコードスタイルをチェック
2. `npm run build` でビルドが成功することを確認
3. 変更内容を明確に記述したコミットメッセージ

## License

このプロジェクトはMITライセンスの下で公開されています。

## Acknowledgments

- **ESPN** - データ提供
- **Next.js Team** - 素晴らしいフレームワーク
- **shadcn** - 美しいUIコンポーネント
- **Vercel** - ホスティングプラットフォーム

## Contact

質問や提案がある場合は、GitHubのIssuesでお知らせください。

---

**Built with ❤️ using Next.js 16 and React 19**
