# Teams ページ実装

## 基本情報

| 項目 | 値 |
|------|-----|
| **ファイル** | `src/app/teams/page.tsx` |
| **ルート** | `/teams` |
| **コンポーネントタイプ** | Server Component |
| **データソース** | ESPN Teams API |

## 概要

Teamsページは、NFL全32チームの一覧を表示します。チームはカンファレンス（AFC/NFC）とディビジョン（East/North/South/West）別にグループ化され、カード形式で表示されます。

## コンポーネント構造

```tsx
TeamsPage (Server Component)
├── PageHeader (静的)
└── Suspense
    └── TeamsContent (Server Component)
        ├── fetchTeamsData()
        └── Tabs (Client Component)
            ├── AFC TabContent
            │   └── DivisionCard[] (4つ)
            └── NFC TabContent
                └── DivisionCard[] (4つ)
```

## データフェッチング

### fetchTeamsData()

```tsx
async function fetchTeamsData(): Promise<FetchResult> {
  try {
    const teams = await getTeams();

    // Group by conference and division
    const grouped = teams.reduce(
      (acc, team) => {
        const divInfo = NFL_DIVISIONS[team.Key] || {
          conference: 'Unknown',
          division: 'Unknown',
        };
        const key = `${divInfo.conference} ${divInfo.division}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        // Update team with division info
        team.Conference = divInfo.conference;
        team.Division = divInfo.division;
        acc[key].push(team);
        return acc;
      },
      {} as Record<string, Team[]>
    );

    return { teams: grouped, error: false };
  } catch {
    return { teams: null, error: true };
  }
}
```

**特徴:**
- `NFL_DIVISIONS` 定数を使用して、各チームのカンファレンスとディビジョン情報を取得
- チームを「カンファレンス + ディビジョン」キーでグループ化
- 例: "AFC East", "NFC West"

**使用データ:**
- `getTeams()`: `src/lib/api/espn.ts`
- `NFL_DIVISIONS`: `src/lib/nfl-divisions.ts`

**返り値:**
```tsx
interface FetchResult {
  teams: Record<string, Team[]> | null;
  error: boolean;
}
```

**データ構造:**
```typescript
{
  "AFC East": [Team, Team, Team, Team],
  "AFC North": [Team, Team, Team, Team],
  // ...
  "NFC West": [Team, Team, Team, Team],
}
```

## ページコンポーネント

### DivisionCard

```tsx
function DivisionCard({
  divisionKey,
  teams,
}: {
  divisionKey: string;
  teams: Team[];
}) {
  const isAFC = divisionKey.startsWith('AFC');
  return (
    <Card className="overflow-hidden border-t-4 border-t-primary">
      <CardHeader className="pb-2 bg-secondary/30">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isAFC ? 'bg-accent' : 'bg-primary'}`} />
          {divisionKey}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid gap-2">
          {teams
            .sort((a, b) => a.City.localeCompare(b.City))
            .map((team) => (
              <Link
                key={team.Key}
                href={`/teams/${team.Key}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                {team.WikipediaLogoURL ? (
                  <img
                    src={team.WikipediaLogoURL}
                    alt={team.Key}
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: `#${team.PrimaryColor}` }}
                  >
                    {team.Key}
                  </div>
                )}
                <div>
                  <div className="font-medium">{team.FullName}</div>
                </div>
              </Link>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

**特徴:**
- ディビジョン名をヘッダーに表示
- AFC/NFCを色で識別（AFC: accent、NFC: primary）
- チームを都市名順にソート
- チームロゴまたはチームカラーのバッジを表示
- チーム名をクリックすると詳細ページに遷移

### TeamsContent

```tsx
async function TeamsContent() {
  const { teams, error } = await fetchTeamsData();

  if (error || !teams) {
    return <ErrorMessage />;
  }

  const afcDivisions = Object.keys(teams)
    .filter((key) => key.startsWith('AFC'))
    .sort();
  const nfcDivisions = Object.keys(teams)
    .filter((key) => key.startsWith('NFC'))
    .sort();

  return (
    <Tabs defaultValue="afc" className="w-full">
      <TabsList className="mb-4 grid grid-cols-2 w-full sm:w-auto">
        <TabsTrigger value="afc">AFC</TabsTrigger>
        <TabsTrigger value="nfc">NFC</TabsTrigger>
      </TabsList>

      <TabsContent value="afc">
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {afcDivisions.map((div) => (
            <DivisionCard key={div} divisionKey={div} teams={teams[div]} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="nfc">
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {nfcDivisions.map((div) => (
            <DivisionCard key={div} divisionKey={div} teams={teams[div]} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
```

## 使用コンポーネント

### Tabs (shadcn/ui)

**ファイル:** `src/components/ui/tabs.tsx`

**機能:**
- AFCとNFCのタブ切り替え
- クライアントサイドの状態管理

---

**最終更新**: 2026年2月
**対象ページ**: `/teams`
