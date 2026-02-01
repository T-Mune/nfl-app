# 開発ワークフロー

このドキュメントでは、プロジェクトの開発ワークフローとベストプラクティスを説明します。

## Gitワークフロー

### ブランチ戦略

このプロジェクトは、**GitHub Flow**を採用しています。

```
main (本番環境)
  ↑
  └─ feature/add-player-search (機能追加)
  └─ fix/score-card-bug (バグ修正)
  └─ docs/update-readme (ドキュメント更新)
```

### ブランチ命名規則

```
<type>/<brief-description>
```

**Type:**
- `feature/` - 新機能の追加
- `fix/` - バグ修正
- `refactor/` - リファクタリング
- `docs/` - ドキュメントのみの変更
- `chore/` - ビルドプロセスやツールの変更

**例:**
```bash
feature/add-player-search
fix/score-card-null-error
refactor/extract-api-client
docs/update-setup-guide
chore/update-dependencies
```

## 開発フロー

### 1. Issueの確認

作業を開始する前に、関連するIssueを確認または作成します。

**Issueの作成例:**
```markdown
**Title:** Add player search functionality

**Description:**
Add a search feature to find players by name across all teams.

**Acceptance Criteria:**
- [ ] Search input in header
- [ ] Real-time search results
- [ ] Navigate to player detail page
```

### 2. ブランチの作成

```bash
# mainブランチから最新を取得
git checkout main
git pull origin main

# 新しいブランチを作成
git checkout -b feature/add-player-search
```

### 3. 開発

#### 開発サーバーの起動

```bash
npm run dev
```

#### コードの作成

1. 必要なファイルを作成・編集
2. 定期的にLintを実行
3. 動作確認

```bash
# Lintチェック
npm run lint

# ビルド確認
npm run build
```

### 4. コミット

```bash
# 変更をステージング
git add src/app/players/page.tsx
git add src/components/players/PlayerSearch.tsx

# コミット
git commit -m "feat: add player search functionality

- Add PlayerSearch component
- Add /players page
- Implement real-time search with debouncing"
```

**コミットのベストプラクティス:**
- 小さく、論理的なまとまりでコミット
- 意味のあるコミットメッセージ
- 1つのコミットで1つの変更

### 5. プッシュ

```bash
git push origin feature/add-player-search
```

## プルリクエスト（PR）プロセス

### PRの作成

GitHubでプルリクエストを作成します。

**PRテンプレート:**
```markdown
## 概要
プレイヤー検索機能を追加しました。

## 変更内容
- PlayerSearchコンポーネントの追加
- /playersページの作成
- リアルタイム検索機能（debouncing付き）

## スクリーンショット
（可能であればスクリーンショットを添付）

## テスト方法
1. http://localhost:3000/players にアクセス
2. 検索ボックスにプレイヤー名を入力
3. 検索結果が表示されることを確認

## チェックリスト
- [x] Lintエラーなし
- [x] ビルドエラーなし
- [x] 動作確認済み
- [x] ドキュメント更新（必要な場合）
```

### PRのレビュー

#### レビュアーの確認事項

- [ ] コードが規約に従っているか
- [ ] テストが追加されているか（該当する場合）
- [ ] ドキュメントが更新されているか（必要な場合）
- [ ] パフォーマンスへの影響はないか
- [ ] セキュリティ上の問題はないか

#### レビューコメントへの対応

```bash
# レビューコメントを受けて修正
git add src/components/players/PlayerSearch.tsx
git commit -m "fix: address review comments

- Improve error handling
- Add loading state
- Fix TypeScript errors"

# プッシュ
git push origin feature/add-player-search
```

### マージ

レビュー承認後、PRをマージします。

**マージ方法:**
- **Squash and merge**（推奨）: 複数のコミットを1つにまとめる
- **Merge commit**: 全てのコミット履歴を保持
- **Rebase and merge**: 線形の履歴を保持

```bash
# マージ後、ローカルのmainブランチを更新
git checkout main
git pull origin main

# 作業ブランチを削除
git branch -d feature/add-player-search
```

## デプロイフロー

### 自動デプロイ（Vercel）

mainブランチへのマージで自動デプロイされます。

```
PR マージ → GitHub → Vercel ビルド → デプロイ完了
```

**デプロイプロセス:**
1. Vercelが変更を検知
2. 自動的にビルド開始
3. ビルド成功後、本番環境にデプロイ
4. デプロイ完了の通知

**所要時間:** 約1～3分

### プレビューデプロイ

プルリクエストごとに自動的にプレビュー環境が作成されます。

**URL例:**
```
https://nfl-app-pr-123.vercel.app
```

**利点:**
- 本番環境に影響を与えずに変更を確認
- レビュアーが実際の動作を確認できる

## ホットフィックスフロー

本番環境で緊急のバグが発見された場合:

### 1. ホットフィックスブランチの作成

```bash
git checkout main
git pull origin main
git checkout -b fix/critical-score-display-bug
```

### 2. 修正とテスト

```bash
# バグを修正
# 動作確認

# コミット
git commit -m "fix: resolve critical bug in score display

The home and away scores were swapped in ScoreCard component.
This fix corrects the display order."
```

### 3. プッシュとPR

```bash
git push origin fix/critical-score-display-bug
```

PRを作成し、**緊急**であることを明記します。

### 4. 迅速なレビューとマージ

レビュアーは優先的にレビューし、承認後すぐにマージします。

### 5. 自動デプロイ

マージ後、Vercelが自動的に本番環境にデプロイします。

## リリースフロー

### バージョニング

このプロジェクトは、Semantic Versioning（セマンティックバージョニング）を使用します。

**フォーマット:** `MAJOR.MINOR.PATCH`

- **MAJOR**: 破壊的変更
- **MINOR**: 新機能追加（後方互換性あり）
- **PATCH**: バグ修正

**例:**
- `1.0.0` → `1.0.1`: バグ修正
- `1.0.1` → `1.1.0`: 新機能追加
- `1.1.0` → `2.0.0`: 破壊的変更

### リリースプロセス

```bash
# package.jsonのバージョンを更新
npm version patch  # パッチ更新
npm version minor  # マイナー更新
npm version major  # メジャー更新

# タグをプッシュ
git push origin main --tags
```

## ベストプラクティス

### 1. 小さく、頻繁にコミット

```bash
# ✅ Good: 小さく論理的なコミット
git commit -m "feat: add PlayerSearch component"
git commit -m "feat: add /players page"
git commit -m "feat: implement real-time search"

# ❌ Bad: 大きすぎるコミット
git commit -m "feat: add entire player search feature"
```

### 2. PRは小さく保つ

- 1つのPRで1つの機能または修正
- 大きな変更は複数のPRに分割
- レビューしやすいサイズ（300行以内が目安）

### 3. コードレビューを活用

- 全てのPRにレビューを必須とする
- 建設的なフィードバック
- 学習の機会として活用

### 4. ドキュメントを更新

コード変更に伴い、ドキュメントも更新します:
- READMEの更新
- API仕様の更新
- コンポーネントドキュメントの更新

### 5. テストを書く（将来的に）

新機能や修正には、テストを追加します（現在はテスト未実装）。

## トラブルシューティング

### マージコンフリクトの解決

```bash
# mainブランチの最新を取得
git checkout main
git pull origin main

# 作業ブランチに戻る
git checkout feature/my-feature

# mainをマージ
git merge main

# コンフリクトを手動で解決
# ファイルを編集して <<<<<<<, =======, >>>>>>> を削除

# 解決後、コミット
git add .
git commit -m "merge: resolve conflicts with main"

# プッシュ
git push origin feature/my-feature
```

### 誤ったコミットの取り消し

```bash
# 最後のコミットを取り消し（変更は保持）
git reset --soft HEAD~1

# 最後のコミットを完全に取り消し
git reset --hard HEAD~1
```

### ブランチの切り替え時に変更を保存

```bash
# 変更を一時保存
git stash

# ブランチを切り替え
git checkout other-branch

# 元のブランチに戻る
git checkout feature/my-feature

# 変更を復元
git stash pop
```

---

**最終更新**: 2026年2月
