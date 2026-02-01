# API統合ドキュメント

このドキュメントでは、NFL Stats Webアプリケーションにおける外部API統合について説明します。

## 対象読者

このドキュメントは、以下の方を対象としています:
- **エンジニア**: APIの実装を理解し、新しいエンドポイントを追加したい開発者
- **AI**: データ層を理解し、自動化やサポートを行いたいAIエージェント

## データソース

このアプリケーションは、**ESPN API**をデータソースとして使用しています。

### ESPN APIについて

**ESPN API**は、ESPNが提供するスポーツデータAPIです。

**特徴:**
- **公開API**: 認証不要で利用可能
- **リアルタイムデータ**: 試合中のスコアや状態を提供
- **包括的なデータ**: スコア、ニュース、順位表、ロスターなど

**注意:**
- ESPN APIは公式にドキュメント化されていない（undocumented public API）
- APIの仕様は予告なく変更される可能性がある
- レート制限は不明（過剰なリクエストは避けるべき）

## APIクライアント実装

### ファイル構成

```
src/lib/api/
├── espn.ts           # ESPN API クライアント（現在使用）
└── sportsdata.ts     # SportsData.io クライアント（旧バージョン、非使用）
```

### ESPN APIクライアント

**ファイル:** `src/lib/api/espn.ts`

このファイルには、以下が含まれます:
1. **エンドポイント関数**: データ取得関数（`getScoresByWeek()`, `getNews()` など）
2. **ヘルパー関数**: ユーティリティ関数（`getCurrentSeason()`, `formatGameDate()` など）
3. **型変換関数**: ESPN型 → アプリ型への変換（`convertESPNEventToGame()` など）

## ベースURL

ESPN APIのベースURLは以下の通りです:

```typescript
const BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl';
```

全てのエンドポイントは、このベースURLに対してパスを追加します。

## 認証

ESPN APIは**認証不要**です。APIキーや認証トークンは必要ありません。

**利点:**
- セットアップが簡単
- 環境変数の管理不要
- 無料で利用可能

**注意:**
- レート制限が不明なため、キャッシングが重要
- 過剰なリクエストはAPIの利用停止につながる可能性がある

## キャッシング戦略

全てのエンドポイントは、Next.js の ISR（Incremental Static Regeneration）によりキャッシュされます。

### キャッシュ時間

| エンドポイント | キャッシュ時間 | 理由 |
|---------------|---------------|------|
| Scoreboard | 60秒 | リアルタイム性とAPI呼び出し削減のバランス |
| News | 30秒 | ニュースは速報性が重要 |
| Standings | 60秒 | 試合終了後にのみ更新されるため |
| Teams | 300秒（5分） | ほとんど変わらないデータ |
| Roster | 300秒（5分） | 選手の追加・削除は稀 |

### 実装

```typescript
const res = await fetch(url, {
  next: { revalidate: 60 } // 60秒間キャッシュ
});
```

**動作:**
1. 初回リクエスト: APIを呼び出し、レスポンスをキャッシュに保存
2. 再検証時間内の再リクエスト: キャッシュから即座に返す（APIは呼ばれない）
3. 再検証時間経過後: バックグラウンドでAPIを呼び出し、キャッシュを更新

## エンドポイント一覧

### 1. Scoreboard（試合スコア）

**関数:** `getScoresByWeek()`
**用途:** 指定された週の試合スコアを取得

### 2. Live Scores（ライブスコア）

**関数:** `getLiveScores()`
**用途:** 現在進行中の試合を取得

### 3. Teams（チーム一覧）

**関数:** `getTeams()`
**用途:** 全チームの基本情報を取得

### 4. Team（チーム詳細）

**関数:** `getTeam()`
**用途:** 特定のチームの情報を取得

### 5. Team Roster（チームロスター）

**関数:** `getTeamRoster()`
**用途:** 特定のチームの選手名簿を取得

### 6. Standings（順位表）

**関数:** `getStandings()`
**用途:** 全チームの順位情報を取得

### 7. News（ニュース）

**関数:** `getNews()`
**用途:** 最新のNFLニュース記事を取得

## 型システム

### 型定義ファイル

```
src/types/
├── nfl.ts            # アプリケーションドメイン型
└── espn.ts           # ESPN APIレスポンス型
```

### 型の流れ

```
ESPN API レスポンス → ESPN型（espn.ts） → 変換関数 → アプリ型（nfl.ts） → コンポーネント
```

**利点:**
- 外部APIの変更に柔軟に対応
- アプリケーション内部では一貫した型を使用
- 型安全性による バグの早期発見

## エラーハンドリング

全てのAPI呼び出しは、try-catchでエラーをハンドリングしています。

```typescript
async function getScoresByWeek() {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return convertData(data);
  } catch (error) {
    console.error('Failed to fetch scores:', error);
    throw error;
  }
}
```

**エラー処理の階層:**
1. **APIクライアント層**: エラーをログに記録し、再throw
2. **ページ層**: try-catchでエラーをキャッチし、ユーザーフレンドリーなメッセージを表示

## ドキュメント一覧

### [espn-api-overview.md](./espn-api-overview.md)
ESPN APIの概要と統合方法です。

**内容:**
- ESPN APIとは
- なぜESPN APIを使用しているか
- ベースURLと認証

### [espn-api-specs.md](./espn-api-specs.md)
ESPN APIの詳細仕様と外部リソースです。

**内容:**
- 公式ドキュメント（存在する場合）
- 非公式リソース（GitHubリポジトリ、ブログ記事）
- エンドポイント詳細
- レート制限
- 変更履歴

### [endpoints.md](./endpoints.md)
各エンドポイントの詳細な仕様です。

**内容:**
- URL、Method、Query Parameters
- Response Type
- Usage Example
- キャッシュ時間

### [types.md](./types.md)
TypeScript型定義の詳細です。

**内容:**
- アプリケーションドメイン型（Game、Team、Standing など）
- ESPN APIレスポンス型
- 型変換関数

### [helpers.md](./helpers.md)
ヘルパー関数の詳細です。

**内容:**
- `getCurrentSeason()`
- `getSeasonWeeks()`
- `formatGameDate()`
- `formatNewsDate()`

## 新しいエンドポイントの追加方法

### 1. ESPN APIレスポンス型を定義

```typescript
// src/types/espn.ts
export interface ESPNNewData {
  // ESPN APIのレスポンス構造を定義
}
```

### 2. アプリケーション型を定義

```typescript
// src/types/nfl.ts
export interface NewData {
  // アプリケーション内部で使用する型を定義
}
```

### 3. 変換関数を実装

```typescript
// src/lib/api/espn.ts
function convertESPNToApp(espnData: ESPNNewData): NewData {
  return {
    // 変換ロジック
  };
}
```

### 4. エンドポイント関数を実装

```typescript
// src/lib/api/espn.ts
export async function getNewData(): Promise<NewData[]> {
  const url = `${BASE_URL}/new-endpoint`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  const data: ESPNNewData = await res.json();
  return data.items.map(convertESPNToApp);
}
```

### 5. ページで使用

```typescript
// src/app/new-page/page.tsx
const data = await getNewData();
```

## ベストプラクティス

### 1. キャッシングを適切に設定

データの更新頻度に応じて、適切なrevalidate時間を設定します:
- 頻繁に変わるデータ: 30～60秒
- ほとんど変わらないデータ: 300秒以上

### 2. 型安全性を保つ

全てのAPIレスポンスに型を定義し、変換関数を使用します。

### 3. エラーハンドリングを実装

全てのfetch呼び出しにtry-catchを実装し、適切なエラーメッセージを表示します。

### 4. レート制限を意識

過剰なAPI呼び出しを避けるため、キャッシングを活用します。

---

**最終更新**: 2026年2月
**対象読者**: エンジニア、AI
