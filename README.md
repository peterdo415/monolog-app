# ツリー項羽蔵例

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
│  │  ├─ schema/
│  │  ├─ migrations/
│  │  └─ client.ts
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
│  ├─ dev.Dockerfile             # 共通ベースイメージ
│  └─ compose.override.yml       # 個人環境の上書き
├─ docker-compose.yml            # Next・Nest・Supabase・PgAdmin を起動
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
├─ .dockerignore
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
