# コーディング規約

このドキュメントでは、プロジェクトのコーディング規約とスタイルガイドを説明します。

## ファイル命名規則

### ディレクトリ

- **小文字 + ハイフン**: 複数単語（例: `user-guide`, `api-client`）
- **小文字**: 単一単語（例: `app`, `components`, `lib`）

### ファイル

#### Reactコンポーネント

- **PascalCase**: `ComponentName.tsx`
- 例: `ScoreCard.tsx`, `Header.tsx`, `NewsList.tsx`

#### ユーティリティ・API・設定

- **camelCase**: `fileName.ts`
- 例: `espn.ts`, `utils.ts`, `nfl-divisions.ts`

#### 型定義

- **camelCase**: `typeName.ts`
- 例: `nfl.ts`, `espn.ts`

#### ページ（App Router）

- **小文字**: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`

#### ドキュメント

- **kebab-case**: `file-name.md`
- 例: `live-scores.md`, `tech-stack.md`

## コードスタイル

### TypeScript

#### 型定義

```typescript
// ✅ Good: interfaceを使用
interface UserProps {
  name: string;
  age: number;
}

// ❌ Bad: typeを使用（interfaceが推奨）
type UserProps = {
  name: string;
  age: number;
}

// ✅ Good: Union型やMapped型の場合はtypeを使用
type Status = 'pending' | 'success' | 'error';
```

#### 関数の型定義

```typescript
// ✅ Good: 引数と返り値に型を明示
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}

// ✅ Good: async関数の返り値はPromise
async function fetchData(): Promise<Data[]> {
  const res = await fetch(url);
  return res.json();
}
```

#### nullableな値の扱い

```typescript
// ✅ Good: Optional chainingとnullish coalescingを使用
const score = game.homeScore ?? 0;
const teamName = team?.name ?? 'Unknown';

// ❌ Bad: 古いパターン
const score = game.homeScore || 0; // 0がfalsyなので意図しない動作
```

### React/Next.js

#### Server Components vs Client Components

```typescript
// ✅ Good: デフォルトはServer Component
// src/components/scores/ScoresList.tsx
export function ScoresList({ games }: ScoresListProps) {
  return <div>...</div>;
}

// ✅ Good: インタラクションが必要な場合のみClient Component
// src/components/layout/Header.tsx
'use client';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  return <header>...</header>;
}
```

#### コンポーネントの構造

```typescript
// ✅ Good: Props型を定義
interface CardProps {
  title: string;
  children: React.ReactNode;
}

export function Card({ title, children }: CardProps) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
```

#### async/await（Server Components）

```typescript
// ✅ Good: Server ComponentでのデータフェッチングはAsync/Await
export default async function Page() {
  const data = await fetchData();
  return <div>{data.content}</div>;
}
```

### Tailwind CSS

#### クラス名の順序

```tsx
// ✅ Good: レイアウト → サイズ → スペーシング → タイポグラフィ → 色 → その他
<div className="flex items-center justify-between w-full px-4 py-2 text-lg font-bold text-primary bg-secondary rounded-md hover:bg-secondary/80">
```

#### cn()ヘルパーの使用

```tsx
// ✅ Good: cn()で条件付きクラスを結合
import { cn } from '@/lib/utils';

<div className={cn(
  'px-4 py-2',
  isActive && 'bg-accent',
  className
)}>
```

#### レスポンシブクラス

```tsx
// ✅ Good: モバイルファースト
<div className="text-sm sm:text-base md:text-lg">

// ❌ Bad: デスクトップファースト
<div className="text-lg md:text-base sm:text-sm">
```

## コンポーネントルール

### 1. 単一責任の原則

各コンポーネントは1つの責任のみを持つべきです。

```typescript
// ✅ Good: 各コンポーネントが明確な責任を持つ
<ScoresList games={games} />
  └─ <ScoreCard game={game} />

// ❌ Bad: 1つのコンポーネントが複数の責任を持つ
<ScoresAndNews />
```

### 2. Props Drillingを避ける

深いネストでPropsを渡すのは避けます。

```typescript
// ✅ Good: 必要な粒度でコンポーネントを分割
async function Scores() {
  const games = await fetchGames();
  return <ScoresList games={games} />;
}

// ❌ Bad: 不要な中間コンポーネント
<Parent data={data}>
  <Child data={data}>
    <GrandChild data={data} />
  </Child>
</Parent>
```

### 3. 100行を超えたら分割を検討

コンポーネントが100行を超えたら、サブコンポーネントへの分割を検討します。

## TypeScript規約

### 型のインポート

```typescript
// ✅ Good: 型のみのインポートはtype修飾子を使用
import type { Game, Team } from '@/types/nfl';
import { getScoresByWeek } from '@/lib/api/espn';
```

### anyの禁止

```typescript
// ❌ Bad: anyは使用しない
function process(data: any) { }

// ✅ Good: 具体的な型を定義
function process(data: unknown) {
  if (typeof data === 'string') {
    // 型ガードで安全に使用
  }
}
```

### 型アサーションは最小限に

```typescript
// ❌ Bad: 型アサーションの乱用
const data = apiResponse as MyType;

// ✅ Good: 型ガードで安全に
function isMyType(data: unknown): data is MyType {
  return typeof data === 'object' && data !== null && 'id' in data;
}

if (isMyType(data)) {
  // 型安全に使用
}
```

## Commitメッセージ規約

### フォーマット

```
<type>: <subject>

<body>
```

### Type（種類）

- **feat**: 新機能の追加
- **fix**: バグ修正
- **docs**: ドキュメントのみの変更
- **style**: コードの動作に影響しない変更（フォーマット、セミコロンなど）
- **refactor**: バグ修正や機能追加を含まないコードの変更
- **perf**: パフォーマンス改善
- **test**: テストの追加や修正
- **chore**: ビルドプロセスやツールの変更

### 例

```bash
# 良い例
git commit -m "feat: add Week Selector component for Live Scores page"

git commit -m "fix: resolve null pointer error in ScoreCard component"

git commit -m "docs: update API documentation with ESPN endpoints"

git commit -m "refactor: extract data fetching logic into separate function"

# 悪い例
git commit -m "update" # 何を更新したか不明
git commit -m "fix bug" # どのバグか不明
git commit -m "WIP" # 作業中のコミットはプッシュしない
```

### Commit本文（Body）

複雑な変更の場合、本文で詳細を説明します:

```bash
git commit -m "feat: implement caching strategy for ESPN API

- Add 60-second cache for scoreboard endpoint
- Add 30-second cache for news endpoint
- Add 300-second cache for teams endpoint
- Improve performance and reduce API calls"
```

## ESLint設定

プロジェクトのESLint設定に従います。

### Lintの実行

```bash
# Lintチェック
npm run lint

# 自動修正
npm run lint -- --fix
```

### 主なルール

- **no-unused-vars**: 未使用の変数は削除
- **no-console**: console.logは本番コードでは使用しない（開発時はOK）
- **prefer-const**: 再代入しない変数はconstを使用
- **@typescript-eslint/no-explicit-any**: anyを使用しない

## インポート順序

```typescript
// 1. 外部ライブラリ
import { useState } from 'react';
import Link from 'next/link';

// 2. 内部モジュール（@/エイリアス）
import { cn } from '@/lib/utils';
import { Game, Team } from '@/types/nfl';

// 3. UIコンポーネント
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// 4. 相対パス（避けるべき）
import { Header } from '../layout/Header';
```

## ベストプラクティス

### 1. 早期リターン

```typescript
// ✅ Good: 早期リターンで読みやすく
function processData(data: Data | null) {
  if (!data) return null;
  if (data.isEmpty) return [];

  return data.items.map(process);
}

// ❌ Bad: ネストが深い
function processData(data: Data | null) {
  if (data) {
    if (!data.isEmpty) {
      return data.items.map(process);
    } else {
      return [];
    }
  } else {
    return null;
  }
}
```

### 2. 明示的なブール値チェック

```typescript
// ✅ Good: 意図が明確
if (games.length > 0) { }
if (error !== null) { }

// ❌ Bad: 暗黙的な型変換
if (games.length) { }
if (error) { }
```

### 3. Optional Chaining

```typescript
// ✅ Good: Optional Chainingを活用
const logo = team?.WikipediaLogoURL ?? defaultLogo;

// ❌ Bad: 古いパターン
const logo = team && team.WikipediaLogoURL ? team.WikipediaLogoURL : defaultLogo;
```

---

**最終更新**: 2026年2月
