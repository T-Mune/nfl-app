# テクノロジースタック

このドキュメントでは、NFL Stats Webアプリケーションで使用している技術スタックの詳細とバージョン情報を説明します。

## Core Framework（コアフレームワーク）

### Next.js 16.1.6

**役割**: Reactベースのフルスタック Webフレームワーク

Next.jsは、このアプリケーションの基盤となるフレームワークです。サーバーサイドレンダリング（SSR）、静的サイト生成（SSG）、ルーティング、APIルートなど、モダンWebアプリケーションに必要な機能を統合的に提供します。

**主な機能:**
- **App Router**: ファイルシステムベースのルーティング（`src/app/`ディレクトリ）
- **Server Components**: サーバーサイドでのReactコンポーネントレンダリング
- **Suspense ストリーミング**: 段階的なページレンダリング
- **自動コード分割**: ルートごとに自動的にJavaScriptを分割
- **画像最適化**: 自動的な画像の最適化とレスポンシブ対応
- **ISR（Incremental Static Regeneration）**: 静的ページの増分再生成

**選定理由:**
- React エコシステムで最も成熟したフレームワーク
- Vercel（開発元）による優れたサポートと継続的なアップデート
- SEOとパフォーマンスに優れたServer-First アーキテクチャ
- 開発体験（DX）が非常に優れている

**公式サイト**: https://nextjs.org/

### React 19.2.3

**役割**: UIライブラリ

Reactは、ユーザーインターフェースを構築するためのJavaScriptライブラリです。コンポーネントベースのアプローチにより、再利用可能で保守性の高いUIを作成できます。

**主な機能:**
- **コンポーネント**: UIを小さな部品に分割
- **Virtual DOM**: 効率的なDOMの更新
- **Hooks**: 状態管理やライフサイクル処理
- **Server Components**: サーバーサイドでのコンポーネントレンダリング（React 19の新機能）

**選定理由:**
- 業界標準のUIライブラリ
- 豊富なエコシステムとコミュニティ
- Next.js との完璧な統合
- React 19の新機能（Server Components、Actions）を活用

**公式サイト**: https://react.dev/

### TypeScript 5

**役割**: 静的型付けJavaScriptスーパーセット

TypeScriptは、JavaScriptに静的型システムを追加した言語です。コンパイル時に型エラーを検出し、より安全で保守性の高いコードを書くことができます。

**主な機能:**
- **静的型チェック**: コンパイル時にバグを検出
- **インテリセンス**: IDE の自動補完とコード補助
- **インターフェース**: データ構造の明確な定義
- **Generics**: 型の再利用性を高める
- **Union Types**: 複数の型を許容する柔軟な型定義

**選定理由:**
- 大規模アプリケーションでのバグ削減
- 開発体験の大幅な向上
- リファクタリングの安全性
- Next.js と React が公式にサポート

**このプロジェクトでの使用例:**
- `src/types/nfl.ts`: アプリケーションのドメイン型定義
- `src/types/espn.ts`: ESPN API レスポンスの型定義
- 全てのコンポーネントProps、関数の引数・戻り値に型定義

**公式サイト**: https://www.typescriptlang.org/

## Styling & UI（スタイリングとUI）

### Tailwind CSS v4

**役割**: ユーティリティファーストのCSSフレームワーク

Tailwind CSSは、予め定義されたユーティリティクラスを組み合わせてスタイルを作成するCSSフレームワークです。カスタムCSSを書くことなく、一貫性のあるデザインを実現できます。

**主な機能:**
- **ユーティリティクラス**: `flex`, `text-center`, `bg-primary` などの小さなクラス
- **レスポンシブデザイン**: `sm:`, `md:`, `lg:` などのプレフィックス
- **ダークモード**: `dark:` プレフィックスによるダークテーマ対応
- **CSS変数**: カスタムプロパティによるテーマシステム
- **Just-in-Time モード**: 使用されているクラスのみをビルド

**選定理由:**
- 開発速度の向上（CSSファイルを行き来する必要がない）
- デザインの一貫性（定義済みのスケールとカラーパレット）
- パフォーマンス（未使用のCSSが含まれない）
- レスポンシブデザインが容易

**このプロジェクトでの使用例:**
```tsx
<div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
  <h1 className="text-2xl sm:text-3xl font-bold text-primary">Live Scores</h1>
</div>
```

**公式サイト**: https://tailwindcss.com/

### shadcn/ui

**役割**: 再利用可能なUIコンポーネントライブラリ

shadcn/uiは、Radix UIをベースにした、コピー&ペーストで使用できるコンポーネント集です。npmパッケージとしてインストールするのではなく、ソースコードをプロジェクトに直接追加する方式です。

**使用しているコンポーネント:**
- **Card**: コンテンツのコンテナ（`src/components/ui/card.tsx`）
- **Badge**: ラベルとタグ（`src/components/ui/badge.tsx`）
- **Button**: クリック可能なボタン（`src/components/ui/button.tsx`）
- **Table**: データテーブル（`src/components/ui/table.tsx`）
- **Tabs**: タブナビゲーション（`src/components/ui/tabs.tsx`）
- **Select**: ドロップダウン選択（`src/components/ui/select.tsx`）
- **Sheet**: スライドインメニュー（`src/components/ui/sheet.tsx`）

**選定理由:**
- **カスタマイズ性**: ソースコードを直接編集できる
- **アクセシビリティ**: Radix UIによる優れたアクセシビリティ
- **依存関係の削減**: 必要なコンポーネントのみをプロジェクトに追加
- **Tailwind CSS との統合**: Tailwindクラスでスタイリングされている

**公式サイト**: https://ui.shadcn.com/

### Radix UI

**役割**: アクセシブルなUIプリミティブ

Radix UIは、shadcn/uiの基盤となるヘッドレスUIライブラリです。アクセシビリティとキーボードナビゲーションが標準で組み込まれています。

**使用しているパッケージ:**
- `@radix-ui/react-dialog`: ダイアログ・モーダル
- `@radix-ui/react-select`: セレクトボックス
- `@radix-ui/react-slot`: コンポーネント合成
- `@radix-ui/react-tabs`: タブコンポーネント

**選定理由:**
- WAI-ARIA 準拠のアクセシビリティ
- キーボードナビゲーション対応
- スタイルを自由にカスタマイズ可能

**公式サイト**: https://www.radix-ui.com/

### lucide-react 0.563.0

**役割**: アイコンライブラリ

lucide-reactは、美しく一貫性のあるアイコンのコレクションです。

**使用しているアイコン:**
- **Menu**: ハンバーガーメニュー（モバイル）
- **X**: 閉じるボタン
- **ExternalLink**: 外部リンク表示

**選定理由:**
- 軽量で高品質なアイコン
- Reactコンポーネントとして提供
- Tailwindクラスでスタイリング可能

**公式サイト**: https://lucide.dev/

## State Management & Data Fetching（状態管理とデータ取得）

### @tanstack/react-query 5.90.20

**役割**: サーバーステート管理ライブラリ

React Queryは、サーバーからのデータ取得、キャッシング、同期を簡単にするライブラリです。

**主な機能:**
- **自動キャッシング**: フェッチしたデータを自動的にキャッシュ
- **自動再検証**: データが古くなったら自動的に再取得
- **Loading/Error 状態**: データ取得状態を簡単に管理
- **デバウンス/スロットリング**: リクエストの最適化

**選定理由:**
- サーバーステート管理のベストプラクティス
- Next.js との優れた統合
- 開発体験の向上

**このプロジェクトでの使用:**
- 現在はプロバイダーとして設定されていますが、将来的なクライアントサイドのデータフェッチングに備えています
- `src/components/providers/QueryProvider.tsx`

**公式サイト**: https://tanstack.com/query/

## Utilities（ユーティリティ）

### date-fns 4.1.0

**役割**: 日時操作ライブラリ

date-fnsは、JavaScriptの日付を簡単に操作・フォーマットするためのライブラリです。

**主な機能:**
- 日付のフォーマット（`format`）
- 相対時刻（`formatDistanceToNow`）
- 日付の比較と計算
- タイムゾーン対応

**選定理由:**
- モジュラー設計（必要な関数のみをインポート）
- Immutable（元の日付を変更しない）
- TypeScript 対応

**このプロジェクトでの使用:**
```typescript
// ニュース記事の公開日時をフォーマット
formatDistanceToNow(new Date(article.publishedDate), { addSuffix: true })
// 例: "2 hours ago"
```

**公式サイト**: https://date-fns.org/

### clsx 2.1.1 & tailwind-merge 3.4.0

**役割**: クラス名の結合とマージ

これらのユーティリティは、条件付きクラス名の生成とTailwindクラスの競合解決を行います。

**clsx:**
- 条件付きクラス名の生成
- 複数のクラス名を結合

**tailwind-merge:**
- Tailwindクラスの競合を解決
- 後から指定されたクラスが優先

**このプロジェクトでの使用:**
```typescript
// src/lib/utils.ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 使用例
<div className={cn(
  'px-4 py-2',
  isActive ? 'bg-accent' : 'bg-secondary'
)}>
```

### class-variance-authority 0.7.1

**役割**: バリアント（変種）ベースのコンポーネントスタイリング

CVAは、コンポーネントのバリアントを型安全に定義するためのユーティリティです。

**このプロジェクトでの使用:**
- shadcn/uiコンポーネントのバリアント定義
- `variant`, `size` などのPropsによるスタイル切り替え

**使用例:**
```typescript
const buttonVariants = cva(
  'base-classes',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        outline: 'border border-input bg-background',
      },
    },
  }
)
```

## Build & Development Tools（ビルドと開発ツール）

### ESLint 9

**役割**: JavaScriptコードの静的解析ツール

ESLintは、コードの品質とスタイルを保つためのリンティングツールです。

**設定:**
- `eslint-config-next`: Next.js 推奨の設定

**選定理由:**
- コードの一貫性を保つ
- 潜在的なバグを早期に発見
- ベストプラクティスの強制

### PostCSS & @tailwindcss/postcss

**役割**: CSS変換ツール

PostCSSは、CSSを変換するためのツールで、Tailwind CSSのビルドに使用されます。

**設定:**
- `@tailwindcss/postcss ^4`: Tailwind CSS v4のPostCSSプラグイン

## Dependencies Summary（依存関係サマリー）

### Production Dependencies（本番環境の依存関係）

```json
{
  "@radix-ui/react-dialog": "^1.1.15",
  "@radix-ui/react-select": "^2.2.6",
  "@radix-ui/react-slot": "^1.2.4",
  "@radix-ui/react-tabs": "^1.1.13",
  "@tanstack/react-query": "^5.90.20",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "date-fns": "^4.1.0",
  "lucide-react": "^0.563.0",
  "next": "16.1.6",
  "react": "19.2.3",
  "react-dom": "19.2.3",
  "tailwind-merge": "^3.4.0"
}
```

### Development Dependencies（開発環境の依存関係）

```json
{
  "@tailwindcss/postcss": "^4",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "eslint": "^9",
  "eslint-config-next": "16.1.6",
  "tailwindcss": "^4",
  "tw-animate-css": "^1.4.0",
  "typescript": "^5"
}
```

## バージョン管理ポリシー

### セマンティックバージョニング

このプロジェクトの依存関係は、セマンティックバージョニング（SemVer）に従っています:

- **^（キャレット）**: マイナーバージョンとパッチバージョンの更新を許可
  - 例: `^5.90.20` → `5.91.0` や `5.90.21` は許可、`6.0.0` は不許可
- **固定バージョン**: メジャーフレームワーク（Next.js, React）は固定
  - 例: `"next": "16.1.6"` → 手動でのみ更新

### 更新戦略

- **セキュリティアップデート**: 発見次第すぐに適用
- **マイナー/パッチアップデート**: 月次で確認・適用
- **メジャーアップデート**: 慎重に評価し、テスト後に適用

## 技術選定の原則

このプロジェクトでは、以下の原則に基づいて技術を選定しています:

1. **成熟度**: 安定性とコミュニティサポートが確立されている技術
2. **統合性**: 他の技術と良好に統合できる技術
3. **パフォーマンス**: 高速で効率的な技術
4. **開発体験**: 開発者の生産性を向上させる技術
5. **長期サポート**: 長期的にメンテナンスされる技術

---

**最終更新**: 2026年2月
**対象読者**: エンジニア、AI、技術アーキテクト
