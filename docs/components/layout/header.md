# Header コンポーネント

## 概要

**ファイル:** `src/components/layout/Header.tsx`
**タイプ:** Client Component
**役割:** アプリケーション全体のナビゲーションヘッダー

Headerコンポーネントは、アプリケーションの最上部に固定表示されるナビゲーションバーです。デスクトップとモバイルの両方に対応したレスポンシブデザインを採用しています。

---

## なぜClient Componentか

Headerは以下の理由でClient Componentとして実装されています:

1. **状態管理**: モバイルメニューの開閉状態を管理する必要がある
2. **インタラクション**: ユーザーがメニューをクリックして開閉する動作が必要
3. **動的スタイリング**: 現在のページに応じてナビゲーションリンクのスタイルを変更
4. **ブラウザAPI**: `usePathname()` フックを使用して現在のURLを取得

---

## Props

このコンポーネントはPropsを受け取りません（Props不要）。

```typescript
export function Header() {
  // Props なし
}
```

---

## 状態管理

### useState

```typescript
const [isOpen, setIsOpen] = useState(false);
```

- **isOpen**: モバイルメニューの開閉状態
- **setIsOpen**: メニューの開閉を制御する関数

### usePathname

```typescript
const pathname = usePathname();
```

Next.jsの`usePathname`フックを使用して現在のパスを取得し、アクティブなナビゲーションリンクを判定します。

---

## ナビゲーション配列

```typescript
const navigation = [
  { name: 'Live', href: '/' },
  { name: 'News', href: '/news' },
  { name: 'Schedule', href: '/schedule' },
  { name: 'Standings', href: '/standings' },
  { name: 'Teams', href: '/teams' },
];
```

この配列は、ヘッダーに表示するナビゲーションリンクを定義しています。新しいページを追加する場合は、この配列に追加するだけで自動的にナビゲーションに表示されます。

---

## 実装の詳細

### 1. ロゴとブランディング

```tsx
<Link href="/" className="flex items-center space-x-2">
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
      <span className="text-accent-foreground font-bold text-sm">NFL</span>
    </div>
    <span className="font-bold text-lg sm:text-xl tracking-tight">NFL Stats</span>
  </div>
</Link>
```

- NFLロゴを円形の背景に表示
- アプリケーション名を表示
- クリックするとホームページ（Live Scores）に遷移

### 2. デスクトップナビゲーション

```tsx
<nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
  {navigation.map((item) => (
    <Link
      key={item.href}
      href={item.href}
      className={cn(
        'px-4 py-2 rounded-md transition-colors whitespace-nowrap',
        pathname === item.href
          ? 'bg-accent text-accent-foreground font-semibold'
          : 'text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground'
      )}
    >
      {item.name}
    </Link>
  ))}
</nav>
```

**特徴:**
- `md:flex`で中画面以上のみ表示
- 現在のページは`pathname === item.href`で判定
- アクティブなリンクは背景色とフォントウェイトが変わる
- ホバー時のトランジション効果

### 3. モバイルメニュー（shadcn/ui Sheet）

```tsx
<Sheet open={isOpen} onOpenChange={setIsOpen}>
  <SheetTrigger asChild className="md:hidden">
    <button
      className="p-2 rounded-md text-primary-foreground hover:bg-primary-foreground/10"
      aria-label="Toggle menu"
    >
      {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </button>
  </SheetTrigger>
  <SheetContent side="right" className="w-64">
    <SheetHeader>
      <SheetTitle>Menu</SheetTitle>
    </SheetHeader>
    <nav className="flex flex-col space-y-2 mt-6">
      {navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setIsOpen(false)}
          className={cn(
            'px-4 py-3 rounded-md transition-colors text-base font-medium',
            pathname === item.href
              ? 'bg-accent text-accent-foreground font-semibold'
              : 'text-foreground hover:bg-accent/10'
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  </SheetContent>
</Sheet>
```

**特徴:**
- `md:hidden`で小画面のみ表示
- ハンバーガーメニューアイコン（Menu）とクローズアイコン（X）を切り替え
- 右側からスライドして表示（`side="right"`）
- リンクをクリックしたらメニューを自動で閉じる（`onClick={() => setIsOpen(false)}`）

---

## スタイリング

### Sticky ヘッダー

```tsx
<header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-primary text-primary-foreground shadow-lg">
```

- `sticky top-0`: スクロール時にヘッダーが上部に固定される
- `z-50`: 他の要素より上に表示
- `bg-primary`: テーマカラーの背景
- `shadow-lg`: 影をつけて浮いているように見せる

### レスポンシブ対応

- **モバイル（< 768px）**: ハンバーガーメニュー表示
- **デスクトップ（≥ 768px）**: 横並びのナビゲーション表示

---

## 使用しているコンポーネント

### shadcn/ui

- **Sheet**: モバイルメニューのスライドパネル
- **SheetContent**: メニューの内容
- **SheetHeader**: メニューのヘッダー
- **SheetTitle**: メニューのタイトル
- **SheetTrigger**: メニューを開くトリガー

### lucide-react

- **Menu**: ハンバーガーメニューアイコン
- **X**: クローズアイコン

### Next.js

- **Link**: クライアントサイドルーティング
- **usePathname**: 現在のパスを取得

---

## コード例

### 基本的な使用方法

```tsx
import { Header } from '@/components/layout/Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  );
}
```

### ナビゲーションの追加

新しいページを追加する場合、`navigation`配列に追加するだけです:

```typescript
const navigation = [
  { name: 'Live', href: '/' },
  { name: 'News', href: '/news' },
  { name: 'Schedule', href: '/schedule' },
  { name: 'Standings', href: '/standings' },
  { name: 'Teams', href: '/teams' },
  { name: 'Players', href: '/players' }, // 新規追加
];
```

---

## アクセシビリティ

- **aria-label**: モバイルメニューボタンに「Toggle menu」ラベルを追加
- **キーボード操作**: すべてのリンクとボタンはキーボードで操作可能
- **視覚的フィードバック**: ホバー時とアクティブ時に明確なスタイル変更

---

## パフォーマンス最適化

- **条件付きレンダリング**: デスクトップとモバイルで異なる要素を表示（`hidden md:flex`）
- **CSS変数**: テーマカラーをCSS変数で管理（`bg-primary`, `text-primary-foreground`）
- **Transition**: スムーズなアニメーション（`transition-colors`）

---

**最終更新**: 2026年2月
