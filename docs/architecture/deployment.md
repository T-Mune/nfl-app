# デプロイメント

このドキュメントでは、NFL Stats Webアプリケーションのデプロイメントアーキテクチャとプロセスについて説明します。

## デプロイメント概要

このアプリケーションは、**Vercel**プラットフォームにデプロイされることを想定して設計されています。VercelはNext.jsの開発元であり、Next.jsアプリケーションのデプロイに最適化されたプラットフォームです。

## Vercel プラットフォーム

### Vercelとは

Vercelは、フロントエンドアプリケーションのためのクラウドプラットフォームです。特にNext.jsアプリケーションに最適化されており、高速なデプロイと優れたパフォーマンスを提供します。

**主な特徴:**
1. **自動デプロイ**: Gitリポジトリと連携し、プッシュと同時に自動デプロイ
2. **エッジネットワーク**: 世界中のエッジロケーションで高速配信
3. **プレビューデプロイ**: プルリクエストごとに自動的にプレビュー環境を作成
4. **自動スケーリング**: トラフィックに応じて自動的にスケールアウト
5. **ゼロ設定**: Next.jsアプリケーションの場合、設定不要で動作

### なぜVercelを選ぶのか

1. **Next.jsとの完璧な統合**:
   - Next.jsの開発元が提供するプラットフォーム
   - Server Components、ISR、Edgeランタイムなどの新機能を完全サポート

2. **優れたパフォーマンス**:
   - 世界中のエッジネットワークで静的ファイルを配信
   - 動的コンテンツもエッジで生成可能

3. **開発体験**:
   - Git連携による自動デプロイ
   - プレビューデプロイによる変更確認が容易
   - デプロイログとエラートラッキング

4. **無料プラン**:
   - 個人プロジェクトや小規模アプリケーションは無料で利用可能
   - 十分なトラフィック制限（月間100GB転送量）

5. **セキュリティ**:
   - 自動HTTPS証明書
   - DDoS保護
   - セキュリティヘッダーの自動設定

## デプロイメントフロー

### 1. GitHubリポジトリとの連携

#### 初回セットアップ

1. **GitHubリポジトリの作成**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/username/nfl-app.git
   git push -u origin main
   ```

2. **Vercelプロジェクトの作成**:
   - Vercelダッシュボードにアクセス
   - 「New Project」をクリック
   - GitHubリポジトリを選択
   - インポートしてデプロイ

3. **自動デプロイの設定**:
   - Vercelが自動的にGitHub Appをインストール
   - main ブランチへのプッシュで本番デプロイ
   - プルリクエストでプレビューデプロイ

### 2. デプロイプロセス

#### mainブランチへのプッシュ（本番デプロイ）

```
開発者 → git push origin main → GitHub → Vercel → 本番環境
```

**ステップ:**
1. コードを main ブランチにプッシュ
2. Vercel が変更を検知
3. ビルドプロセスを自動実行
4. ビルド成功後、本番環境にデプロイ
5. デプロイ完了の通知（Slack、Email等）

**所要時間:** 通常1～3分

#### プルリクエスト（プレビューデプロイ）

```
開発者 → Pull Request → GitHub → Vercel → プレビュー環境
```

**ステップ:**
1. feature ブランチからプルリクエストを作成
2. Vercel が自動的にプレビュー環境をデプロイ
3. PRコメントにプレビューURLが投稿される
4. レビュアーがプレビュー環境で変更を確認
5. マージ後、プレビュー環境は削除される

**利点:**
- 変更内容を本番環境に影響を与えずに確認できる
- レビュアーが実際の動作を確認できる
- 各コミットごとにプレビューURLが生成される

### 3. ビルドプロセス

Vercelは、以下のコマンドを自動的に実行します:

```bash
# 依存関係のインストール
npm install

# 本番ビルド
npm run build

# （デプロイ後）サーバーの起動
npm start
```

#### next build の内訳

```
1. TypeScriptのコンパイル
2. Reactコンポーネントのバンドル
3. ページごとのコード分割
4. 静的ページの事前レンダリング（可能な場合）
5. 画像の最適化
6. CSSの最小化
```

**成果物:**
- `.next/` ディレクトリにビルド成果物が生成される
- Vercelがこれらのファイルをエッジネットワークに配布

## 環境変数

### 環境変数の管理

このアプリケーションでは、ESPN APIからデータを取得しますが、認証が不要なため、環境変数は最小限です。

#### 現在の環境変数

現時点では、環境変数は使用していません（ESPN APIは公開APIのため）。

#### 将来的な環境変数（例）

```bash
# .env.local（ローカル開発用）
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 認証が必要なAPIを使用する場合
ESPN_API_KEY=your_api_key_here
```

### Vercelでの環境変数設定

1. Vercelダッシュボードにアクセス
2. プロジェクトの「Settings」→「Environment Variables」
3. 変数名と値を入力
4. 適用する環境を選択（Production, Preview, Development）
5. 保存後、再デプロイ

**環境の種類:**
- **Production**: 本番環境（main ブランチ）
- **Preview**: プレビュー環境（プルリクエスト）
- **Development**: ローカル開発環境

### 環境変数のベストプラクティス

1. **機密情報はサーバーサイドのみで使用**:
   - クライアントに露出しない（`NEXT_PUBLIC_`プレフィックスなし）
   - Server Componentsやサーバーサイド関数でのみ参照

2. **環境ごとに異なる値を設定**:
   - Production: 本番APIエンドポイント
   - Preview: ステージングAPIエンドポイント
   - Development: ローカルAPIエンドポイント

3. **`.env.local.example`を提供**:
   - 必要な環境変数のテンプレートを作成
   - 実際の値は含めない（Gitコミット対象外）

## ビルド設定

### next.config.ts

Next.jsのビルド設定を定義します。

```typescript
// next.config.ts
const nextConfig = {
  images: {
    domains: ['a.espncdn.com'], // 外部画像ドメインの許可
  },
  // その他の設定
}

export default nextConfig
```

#### 主な設定項目

- **images.domains**: 外部画像の許可ドメイン（ESPN CDN）
- **experimental**: 実験的機能の有効化
- **redirects**: URLリダイレクト設定
- **headers**: カスタムHTTPヘッダー

### ビルド最適化

#### 1. 静的生成（Static Generation）

データフェッチングが不要なページは、ビルド時に静的HTMLとして生成されます。

**例:**
- ページテンプレート（レイアウト）
- エラーページ（404, 500）

#### 2. ISR（Incremental Static Regeneration）

データフェッチングが必要なページは、ISRにより定期的に再生成されます。

```typescript
// fetch() with revalidate
fetch(url, { next: { revalidate: 60 } })
```

**動作:**
1. 初回リクエスト: ページを動的生成してキャッシュ
2. 再検証時間内: キャッシュから配信
3. 再検証時間経過: バックグラウンドで再生成

#### 3. コード分割

ページごとに自動的にJavaScriptを分割し、必要な部分のみをダウンロードします。

**効果:**
- 初期ロードのJavaScriptサイズ削減
- ページ遷移時の高速化

#### 4. Tree Shaking

未使用のコードを自動的に削除します。

**例:**
```typescript
import { format } from 'date-fns' // format関数のみをインポート
// date-fns の他の関数はバンドルに含まれない
```

## 本番環境への最適化

### 1. 自動最適化

Vercelは、Next.jsアプリケーションを自動的に最適化します:

- **圧縮**: Gzip、Brotli圧縮
- **キャッシング**: 静的ファイルの長期キャッシュ
- **HTTP/2**: HTTP/2プロトコルの使用
- **CDN**: エッジネットワークでの配信

### 2. パフォーマンスモニタリング

Vercel Analytics により、以下のメトリクスを監視できます:

- **Real User Monitoring（RUM）**: 実際のユーザー体験を計測
- **Core Web Vitals**: LCP、FID、CLS
- **ページビュー**: トラフィック解析
- **エラー率**: エラー発生率の監視

### 3. エッジ機能

#### Edge Runtime

Next.js の一部の機能は、Vercel Edge Runtime で実行されます:

- **エッジミドルウェア**: リクエストの前処理
- **エッジ関数**: 軽量なサーバーサイド処理

**利点:**
- 超低レイテンシ（ユーザーに近いエッジで実行）
- 自動スケーリング
- グローバル展開

#### Edge Caching

静的ファイルやISRページは、エッジでキャッシュされます:

- **静的ファイル**: JavaScript、CSS、画像
- **ISRページ**: 再検証時間内のページ

## デプロイメント戦略

### 1. カナリアデプロイメント（将来的な実装）

本番環境に段階的にデプロイする戦略:

1. 新バージョンを一部のユーザーにのみ配信
2. 問題がなければ、徐々に配信を拡大
3. 全ユーザーに配信

**Vercelでの実装:**
- カスタムドメインの設定
- トラフィック分割の設定

### 2. ロールバック

デプロイ後に問題が発生した場合、即座にロールバック可能:

1. Vercelダッシュボードで「Deployments」を開く
2. 以前の安定したデプロイメントを選択
3. 「Promote to Production」をクリック

**所要時間:** 数秒～数分

### 3. ブルー・グリーンデプロイメント

Vercelのプレビューデプロイメント機能は、実質的にブルー・グリーンデプロイメントを実現しています:

- **ブルー（現在の本番環境）**: main ブランチのデプロイメント
- **グリーン（新バージョン）**: プルリクエストのプレビューデプロイメント

新バージョンをマージすると、瞬時に本番環境が切り替わります。

## CI/CD パイプライン

### 現在のパイプライン

```
git push → GitHub → Vercel ビルド → デプロイ
```

**ステップ:**
1. コードをGitHubにプッシュ
2. Vercel が変更を検知
3. 自動ビルド開始
4. ビルド成功後、自動デプロイ
5. デプロイ完了通知

### 将来的な拡張（GitHub Actions）

より複雑なCI/CDパイプラインが必要な場合、GitHub Actionsを追加できます:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Run linter
        run: npm run lint
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
```

**追加可能なステップ:**
- ユニットテスト
- E2Eテスト
- セキュリティスキャン
- パフォーマンステスト

## セキュリティ

### HTTPS

Vercelは、全てのデプロイメントに自動的にHTTPS証明書を発行します:

- **Let's Encrypt**: 無料のSSL/TLS証明書
- **自動更新**: 証明書の有効期限前に自動更新
- **強制HTTPS**: HTTPリクエストを自動的にHTTPSにリダイレクト

### セキュリティヘッダー

Vercelは、デフォルトで以下のセキュリティヘッダーを設定します:

- **X-Content-Type-Options**: nosniff
- **X-Frame-Options**: DENY
- **X-XSS-Protection**: 1; mode=block

#### カスタムヘッダーの追加（next.config.ts）

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'",
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ]
  },
}
```

### DDoS 保護

Vercelは、自動的にDDoS攻撃から保護します:

- レート制限
- ボット検出
- トラフィック分析

## モニタリングとログ

### デプロイメントログ

Vercelダッシュボードで、以下のログを確認できます:

- **ビルドログ**: ビルドプロセスの詳細
- **ランタイムログ**: サーバーサイドのログ
- **エラーログ**: エラーの詳細とスタックトレース

### パフォーマンスモニタリング

- **Vercel Analytics**: リアルユーザーモニタリング
- **Web Vitals**: Core Web Vitals の計測
- **カスタムイベント**: 独自のイベントトラッキング

### エラートラッキング（将来的な統合）

エラートラッキングサービスとの統合が可能:

- **Sentry**: エラーモニタリング
- **LogRocket**: セッションリプレイ
- **Datadog**: APM（Application Performance Monitoring）

## トラブルシューティング

### ビルドエラー

**問題:** ビルドが失敗する

**解決策:**
1. ローカルで`npm run build`を実行して、エラーを再現
2. TypeScriptエラーを修正
3. 依存関係のバージョンを確認
4. Vercelのビルドログを確認

### デプロイメント遅延

**問題:** デプロイに時間がかかる

**原因:**
- 依存関係のインストールに時間がかかる
- ビルドプロセスが重い

**解決策:**
- 不要な依存関係を削除
- ビルドキャッシュを有効化（Vercelはデフォルトで有効）

### ランタイムエラー

**問題:** デプロイ後にエラーが発生

**解決策:**
1. Vercelのランタイムログを確認
2. 環境変数が正しく設定されているか確認
3. プレビューデプロイで問題を再現
4. 必要に応じてロールバック

---

**最終更新**: 2026年2月
**対象読者**: エンジニア、AI、技術アーキテクト
