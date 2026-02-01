# UIコンポーネント（shadcn/ui）

## 概要

このドキュメントでは、プロジェクトで使用されているshadcn/uiコンポーネントの一覧と使用方法を説明します。

shadcn/uiは、Radix UIとTailwind CSSをベースにした再利用可能なコンポーネントライブラリです。コンポーネントはプロジェクトにコピーされ、カスタマイズ可能です。

---

## 使用中のコンポーネント

### 1. Card

**ファイル:** `src/components/ui/card.tsx`

**説明:** カード型のコンテナコンポーネント。境界線、パディング、影付きのボックスを提供します。

**サブコンポーネント:**
- `Card`: カードのルートコンテナ
- `CardHeader`: カードのヘッダー
- `CardTitle`: カードのタイトル
- `CardDescription`: カードの説明
- `CardContent`: カードのメインコンテンツ
- `CardFooter`: カードのフッター

**使用例:**
```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content goes here.</p>
  </CardContent>
</Card>
```

**使用箇所:**
- ScoreCard
- NewsCard
- StandingsSelector（Cardは`Table`をラップ）
- DivisionView

---

### 2. Badge

**ファイル:** `src/components/ui/badge.tsx`

**説明:** テキストラベルやステータス表示に使用する小さなバッジコンポーネント。

**Variant:**
- `default`: デフォルトスタイル（プライマリカラー）
- `secondary`: セカンダリカラー
- `destructive`: 警告色（赤）
- `outline`: 境界線のみ

**使用例:**
```tsx
import { Badge } from '@/components/ui/badge';

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

**使用箇所:**
- ScoreCard（LIVEバッジ、Red Zoneバッジ）
- NewsCard（カテゴリバッジ、Premiumバッジ）

---

### 3. Table

**ファイル:** `src/components/ui/table.tsx`

**説明:** データテーブルを表示するコンポーネント。セマンティックHTMLとTailwindスタイルを組み合わせます。

**サブコンポーネント:**
- `Table`: テーブルのルート
- `TableHeader`: テーブルヘッダー
- `TableBody`: テーブルボディ
- `TableFooter`: テーブルフッター
- `TableRow`: テーブル行
- `TableHead`: ヘッダーセル
- `TableCell`: データセル
- `TableCaption`: テーブルキャプション

**使用例:**
```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Age</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>30</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

**使用箇所:**
- OverallTable
- ConferenceView
- DivisionView

---

### 4. Tabs

**ファイル:** `src/components/ui/tabs.tsx`

**説明:** タブインターフェースを提供するコンポーネント。複数のビューを切り替えることができます。

**サブコンポーネント:**
- `Tabs`: タブのルートコンテナ
- `TabsList`: タブボタンのリスト
- `TabsTrigger`: 個別のタブボタン
- `TabsContent`: タブの内容

**使用例:**
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    <p>Content for Tab 1</p>
  </TabsContent>
  <TabsContent value="tab2">
    <p>Content for Tab 2</p>
  </TabsContent>
</Tabs>
```

**使用箇所:**
- StandingsSelector（Overall/Conference/Divisionの切り替え）

---

### 5. Button

**ファイル:** `src/components/ui/button.tsx`

**説明:** ボタンコンポーネント。複数のバリエーションとサイズを提供します。

**Variant:**
- `default`: デフォルトスタイル
- `destructive`: 削除や警告アクション
- `outline`: 境界線のみ
- `secondary`: セカンダリカラー
- `ghost`: 背景なし
- `link`: リンクスタイル

**Size:**
- `default`: 標準サイズ
- `sm`: 小サイズ
- `lg`: 大サイズ
- `icon`: アイコン専用

**使用例:**
```tsx
import { Button } from '@/components/ui/button';

<Button>Click me</Button>
<Button variant="outline">Outline</Button>
<Button size="sm">Small</Button>
```

**使用箇所:**
- WeekSelector（前週/次週ボタン）

---

### 6. Sheet

**ファイル:** `src/components/ui/sheet.tsx`

**説明:** スライドインパネル（ドロワー）コンポーネント。モバイルメニューなどに使用します。

**サブコンポーネント:**
- `Sheet`: ルートコンテナ
- `SheetTrigger`: パネルを開くトリガー
- `SheetContent`: パネルの内容
- `SheetHeader`: パネルのヘッダー
- `SheetTitle`: パネルのタイトル
- `SheetDescription`: パネルの説明
- `SheetFooter`: パネルのフッター

**使用例:**
```tsx
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

<Sheet>
  <SheetTrigger asChild>
    <Button>Open</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Title</SheetTitle>
    </SheetHeader>
    <p>Sheet content goes here.</p>
  </SheetContent>
</Sheet>
```

**使用箇所:**
- Header（モバイルメニュー）

---

## インストール方法

shadcn/uiコンポーネントは、CLIでインストールできます:

```bash
# コンポーネントを追加
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add table
npx shadcn@latest add tabs
npx shadcn@latest add button
npx shadcn@latest add sheet
```

---

## カスタマイズ

### Tailwind CSS変数

すべてのコンポーネントは、Tailwind CSS変数を使用してスタイリングされています。テーマカラーは`src/app/globals.css`で定義されています:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    /* ... */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... */
  }
}
```

---

## コンポーネントのカスタマイズ

shadcn/uiコンポーネントは`src/components/ui/`にコピーされているため、自由にカスタマイズできます。

**例: Badgeのカスタムバリアント追加**

```tsx
// src/components/ui/badge.tsx
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // カスタムバリアント追加
        success: "border-transparent bg-green-500 text-white hover:bg-green-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
```

---

## ベストプラクティス

### 1. asChild パターン

```tsx
<SheetTrigger asChild>
  <Button>Open Menu</Button>
</SheetTrigger>
```

`asChild`を使用すると、ラッパーなしで子要素にプロップを渡せます。

---

### 2. className結合

```tsx
import { cn } from '@/lib/utils';

<Badge className={cn("text-xs", isPremium && "bg-yellow-500")}>
  Premium
</Badge>
```

`cn`ヘルパーで条件付きクラスを結合します。

---

### 3. Variant型の活用

```tsx
import { type VariantProps } from "class-variance-authority";

type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>;
```

TypeScriptで型安全なバリアント使用。

---

## 公式ドキュメント

- **shadcn/ui**: https://ui.shadcn.com/
- **Radix UI**: https://www.radix-ui.com/
- **Tailwind CSS**: https://tailwindcss.com/

---

## 今後追加されるかもしれないコンポーネント

- **Select**: ドロップダウン選択（現在はnative `<select>`を使用）
- **Dialog**: モーダルダイアログ
- **Dropdown Menu**: ドロップダウンメニュー
- **Tooltip**: ツールチップ
- **Skeleton**: ローディングスケルトン

---

**最終更新**: 2026年2月
