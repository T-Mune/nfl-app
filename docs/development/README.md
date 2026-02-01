# 開発ガイド

このドキュメントでは、NFL Stats Webアプリケーションの開発環境のセットアップとワークフローについて説明します。

## 対象読者

このドキュメントは、以下の方を対象としています:
- **新規開発者**: プロジェクトに参加する開発者
- **コントリビューター**: オープンソースコントリビューター

## 開発環境概要

このプロジェクトは、以下の環境で開発されています:

### 必要な知識

- **JavaScript/TypeScript**: ES6+の構文とTypeScriptの基本
- **React**: Hooks、コンポーネント、Props
- **Next.js**: App Router、Server Components
- **Tailwind CSS**: ユーティリティクラスの基本

### 推奨ツール

- **エディタ**: Visual Studio Code（推奨）
- **ブラウザ**: Chrome（開発ツールが優れている）
- **ターミナル**: iTerm2（Mac）、Windows Terminal（Windows）、任意のターミナル（Linux）

## ドキュメント一覧

### [setup.md](./setup.md)
開発環境のセットアップ手順です。

**内容:**
- Prerequisites（前提条件）
- インストール手順
- 環境変数設定
- ローカル実行
- よくある問題

### [conventions.md](./conventions.md)
コーディング規約とスタイルガイドです。

**内容:**
- ファイル命名規則
- コードスタイル
- コンポーネントルール
- TypeScript規約
- Commitメッセージ規約

### [workflow.md](./workflow.md)
開発ワークフローとベストプラクティスです。

**内容:**
- Gitワークフロー
- ブランチ戦略
- PRプロセス
- デプロイフロー

## クイックスタート

### 1. リポジトリのクローン

```bash
git clone https://github.com/your-username/nfl-app.git
cd nfl-app
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

### 4. ビルドの確認

```bash
npm run build
```

## 開発コマンド

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | 本番ビルドを作成 |
| `npm start` | 本番サーバーを起動 |
| `npm run lint` | ESLintでコードをチェック |

## プロジェクト構造の理解

### ディレクトリ構造

```
src/
├── app/           # Next.js App Router（ページ）
├── components/    # Reactコンポーネント
├── lib/           # ユーティリティとAPI
└── types/         # TypeScript型定義
```

### ファイルの役割

- **`page.tsx`**: ページコンポーネント（ルートに対応）
- **`layout.tsx`**: レイアウトコンポーネント（共通レイアウト）
- **`*.tsx`**: Reactコンポーネント
- **`*.ts`**: ユーティリティ関数、API統合、型定義

## 開発フロー

### 新機能の追加

1. 新しいブランチを作成
2. 機能を実装
3. Lintを実行して確認
4. ビルドを実行して確認
5. Commitしてプッシュ
6. プルリクエストを作成

### バグ修正

1. Issue を確認
2. 修正ブランチを作成
3. バグを修正
4. 動作確認
5. Commitしてプッシュ
6. プルリクエストを作成

## トラブルシューティング

### よくある問題

**問題: `npm install` が失敗する**

解決策:
```bash
# node_modules と package-lock.json を削除
rm -rf node_modules package-lock.json

# 再インストール
npm install
```

**問題: ビルドエラーが発生する**

解決策:
```bash
# TypeScriptエラーを確認
npm run build

# エラーメッセージを読んで修正
```

**問題: ポート3000が既に使用されている**

解決策:
```bash
# 別のポートで起動
PORT=3001 npm run dev
```

## ヘルプとサポート

- **ドキュメント**: `docs/` ディレクトリの各種ドキュメント
- **Issues**: GitHubのIssuesで質問や報告
- **コードレビュー**: プルリクエストでフィードバックを受ける

## 次のステップ

1. [setup.md](./setup.md) で開発環境をセットアップ
2. [conventions.md](./conventions.md) でコーディング規約を確認
3. [workflow.md](./workflow.md) で開発ワークフローを理解

---

**最終更新**: 2026年2月
**対象読者**: 新規開発者、コントリビューター
