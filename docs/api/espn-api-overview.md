# ESPN API 統合概要

## ESPN APIとは

ESPN API は、ESPN（大手スポーツメディア）が提供するスポーツデータAPIです。NFLの試合スコア、ニュース、順位表、チーム情報、選手情報などを取得できます。

**重要な特徴:**
- **公開API（Public Undocumented）**: 公式ドキュメントはないが、公開されているエンドポイント
- **認証不要**: APIキーや認証トークンが不要
- **リアルタイムデータ**: 試合中のスコアや状態を提供
- **無料**: 商用利用の制限は不明だが、現時点では無料で利用可能

## なぜESPN APIを使用しているか

### 1. 認証不要

ESPN APIは認証が不要なため、セットアップが簡単です:
- APIキーの取得手続き不要
- 環境変数の管理不要
- すぐに開発を開始できる

### 2. 包括的なデータ

ESPN APIは、NFLに関する様々なデータを提供します:
- 試合スコアと状態（リアルタイム）
- チーム情報
- 選手ロスター
- 順位表
- ニュース記事

### 3. 信頼性

ESPNは世界最大級のスポーツメディアであり、データの正確性と信頼性が高いです。

### 4. パフォーマンス

ESPN APIは、CDNを使用して高速にデータを配信します。

## ベースURL

```typescript
const BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl';
```

全てのエンドポイントは、このベースURLに対してパスを追加します。

## 認証の有無

ESPN APIは**認証不要**です。

**メリット:**
- セットアップが簡単
- 環境変数の管理不要
- 無料で利用可能

**デメリット:**
- レート制限が不明
- APIの仕様変更に弱い（公式サポートなし）

## 全般的な使用パターン

### 1. fetchを使用

```typescript
const res = await fetch(`${BASE_URL}/scoreboard`, {
  next: { revalidate: 60 } // Next.js ISRキャッシング
});
const data = await res.json();
```

### 2. 型変換

```typescript
// ESPN型 → アプリ型への変換
const games: Game[] = data.events.map(convertESPNEventToGame);
```

### 3. エラーハンドリング

```typescript
try {
  const data = await getScoresByWeek(season, week, seasonType);
  return data;
} catch (error) {
  console.error('API error:', error);
  throw error;
}
```

## 注意事項

### 1. 公式ドキュメントなし

ESPN APIは公式にドキュメント化されていないため:
- APIの仕様は推測に基づく
- 予告なく変更される可能性がある
- サポートは期待できない

### 2. レート制限

レート制限は公表されていませんが:
- 過剰なリクエストは避けるべき
- キャッシングを積極的に使用
- このアプリでは60秒～300秒のキャッシュを設定

### 3. CORS

ブラウザから直接APIを呼び出すことはできません（CORSエラー）:
- Server Components（サーバーサイド）でのみ使用
- Client Components からは呼び出さない

---

**最終更新**: 2026年2月
