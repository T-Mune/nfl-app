# ESPN API 仕様詳細

## 公式ドキュメント

ESPN APIは**公式にドキュメント化されていません**（Undocumented Public API）。

**現状:**
- ESPN Developer Portal は存在しない
- 公式APIドキュメントは提供されていない
- コミュニティによるリバースエンジニアリングに依存

## 非公式リソース

ESPN APIの仕様は、コミュニティによって調査され、共有されています。

### GitHubリポジトリ

1. **ESPN API Examples**
   - URL: https://gist.github.com/nntrn/ee26cb2a0716de0947a0a4e9a157bc1c
   - 内容: ESPN APIの様々なエンドポイント例

2. **ESPN Scraper Projects**
   - 多数のESPN APIラッパーライブラリがGitHub上に存在
   - 検索: "ESPN API" "NFL API" "ESPN scraper"

### Stack Overflow

- 検索キーワード: "ESPN API", "ESPN undocumented API", "ESPN NFL API"
- ESPN APIの使用方法に関する質問と回答

### ブログ記事

- 様々な開発者がESPN APIの使用方法を記事にしています
- 検索: "How to use ESPN API", "ESPN hidden API"

## 使用しているエンドポイント詳細

### 1. Scoreboard（試合スコア）

**完全なURL:**
```
https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard
?dates=YYYYMMDD&seasontype=X&week=Y
```

**パラメータ:**
- `dates`: YYYYMMDD形式の日付（オプション）
- `seasontype`: シーズンタイプ（1=Preseason, 2=Regular, 3=Postseason）
- `week`: 週番号（1～18）

**レスポンス形式:**
```json
{
  "leagues": [...],
  "season": { "year": 2025, "type": 2 },
  "week": { "number": 10 },
  "events": [
    {
      "id": "401547404",
      "name": "Kansas City Chiefs at San Francisco 49ers",
      "competitions": [
        {
          "competitors": [
            {
              "team": { "id": "25", "abbreviation": "KC", "displayName": "Kansas City Chiefs" },
              "score": "27",
              "homeAway": "away"
            },
            {
              "team": { "id": "26", "abbreviation": "SF", "displayName": "San Francisco 49ers" },
              "score": "24",
              "homeAway": "home"
            }
          ],
          "status": { "type": { "name": "STATUS_FINAL" } }
        }
      ]
    }
  ]
}
```

### 2. Teams（チーム一覧）

**完全なURL:**
```
https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams
```

**レスポンス形式:**
```json
{
  "sports": [
    {
      "leagues": [
        {
          "teams": [
            {
              "team": {
                "id": "1",
                "abbreviation": "ATL",
                "displayName": "Atlanta Falcons",
                "logos": [{ "href": "..." }]
              }
            }
          ]
        }
      ]
    }
  ]
}
```

### 3. Team Roster（チームロスター）

**完全なURL:**
```
https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/{teamId}/roster
```

**パラメータ:**
- `{teamId}`: ESPNのチームID（数値、例: 12）

### 4. Standings（順位表）

**完全なURL:**
```
https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/{year}/types/2/standings
```

**パラメータ:**
- `{year}`: シーズン年（例: 2025）

### 5. News（ニュース）

**完全なURL:**
```
https://site.api.espn.com/apis/site/v2/sports/football/nfl/news
```

**レスポンス形式:**
```json
{
  "articles": [
    {
      "headline": "...",
      "description": "...",
      "links": { "web": { "href": "..." } },
      "images": [{ "url": "..." }],
      "published": "2026-02-01T12:00:00Z"
    }
  ]
}
```

## レート制限

**公式情報:** なし

**推測:**
- 過剰なリクエストはIPアドレス単位でブロックされる可能性がある
- 1秒あたり数十リクエスト程度は問題ないと思われる

**このアプリの対策:**
- ISRキャッシング（30秒～300秒）により、API呼び出しを大幅に削減
- 通常のトラフィックでは問題ない想定

## 変更履歴

### 確認した時点

**日付:** 2026年2月
**APIバージョン:** v2（URLに含まれる）

### 過去の変更

- 2023年頃: ESPN APIのURL構造が変更された可能性がある（コミュニティ報告）
- レスポンス形式は比較的安定している

## 注意事項

### APIの安定性

ESPN APIは非公式のため:
- 予告なく仕様が変更される可能性がある
- エンドポイントが廃止される可能性がある
- レスポンス形式が変わる可能性がある

### 突然の変更への対処方法

1. **型システムによる検出**:
   - TypeScriptの型チェックで、レスポンス構造の変化を検出

2. **エラーハンドリング**:
   - 全てのAPI呼び出しにtry-catchを実装
   - エラー時はユーザーフレンドリーなメッセージを表示

3. **代替APIの検討**:
   - 必要に応じて、SportsData.ioなどの公式APIへの移行を検討

### エラーハンドリング戦略

```typescript
try {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  const data = await res.json();
  return convertData(data);
} catch (error) {
  console.error('ESPN API error:', error);
  // ユーザーにエラーメッセージを表示
  throw error;
}
```

---

**最終更新**: 2026年2月
