# 技術スタック
各項目ごとに、**主な利用目的**や**依存関係**も明記します。

---

## 1. フロントエンド

| 項目 | 内容・バージョン | 主な利用目的・依存関係 |
|------|------------------|-----------------------|
| フレームワーク | Next.js v15.3.0 | SSR/SSG/SPA対応のReactアプリ基盤。 |
| 言語 | TypeScript v5.8.2<br>JavaScript | 型安全な開発。全体でTypeScriptを標準利用。 |
| UIライブラリ | React v19.1.0<br>ReactDOM v19.1.0 | UI構築の基盤。Next.jsのコア依存。 |
| 状態管理/データ取得 | @tanstack/react-query v5.75.6 | API通信・キャッシュ管理。 |
| スタイリング | Tailwind CSS v3.3.3<br>PostCSS v8.5.3<br>Autoprefixer v10.4.21 | ユーティリティファーストCSS。PostCSS経由でビルド。 |
| 型定義 | @types/react v19.1.0<br>@types/react-dom v19.1.1<br>@types/node v22.15.3 | TypeScript用型定義。 |
| Lint/Format | ESLint v9.26.0<br>Prettier v3.5.3 | コード品質・自動整形。独自ESLint configを利用。 |
| 共通UI | @monolog/ui | モノレポ内の共通Reactコンポーネント群。 |

---

## 2. バックエンド

| 項目 | 内容・バージョン | 主な利用目的・依存関係 |
|------|------------------|-----------------------|
| フレームワーク | NestJS v11.0.7 | モジュール指向のAPIサーバ。Expressベース。 |
| 言語 | TypeScript v5.8.2 | 型安全なサーバ開発。 |
| バリデーション | class-validator v0.14.2<br>class-transformer v0.5.1 | DTOバリデーション・変換。 |
| 設定管理 | dotenv v16.4.5<br>@nestjs/config v4.0.2 | .envファイルによる環境変数管理。 |
| リアクティブ | rxjs v7.0.0 | 非同期処理・ストリーム。 |
| メタデータ | reflect-metadata v0.1.13 | デコレーター利用のため。 |
| Lint/Format | ESLint v9.26.0<br>Prettier v3.5.3 | コード品質・自動整形。 |
| テスト | Jest v29.0.0<br>Supertest v6.3.3 | 単体・E2Eテスト。 |
| 共通設定 | @monolog/eslint-config<br>@monolog/typescript-config | モノレポ内の共通設定。 |

---

## 3. データベース・ORM

| 項目 | 内容・バージョン | 主な利用目的・依存関係 |
|------|------------------|-----------------------|
| DB | PostgreSQL v15-alpine | RDBMS本体。Dockerで稼働。 |
| ORM | Drizzle ORM v0.43.1 | 型安全なDB操作。 |
| マイグレーション | drizzle-kit v0.31.1 | DBマイグレーション管理。 |
| DBクライアント | pg v8.15.6 | Node.js用PostgreSQLクライアント。 |
| シード | ts-node v10.9.2 | TypeScriptでDB初期データ投入。 |
| 型定義 | @types/pg v8.15.0 | pg用型定義。 |
| テストデータ | @faker-js/faker v9.7.0 | シード用ダミーデータ生成。 |

---

## 4. モノレポ管理・共通基盤

| 項目 | 内容・バージョン | 主な利用目的・依存関係 |
|------|------------------|-----------------------|
| モノレポ管理 | TurboRepo v2.5.3 | 複数パッケージのビルド・依存管理。 |
| パッケージ管理 | pnpm v10.10.0 | 高速なパッケージ管理。 |
| 共通UI | @monolog/ui | フロントエンドで利用。 |
| 共通TypeScript設定 | @monolog/typescript-config | 各パッケージでextends。 |
| 共通ESLint設定 | @monolog/eslint-config | 各パッケージでextends。 |
| 共通tsconfig | packages/tsconfig | nextjs, nestjs, react-library用プリセット。 |

---

## 5. 開発環境・インフラ

| 項目 | 内容・バージョン | 主な利用目的・依存関係 |
|------|------------------|-----------------------|
| コンテナ | Docker (node:20-slim, postgres:15-alpine) | 開発・本番環境の統一。 |
| オーケストレーション | docker-compose v3.9 | サービス連携・起動管理。 |
| ホットリロード | NestJS, Next.js devモード | 開発効率向上。 |
| DB初期化 | drizzle-kit + Docker init script | DB自動マイグレーション。 |
| 環境変数管理 | dotenv, .envファイル | 各サービスの設定。 |

---

## 6. テスト・静的解析・フォーマット

| 項目 | 内容・バージョン | 主な利用目的・依存関係 |
|------|------------------|-----------------------|
| テスト | Jest, Supertest | API/ユニット/E2Eテスト。 |
| 静的解析 | ESLint, @next/eslint-plugin-next, eslint-plugin-react, eslint-plugin-turbo, eslint-config-prettier | コード品質維持。 |
| コードフォーマット | Prettier | コード整形。 |
| 型チェック | TypeScript, tsc | 型安全性担保。 |

---

## 7. その他

| 項目 | 内容・バージョン | 主な利用目的・依存関係 |
|------|------------------|-----------------------|
| Node.js | v18以上（node:20-slim） | 全体の実行環境。 |
| .env管理 | dotenv, .env | 環境ごとの設定切り替え。 |

---

### 依存関係の例（抜粋）

- **Next.js** → React, ReactDOM, TypeScript, Tailwind CSS, ESLint, Prettier
- **NestJS** → TypeScript, class-validator, dotenv, rxjs, reflect-metadata, Jest, Supertest
- **Drizzle ORM** → drizzle-kit, pg, dotenv, ts-node
- **TurboRepo** → 各パッケージのビルド・依存解決を統括
- **Docker/Docker Compose** → Node.js, PostgreSQL, drizzle-kit, NestJS, Next.js

---

### まとめ

- **全体構成**: TurboRepoによるモノレポ、pnpmによるパッケージ管理、Docker Composeによる開発環境統一
- **フロントエンド**: Next.js + React + Tailwind CSS + TypeScript
- **バックエンド**: NestJS + TypeScript + Drizzle ORM + PostgreSQL
- **共通基盤**: 独自UI/ESLint/TypeScript設定パッケージ
- **開発効率**: ホットリロード、マイグレーション自動化、共通設定の徹底

---

# ツリー構造例

.
├─ apps/
│  ├─ web/                       # Next.js 15 (Amplify にデプロイ)
│  │  ├─ app/
│  │  │  ├─ page.tsx
│  │  │  ├─ layout.tsx
│  │  │  └─ components/          # ページ固有や極小 UI
│  │  ├─ public/
│  │  ├─ next.config.ts
│  │  ├─ tsconfig.json           # extends ../../tsconfig.base.json
│  │  ├─ package.json
│  │  └─ Dockerfile
│  └─ api/                       # Nest.js 11 (Lambda/ECR)
│     ├─ src/
│     │  ├─ main.ts
│     │  └─ modules/             # Feature modules
│     ├─ test/
│     ├─ nest-cli.json           # "monorepo": true
│     ├─ tsconfig.json
│     ├─ package.json
│     └─ Dockerfile
├─ packages/
│  ├─ ui/                        # shadcn‑ui ラッパー & Storybook
│  │  └─ index.ts
│  ├─ db/                        # Drizzle schema / migrations
│  │  ├─ schema/                 # DBスキーマ・テーブル定義
│  │  ├─ types/                  # 型定義（必要なら）
│  │  ├─ client/                 # DBクライアント
│  │  ├─ seed/                   # シードスクリプト
│  │  ├─ migrations/             # マイグレーション
│  │  ├─ docker/                 # 初期SQL等
│  │  └─ package.json
│  ├─ auth/                      # Better Auth + Drizzle adapters
│  ├─ config/                    # 共通 ESLint/Biome/TS 設定
│  │  ├─ eslint.config.js
│  │  ├─ biome.json
│  │  └─ tsconfig.base.json
│  └─ lambdas/                   # 補助 Lambda (TS / Python)
│     ├─ ts/
│     └─ python/
├─ infra/
│  └─ terraform/
│     ├─ modules/
│     │  ├─ network/
│     │  ├─ rds/
│     │  ├─ amplify/
│     │  ├─ ecr/
│     │  └─ lambda/
│     └─ environments/
│        ├─ dev/
│        │  ├─ main.tf
│        │  └─ backend.hcl
│        └─ prod/
│           ├─ main.tf
│           └─ backend.hcl
├─ docker/
│  ├─ .dockerignore
│  ├─ dev.Dockerfile             # 共通ベースイメージ
│  └─ compose.override.yml       # 個人環境の上書き
├─ docker/docker-compose.yml            # Next・Nest・Supabase・PgAdmin を起動
├─ .github/
│  └─ workflows/
│     ├─ ci-web.yml              # build → Amplify Artifact upload
│     ├─ ci-api.yml              # build → ECR push → Lambda update
│     ├─ docker-publish.yml      # 共通 image build (optional)
│     └─ terraform-plan.yml      # PR 時に `terraform plan`
├─ turbo.json                    # Turborepo pipeline 設定
├─ package.json                  # root workspace 定義
├─ tsconfig.base.json            # compilerOptions 共通
├─ biome.json                    # ルート設定
├─ .gitignore
├─ .env.example
└─ README.md

# NestJS BFF
src/
├─ app.module.ts
├─ main.ts
└─ modules/
   ├─ users/  
   │  ├─ dto/  
   │  │  ├─ create-user.dto.ts  
   │  │  └─ update-user.dto.ts  
   │  ├─ users.controller.ts    ← POST/PATCH/DELETE  
   │  ├─ users.service.ts  
   │  └─ users.module.ts  
   └─ auth/  
      ├─ auth.controller.ts  
      ├─ auth.service.ts  
      └─ auth.module.ts  


# 依存関係について
web,api直下のpackage.jsonは残す
ベストプラクティス：設定は「中央集中＋最小オーバーライド」
共通設定は packages/typescript-config/* にまとめる

Next.js や Nest.js 向けの tsconfig（nextjs.json / nestjs.json）はここだけに置く。

たとえば target や moduleResolution といった compilerOptions はすべて中央のファイルで定義。

アプリ側の tsconfig.json は「extends + include/exclude のみ」

```jsonc
{
  "extends": "@monolog/typescript-config/nextjs.json",
  "include": ["app/**/*.ts", "app/**/*.tsx"],
  "exclude": ["node_modules", ".next"]
}
```

compilerOptions は一切書かず、中央の設定を丸ごと継承。

アプリ固有にどうしてもオーバーライドが必要な場合だけ、そのプロパティを上に書く。

package.json はワークスペースの管理とスクリプト／依存だけ

TypeScript の設定はここには書かず、あくまで依存パッケージ（typescript、@types/*、drizzle-orm など）と実行スクリプトだけに留める。

中央設定との間で scripts が重複する場合は、アプリ側にスクリプトをまとめ、共通化が望ましければ root の package.json にだけ定義してワークスペース経由で叩く運用もあります。
