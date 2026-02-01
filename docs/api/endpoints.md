# APIエンドポイント

このドキュメントでは、アプリケーションで使用する各ESPN APIエンドポイントの詳細を説明します。

## 1. Scoreboard（試合スコア）

### getScoresByWeek()

指定された週の試合スコアを取得します。

**関数シグネチャ:**
```typescript
async function getScoresByWeek(
  season: number,
  week: number,
  seasonType: number
): Promise<Game[]>
```

**URL:**
```
GET https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard
```

**Query Parameters:**
- `dates`: YYYYMMDD形式（計算により設定）
- `seasontype`: 1（Preseason）, 2（Regular）, 3（Postseason）
- `week`: 週番号（1～18）

**Response Type:** `ESPNScoreboard`

**キャッシュ時間:** 60秒

**使用例:**
```typescript
const games = await getScoresByWeek(2025, 10, 2); // 2025年、Week 10、レギュラーシーズン
```

---

## 2. Live Scores（ライブスコア）

### getLiveScores()

現在進行中の試合を取得します。

**関数シグネチャ:**
```typescript
async function getLiveScores(): Promise<{
  week: number;
  season: number;
  seasonType: number;
  games: Game[];
}>
```

**URL:**
```
GET https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard
```

**Query Parameters:** なし（現在の週が自動的に返される）

**キャッシュ時間:** 60秒

**使用例:**
```typescript
const { week, season, games } = await getLiveScores();
```

---

## 3. Teams（チーム一覧）

### getTeams()

NFL全チームの基本情報を取得します。

**関数シグネチャ:**
```typescript
async function getTeams(): Promise<Team[]>
```

**URL:**
```
GET https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams
```

**Query Parameters:** なし

**キャッシュ時間:** 300秒（5分）

**使用例:**
```typescript
const teams = await getTeams(); // 全32チーム
```

---

## 4. Team（チーム詳細）

### getTeam()

特定のチームの情報を取得します。

**関数シグネチャ:**
```typescript
async function getTeam(abbreviation: string): Promise<Team | undefined>
```

**実装:**
```typescript
async function getTeam(abbreviation: string) {
  const teams = await getTeams();
  return teams.find(t => t.Key === abbreviation);
}
```

**キャッシュ時間:** 300秒（getTeams経由）

**使用例:**
```typescript
const team = await getTeam('KC'); // Kansas City Chiefs
```

---

## 5. Team Roster（チームロスター）

### getTeamRoster()

特定のチームの選手名簿を取得します。

**関数シグネチャ:**
```typescript
async function getTeamRoster(teamId: string): Promise<RosterPlayer[]>
```

**URL:**
```
GET https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/{teamId}/roster
```

**Path Parameters:**
- `{teamId}`: ESPNのチームID（数値文字列、例: "12"）

**キャッシュ時間:** 300秒（5分）

**使用例:**
```typescript
const teamId = await getTeamIdFromAbbreviation('KC');
const roster = await getTeamRoster(teamId);
```

---

## 6. Standings（順位表）

### getStandings()

全チームの順位情報を取得します。

**関数シグネチャ:**
```typescript
async function getStandings(season: number): Promise<Standing[]>
```

**URL:**
```
GET https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/{season}/types/2/standings
```

**Path Parameters:**
- `{season}`: シーズン年（例: 2025）

**キャッシュ時間:** 60秒

**使用例:**
```typescript
const standings = await getStandings(2025);
```

---

## 7. News（ニュース）

### getNews()

最新のNFLニュース記事を取得します。

**関数シグネチャ:**
```typescript
async function getNews(): Promise<NewsArticle[]>
```

**URL:**
```
GET https://site.api.espn.com/apis/site/v2/sports/football/nfl/news
```

**Query Parameters:** なし

**キャッシュ時間:** 30秒

**使用例:**
```typescript
const articles = await getNews();
```

---

## 補助的なエンドポイント

### getTeamIdFromAbbreviation()

チーム略称からESPN内部のチームIDを取得します。

**関数シグネチャ:**
```typescript
async function getTeamIdFromAbbreviation(
  abbreviation: string
): Promise<string | null>
```

**実装:**
ESPN Teams APIを呼び出し、略称に一致するチームのIDを返します。

**使用例:**
```typescript
const teamId = await getTeamIdFromAbbreviation('KC'); // "12"
```

---

## エンドポイント比較表

| エンドポイント | キャッシュ | 更新頻度 | 用途 |
|---------------|-----------|---------|------|
| Scoreboard | 60秒 | 試合中は頻繁 | Live Scoresページ |
| News | 30秒 | 速報性重視 | Newsページ |
| Teams | 300秒 | ほぼ不変 | Teamsページ、各ページのチームリンク |
| Roster | 300秒 | シーズン中は稀 | Team Detailページ |
| Standings | 60秒 | 試合終了後 | Standingsページ |

---

**最終更新**: 2026年2月
