# Footer コンポーネント

## 概要

**ファイル:** `src/components/layout/Footer.tsx`
**タイプ:** Server Component
**役割:** アプリケーション全体のフッター

Footerコンポーネントは、アプリケーションの最下部に表示される静的なフッターです。データソースのクレジットとアプリケーション名を表示します。

---

## なぜServer Componentか

Footerは以下の理由でServer Componentとして実装されています:

1. **静的コンテンツ**: ユーザーインタラクションが不要
2. **状態管理不要**: 状態やイベントハンドラーが不要
3. **パフォーマンス**: JavaScriptバンドルサイズを削減
4. **SEO**: サーバーサイドレンダリングでクローラーに最適化

---

## Props

このコンポーネントはPropsを受け取りません（Props不要）。

```typescript
export function Footer() {
  // Props なし
}
```

---

## 実装の詳細

### 1. データソースクレジット

```tsx
<p className="text-center text-xs sm:text-sm leading-loose text-primary-foreground/80 md:text-left">
  Data provided by{' '}
  <a
    href="https://www.espn.com"
    target="_blank"
    rel="noopener noreferrer"
    className="font-medium underline underline-offset-4 hover:text-accent"
  >
    ESPN
  </a>
</p>
```

**特徴:**
- ESPNへのクレジットリンク
- `target="_blank"`: 新しいタブで開く
- `rel="noopener noreferrer"`: セキュリティのためのrel属性
- ホバー時にアクセントカラーに変化

### 2. アプリケーション名

```tsx
<p className="text-center text-xs sm:text-sm text-primary-foreground/80 md:text-right">
  NFL Stats App
</p>
```

**特徴:**
- アプリケーション名を表示
- モバイルでは中央揃え、デスクトップでは右揃え

---

## スタイリング

### コンテナ

```tsx
<footer className="border-t border-primary/20 bg-primary text-primary-foreground py-6 md:py-0">
```

**スタイル解説:**
- `border-t`: 上部に境界線
- `bg-primary`: テーマカラーの背景
- `text-primary-foreground`: テーマカラーに適したテキスト色
- `py-6 md:py-0`: モバイルで上下パディング、デスクトップでは高さで調整

### レイアウト

```tsx
<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
```

**レイアウト解説:**
- `max-w-7xl mx-auto`: コンテンツを中央に配置し最大幅を制限
- `flex flex-col md:flex-row`: モバイルで縦並び、デスクトップで横並び
- `items-center justify-between`: アイテムを中央揃えと両端揃え
- `md:h-16`: デスクトップで固定高さ

---

## レスポンシブ対応

### モバイル（< 768px）

- 縦並びレイアウト（`flex-col`）
- 中央揃え（`text-center`）
- 上下パディング（`py-6`）

### デスクトップ（≥ 768px）

- 横並びレイアウト（`md:flex-row`）
- 左右に分かれる（`justify-between`）
- 固定高さ（`md:h-16`）
- データソースは左揃え（`md:text-left`）
- アプリ名は右揃え（`md:text-right`）

---

## セキュリティ

### 外部リンク

```tsx
<a
  href="https://www.espn.com"
  target="_blank"
  rel="noopener noreferrer"
>
```

**セキュリティ対策:**
- `target="_blank"`: 新しいタブで開く
- `rel="noopener"`: `window.opener`へのアクセスを防ぐ
- `rel="noreferrer"`: リファラー情報を送信しない

これにより、外部サイトが元のページにアクセスできないようにします。

---

## コード例

### 基本的な使用方法

```tsx
import { Footer } from '@/components/layout/Footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <main>{children}</main>
      <Footer />
    </div>
  );
}
```

### レイアウト全体での使用

```tsx
// src/app/layout.tsx
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

---

## カスタマイズ例

### 追加情報の表示

```tsx
export function Footer() {
  return (
    <footer className="border-t border-primary/20 bg-primary text-primary-foreground py-6 md:py-0">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-xs sm:text-sm leading-loose text-primary-foreground/80 md:text-left">
          Data provided by{' '}
          <a
            href="https://www.espn.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-accent"
          >
            ESPN
          </a>
        </p>

        {/* 新規追加: バージョン情報 */}
        <p className="text-xs text-primary-foreground/60">v1.0.0</p>

        <p className="text-center text-xs sm:text-sm text-primary-foreground/80 md:text-right">
          NFL Stats App
        </p>
      </div>
    </footer>
  );
}
```

---

## アクセシビリティ

- **セマンティックHTML**: `<footer>`タグを使用
- **適切なコントラスト**: テキストと背景のコントラスト比が十分
- **リンクの明示**: 下線付きでリンクが明確に識別可能

---

## パフォーマンス

- **Server Component**: JavaScriptバンドルに含まれない
- **静的コンテンツ**: サーバーサイドで一度レンダリングされるだけ
- **軽量**: 最小限のDOMノードとスタイル

---

**最終更新**: 2026年2月
