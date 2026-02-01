# コンポーネント実装ドキュメント

このドキュメントでは、NFL Stats Webアプリケーションの各コンポーネントの実装詳細を説明します。

## 対象読者

- **エンジニア**: コンポーネントの実装を理解し、修正や拡張を行いたい開発者
- **AI**: コードベースを理解し、自動化やサポートを行いたいAIエージェント

## コンポーネント分類

### Layout Components（レイアウトコンポーネント）

アプリケーション全体のレイアウトを担当するコンポーネントです。

- **[Header](./layout/header.md)** - ナビゲーションヘッダー（Client Component）
- **[Footer](./layout/footer.md)** - フッター（Server Component）

### Feature Components（機能コンポーネント）

特定の機能を提供するコンポーネントです。

#### Scores（スコア関連）

- **[ScoreCard](./scores/score-card.md)** - 個別試合カード
- **[ScoresList](./scores/scores-list.md)** - 試合リスト
- **[WeekSelector](./scores/week-selector.md)** - 週選択UI

#### News（ニュース関連）

- **[NewsCard](./news/news-card.md)** - ニュース記事カード
- **[NewsList](./news/news-list.md)** - ニュース記事リスト

#### Standings（順位表関連）

- **[StandingsSelector](./standings/standings-selector.md)** - 表示モード切り替え
- **[OverallTable](./standings/overall-table.md)** - 全体順位表
- **[ConferenceView](./standings/conference-view.md)** - カンファレンス別表示
- **[DivisionView](./standings/division-view.md)** - ディビジョン別表示

### UI Components（汎用UIコンポーネント）

shadcn/uiベースの再利用可能なUIコンポーネントです。

- **[UI Components](./ui/README.md)** - shadcn/uiコンポーネント一覧

## Server vs Client Components

### Server Components

**特徴:**
- サーバーサイドでのみレンダリング
- JavaScriptバンドルに含まれない
- React Hooksは使用不可

**使用ケース:**
- データ表示のみ
- ユーザーインタラクションなし
- SEOが重要

**例:**
- ScoresList, NewsList, OverallTable

### Client Components

**特徴:**
- ブラウザでレンダリング
- React Hooks使用可能
- ユーザーインタラクション処理

**使用ケース:**
- 状態管理が必要
- ユーザーイベント処理
- ブラウザAPI使用

**例:**
- Header, WeekSelector, StandingsSelector

## コンポーネントパターン

### 1. Props型定義

全てのコンポーネントにProps型を定義します。

```typescript
interface ComponentProps {
  prop1: string;
  prop2: number;
  children?: React.ReactNode;
}

export function Component({ prop1, prop2, children }: ComponentProps) {
  return <div>...</div>;
}
```

### 2. 早期リターン

条件によって何も表示しない場合は早期リターンします。

```typescript
export function Component({ items }: Props) {
  if (items.length === 0) {
    return <div>No items</div>;
  }

  return <div>...</div>;
}
```

### 3. レスポンシブデザイン

Tailwind CSSのレスポンシブクラスを使用します。

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

## コンポーネント階層

```
App
├── Header (Client)
├── Main
│   └── Page (Server)
│       └── Content (Server)
│           ├── Selector (Client)
│           └── List (Server)
│               └── Card (Server)
└── Footer (Server)
```

## 新しいコンポーネントの追加

### 1. ファイル作成

```bash
# 例: PlayerCard コンポーネント
touch src/components/players/PlayerCard.tsx
```

### 2. テンプレート

```typescript
// src/components/players/PlayerCard.tsx
interface PlayerCardProps {
  player: Player;
}

export function PlayerCard({ player }: PlayerCardProps) {
  return (
    <div className="p-4 border rounded-lg">
      <h3>{player.name}</h3>
      <p>{player.position}</p>
    </div>
  );
}
```

### 3. 使用

```typescript
import { PlayerCard } from '@/components/players/PlayerCard';

<PlayerCard player={player} />
```

---

**最終更新**: 2026年2月
