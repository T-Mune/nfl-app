# Team Detail ページ実装

## 基本情報

| 項目 | 値 |
|------|-----|
| **ファイル** | `src/app/teams/[teamId]/page.tsx` |
| **ルート** | `/teams/[teamId]` |
| **コンポーネントタイプ** | Server Component |
| **ルートタイプ** | 動的ルート |
| **データソース** | ESPN Teams API, ESPN Roster API |

## 概要

Team Detailページは、特定のチームの詳細情報とロスター（選手名簿）を表示します。動的ルートパラメータ `[teamId]` を使用して、URLからチームIDを取得します。

## コンポーネント構造

```tsx
TeamPage (Server Component)
├── Suspense
    └── TeamDetail (Server Component)
        ├── fetchTeamData()
        ├── TeamHeader (グラデーション背景)
        └── RosterSection
            ├── Offense Table
            ├── Defense Table
            └── Special Teams Table
```

## Props

### TeamPageProps

```tsx
interface TeamPageProps {
  params: Promise<{ teamId: string }>;
}
```

**動的パラメータ:**
- `teamId`: チームの略称（例: "KC", "SF", "NE"）

**URL例:**
- `/teams/KC` → `teamId = "KC"` (Kansas City Chiefs)
- `/teams/SF` → `teamId = "SF"` (San Francisco 49ers)

## データフェッチング

### fetchTeamData()

```tsx
async function fetchTeamData(teamAbbr: string): Promise<FetchResult> {
  try {
    const team = await getTeam(teamAbbr);
    if (!team) {
      return { team: null, players: [], error: false };
    }

    const teamId = await getTeamIdFromAbbreviation(teamAbbr);
    if (!teamId) {
      return { team, players: [], error: false };
    }

    const players = await getTeamRoster(teamId);
    return { team, players, error: false };
  } catch {
    return { team: null, players: [], error: true };
  }
}
```

**処理フロー:**
1. チーム略称からチーム情報を取得（`getTeam()`）
2. チーム略称からESPN内部のチームIDを取得（`getTeamIdFromAbbreviation()`）
3. チームIDを使用してロスター情報を取得（`getTeamRoster()`）
4. エラー時は空のデータを返す

**使用API:**
- `getTeam()`: チーム基本情報
- `getTeamIdFromAbbreviation()`: チームID変換
- `getTeamRoster()`: ロスター情報

**返り値:**
```tsx
interface FetchResult {
  team: Team | null;
  players: RosterPlayer[];
  error: boolean;
}
```

## ページコンポーネント

### TeamPage

```tsx
export default async function TeamPage({ params }: TeamPageProps) {
  const { teamId } = await params;

  return (
    <Suspense fallback={<TeamLoading />}>
      <TeamDetail teamAbbr={teamId} />
    </Suspense>
  );
}
```

**特徴:**
- `params` はPromiseであり、awaitする必要がある（Next.js 16の仕様）
- チームIDを `TeamDetail` コンポーネントに渡す

### TeamDetail

```tsx
async function TeamDetail({ teamAbbr }: { teamAbbr: string }) {
  const { team, players, error } = await fetchTeamData(teamAbbr);

  if (error) {
    return <ErrorMessage />;
  }

  if (!team) {
    notFound(); // Next.jsの404ページを表示
  }

  // Group players by position group
  const positionGroups: Record<string, RosterPlayer[]> = {};
  players.forEach((player) => {
    const group = player.positionGroup || 'other';
    if (!positionGroups[group]) {
      positionGroups[group] = [];
    }
    positionGroups[group].push(player);
  });

  const groupOrder = ['offense', 'defense', 'specialTeams', 'other'];
  const groupLabels: Record<string, string> = {
    offense: 'Offense',
    defense: 'Defense',
    specialTeams: 'Special Teams',
    other: 'Other',
  };

  return (
    <div>
      {/* Team Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 mb-8 text-primary-foreground">
        {/* ... */}
      </div>

      {/* Roster */}
      <div className="flex items-center gap-3 mb-4">
        <h2>Roster ({players.length} players)</h2>
      </div>

      {groupOrder.map((group) => {
        const groupPlayers = positionGroups[group];
        if (!groupPlayers || groupPlayers.length === 0) return null;

        return (
          <div key={group} className="mb-6">
            <h3>{groupLabels[group]}</h3>
            <Card>
              <Table>
                {/* テーブルヘッダーとボディ */}
              </Table>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
```

**特徴:**
- チームが見つからない場合は`notFound()`を呼び出し、404ページを表示
- 選手をポジショングループ（offense, defense, specialTeams）別に分類
- 各グループをテーブルで表示

## チームヘッダー

```tsx
<div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 mb-8 text-primary-foreground">
  <div className="flex items-center gap-6">
    {team.WikipediaLogoURL ? (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
        <img
          src={team.WikipediaLogoURL}
          alt={team.FullName}
          className="w-20 h-20 object-contain"
        />
      </div>
    ) : (
      <div
        className="w-24 h-24 rounded-xl flex items-center justify-center text-white text-2xl font-bold"
        style={{ backgroundColor: `#${team.PrimaryColor}` }}
      >
        {team.Key}
      </div>
    )}
    <div>
      <h1 className="text-3xl font-bold">{team.FullName}</h1>
      <p className="text-primary-foreground/80">{team.City}</p>
    </div>
  </div>
</div>
```

**デザイン:**
- グラデーション背景（プライマリカラー）
- チームロゴまたはチームカラーのバッジ
- チーム名と都市名

## ロスターテーブル

各ポジショングループは、shadcn/uiの`Table`コンポーネントで表示されます。

**表示される列:**
- **#**: 背番号
- **Name**: 選手名（ヘッドショット付き）
- **Pos**: ポジション（Badgeで表示）
- **Height / Weight**: 身長・体重
- **Age**: 年齢
- **Exp**: 経験年数（"R" = Rookie）
- **College**: 出身大学

**レスポンシブ:**
- モバイル: #、Name、Posのみ表示
- タブレット: Height/Weight、Ageも表示
- デスクトップ: 全列表示

## データフロー

```
ユーザーが /teams/KC にアクセス
  ↓
TeamPage コンポーネント実行
  ↓
params から teamId = "KC" を取得
  ↓
Suspense 境界
  ↓
TeamLoading を表示
  ↓
TeamDetail コンポーネント実行
  ↓
fetchTeamData("KC")
  ↓
getTeam("KC") - チーム情報取得
  ↓
getTeamIdFromAbbreviation("KC") - チームID取得
  ↓
getTeamRoster(teamId) - ロスター取得
  ↓
選手をポジショングループ別に分類
  ↓
チームヘッダーとロスターテーブルをレンダリング
  ↓
HTMLをクライアントに送信
```

## notFound() の使用

```tsx
if (!team) {
  notFound();
}
```

**動作:**
- Next.jsの`notFound()`関数を呼び出し
- 最も近い`not-found.tsx`ファイルを表示
- または、デフォルトの404ページを表示

**使用ケース:**
- 無効なチームIDが指定された場合
- チーム情報が取得できなかった場合

---

**最終更新**: 2026年2月
**対象ページ**: `/teams/[teamId]`
