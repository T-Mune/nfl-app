# セットアップ手順

このドキュメントでは、開発環境のセットアップ手順を説明します。

## Prerequisites（前提条件）

### Node.js

**必須バージョン**: Node.js 20以上

**インストール確認:**
```bash
node --version
# v20.x.x 以上であることを確認
```

**インストール方法:**
- 公式サイト: https://nodejs.org/
- nvm（推奨）: https://github.com/nvm-sh/nvm

```bash
# nvmを使用する場合
nvm install 20
nvm use 20
```

### npm

Node.jsに同梱されています。

**インストール確認:**
```bash
npm --version
# v10.x.x 以上であることを確認
```

### Git

**インストール確認:**
```bash
git --version
```

**インストール方法:**
- 公式サイト: https://git-scm.com/

## インストール手順

### 1. リポジトリのクローン

```bash
# HTTPSでクローン
git clone https://github.com/your-username/nfl-app.git

# または SSHでクローン
git clone git@github.com:your-username/nfl-app.git

# プロジェクトディレクトリに移動
cd nfl-app
```

### 2. 依存関係のインストール

```bash
npm install
```

**所要時間**: 約1～3分（ネットワーク速度による）

**インストールされるパッケージ:**
- Next.js 16.1.6
- React 19.2.3
- TypeScript 5
- Tailwind CSS v4
- その他の依存関係（約20パッケージ）

### 3. 開発サーバーの起動

```bash
npm run dev
```

**出力例:**
```
▲ Next.js 16.1.6
- Local:        http://localhost:3000
- Network:      http://192.168.1.x:3000

✓ Ready in 1.5s
```

### 4. ブラウザで確認

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

**期待される動作:**
- Live Scoresページが表示される
- 試合データが読み込まれる（ESPN APIから）
- ヘッダーナビゲーションが機能する

## 環境変数設定

### 現在の環境変数

このプロジェクトでは、**環境変数は不要**です（ESPN APIは認証不要のため）。

### 将来的に環境変数が必要な場合

`.env.local` ファイルを作成します:

```bash
# .env.local.example をコピー
cp .env.local.example .env.local
```

`.env.local` の例:
```bash
# 将来的なAPI認証が必要な場合
# ESPN_API_KEY=your_api_key_here

# アプリケーションURL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**注意:**
- `.env.local` はGit管理対象外（`.gitignore`に含まれる）
- `NEXT_PUBLIC_` プレフィックスは、クライアントサイドで使用可能な変数

## ローカル実行

### 開発モード

```bash
npm run dev
```

**特徴:**
- ホットリロード（ファイル変更時に自動更新）
- 詳細なエラーメッセージ
- ソースマップ有効

**ポート変更:**
```bash
PORT=3001 npm run dev
```

### 本番モード（ローカル）

```bash
# ビルド
npm run build

# 本番サーバーを起動
npm start
```

**特徴:**
- 最適化されたバンドル
- ソースマップなし
- 高速なパフォーマンス

## よくある問題

### 問題1: `npm install` が失敗する

**エラー例:**
```
npm ERR! code ENOENT
npm ERR! syscall open
```

**解決策:**
```bash
# キャッシュをクリア
npm cache clean --force

# node_modules と package-lock.json を削除
rm -rf node_modules package-lock.json

# 再インストール
npm install
```

### 問題2: ポート3000が既に使用されている

**エラー例:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**解決策:**
```bash
# 方法1: 別のポートを使用
PORT=3001 npm run dev

# 方法2: ポート3000を使用しているプロセスを終了
# Macの場合
lsof -ti:3000 | xargs kill

# Windowsの場合
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### 問題3: TypeScriptエラーが表示される

**エラー例:**
```
Type error: Cannot find module '@/lib/utils'
```

**解決策:**
```bash
# TypeScript設定を確認
cat tsconfig.json

# パスエイリアスが正しく設定されているか確認
# "@/*": ["./src/*"]
```

### 問題4: Tailwind CSSのスタイルが適用されない

**解決策:**
```bash
# サーバーを再起動
# Ctrl+C で停止
npm run dev

# ブラウザのキャッシュをクリア
# Ctrl+Shift+R（Windows/Linux）
# Cmd+Shift+R（Mac）
```

### 問題5: ESPN APIからデータが取得できない

**症状:**
- "Failed to load scores" エラーが表示される

**原因:**
- ネットワーク接続の問題
- ESPN APIの一時的な障害

**解決策:**
```bash
# ネットワーク接続を確認
ping google.com

# ブラウザの開発者ツールでネットワークタブを確認
# ESPN APIへのリクエストが成功しているか確認
```

## エディタ設定（Visual Studio Code）

### 推奨拡張機能

以下の拡張機能をインストールすることを推奨します:

1. **ESLint** (`dbaeumer.vscode-eslint`)
   - コードの品質チェック

2. **Prettier - Code formatter** (`esbenp.prettier-vscode`)
   - コードの自動フォーマット

3. **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
   - Tailwindクラスの自動補完

4. **TypeScript Vue Plugin (Volar)** (`Vue.volar`)
   - TypeScriptの型チェック強化

### VS Code設定

`.vscode/settings.json` を作成:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

## 動作確認

### 1. ページの表示確認

以下のURLにアクセスして、各ページが正常に表示されることを確認:

- http://localhost:3000/ - Live Scores
- http://localhost:3000/news - News
- http://localhost:3000/schedule - Schedule
- http://localhost:3000/standings - Standings
- http://localhost:3000/teams - Teams
- http://localhost:3000/teams/KC - Team Detail（Kansas City Chiefs）

### 2. Lintの実行

```bash
npm run lint
```

**期待される出力:**
```
✓ No ESLint warnings or errors
```

### 3. ビルドの実行

```bash
npm run build
```

**期待される出力:**
```
▲ Next.js 16.1.6

✓ Creating an optimized production build
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (7/7)
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    1.23 kB        123 kB
├ ○ /news                                987 B          122 kB
├ ○ /schedule                            1.1 kB         123 kB
├ ○ /standings                           1.05 kB        123 kB
├ ○ /teams                               1.15 kB        123 kB
└ ○ /teams/[teamId]                      1.2 kB         123 kB

○  (Static)  automatically rendered as static HTML
```

## 次のステップ

セットアップが完了したら:

1. [conventions.md](./conventions.md) でコーディング規約を確認
2. [workflow.md](./workflow.md) で開発ワークフローを理解
3. 実際にコードを書き始める

---

**最終更新**: 2026年2月
