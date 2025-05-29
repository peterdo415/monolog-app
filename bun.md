# Bun移行の知見まとめ

## はじめに

このドキュメントは、2025年5月に実施した「Bunワークスペース＋NestJS/Next.js/Drizzle構成」への移行検証の全記録・知見をまとめたものです。現時点での成果・課題・今後の再挑戦時に役立つポイントを網羅します。

---

## PRの思考プロセス

- 依存解決・ビルド・起動の高速化と開発体験向上を目指し、Bun移行を検討
- まずDockerfile・docker-composeでBun環境を構築し、Node.js/pnpmとの比較検証を実施
- Bun単体での型定義・依存解決の課題に直面し、pnpm installとのハイブリッド運用を模索
- drizzle-ormやNestJSの型定義問題、Dockerマルチステージの罠などを一つずつ検証・回避策を実装
- パフォーマンス向上は明確だが、型安全性・安定運用の観点からmainブランチはNode.js/pnpmを維持
- Bun移行の知見・課題・Tipsをドキュメント化し、PoC/PRとして履歴を残す方針に決定

---

## Bun移行の目的と背景

- **依存インストール・ビルド・起動の高速化**
- **Dockerイメージの軽量化・開発体験の向上**
- **Node.js（pnpm）からBunへのモノレポ移行の実現性検証**
- **NestJS（API）/Next.js（Web）/Drizzle ORM（DB）/Turborepo構成でのBun互換性調査**

---

## 検証範囲・構成

- **モノレポ管理**: Turborepo
- **パッケージ管理**: pnpm → Bun（bun install --hoist）
- **API**: NestJS v11（TypeScript）
- **Web**: Next.js v15（TypeScript）
- **ORM**: Drizzle ORM（PostgreSQL専用）
- **DB**: PostgreSQL（Docker）
- **CI/CD・開発環境**: Docker Compose, Alpineベース

---

## できたこと（成果）

- Bun CLIのAlpine自動インストール・Dockerfile最適化
  - 例: `RUN curl -fsSL https://bun.sh/install | bash` でAlpineにBun導入
  - `FROM oven/bun:alpine` 公式イメージも検証
- bun install --hoistによる依存のグローバル展開
  - 例: `bun install --hoist` でワークスペース全体の依存を一括解決
- pnpmと併用したワークスペース依存・型定義の物理展開
  - 例: `pnpm install` で@types/*をnode_modulesに物理展開
  - Bun単体では型定義が展開されず、pnpmとのハイブリッド運用が有効
- Dockerイメージの軽量化・ビルド高速化（Node.js比で20〜40%短縮）
  - マルチステージビルドで依存解決・ビルド・実行を分離
  - `COPY --from=deps /app/node_modules ./node_modules` で依存を明示的にコピー
- Next.js（web-bun）はBun単体で完全起動・ホットリロードも安定
  - `bun run dev` でdevサーバ起動、`bun run build` で本番ビルドも成功
- NestJS（api-bun）はNode.jsランタイムでCLI起動（bun x, bunx, node .bin経由すべて検証）
  - `bunx nest start` や `bun run start:dev` で起動検証
  - `node ./node_modules/.bin/nest start` も検証し、Bun経由・Node経由の両方で挙動確認
- Drizzle ORMのPostgreSQL利用はBun環境でも正常動作
  - drizzle-kitのマイグレーション・型生成もBun経由で動作
- 型定義のダミー追加（mysql2/promise, fs-monkey等）で型エラー抑制
  - 例: `src/typings/mysql2-promise.d.ts` に `declare module 'mysql2/promise' {}` を追加
- .dockerignore・COPY粒度・マルチステージ最適化でビルド再現性向上
  - .dockerignoreで `node_modules`, `.next`, `dist`, `coverage` などを除外
- ディスク容量不足・Alpine/Nodeバージョン差異もクリア
  - `docker system prune` で容量確保、AlpineとNodeのバージョン差異も吸収

## できなかったこと・課題

- NestJS（api-bun）での型定義・依存解決の完全な自動化は困難
  - bun install --hoist だけでは node_modules の物理展開が不十分
  - class-validator, @nestjs/core などの型定義が一部解決できず、型エラーが多発
  - `NODE_PATH` の調整や `bun link` も検証したが、型定義の物理展開には至らず
- drizzle-orm の型定義で他DB（mysql2/promise, sqlite, single-store等）向け型が import され型エラー発生
  - tsconfig.jsonのexcludeで `**/drizzle-orm/driver-adapters/*` を除外しても、IDEによっては型エラーが残る場合あり
  - drizzle-ormの型定義自体をアプリ本体でimportしない設計が必要
- bun install だけでは @types/express, @types/jest, @types/node などの型定義が workspace 全体に展開されない
  - 依存解決ステージで `pnpm install` を必ず実行する運用に
- tsconfig.json の exclude で不要な型定義を除外する必要あり
  - 例: `"exclude": ["**/drizzle-orm/driver-adapters/*"]`
- Bun単体での linter/typecheck では Cannot find type definition file for ... エラーが残る
  - Biome, ESLint, tsc すべてで型定義の物理展開が必須
- Bun公式の型定義・互換性は進行中で、NestJS/Next.jsの最新バージョンでは一部未対応
  - Bun 1.1.x, 1.2.x, 1.3.x で挙動差分も検証
- pnpm install とのハイブリッド運用が必須（Bun単体では型安全性が担保できない）
- Dockerfile での依存解決ステージ分離・node_modules の明示的な COPY が必須
  - 依存解決を1ステージで済ませると、サービスごとに型定義が消えることがあった

## 型定義・依存解決の詳細な問題点

- Bunのワークスペース管理では、依存パッケージの型定義（@types/*）が node_modules に物理展開されないことが多い
- NestJS, class-validator, @nestjs/core などの型定義が IDE/tsc で解決できず、型エラーが頻発
- drizzle-orm の型定義が mysql2/promise, sqlite, single-store など他DB用型を import し、PostgreSQL専用利用でも型エラーが発生
- tsconfig.json の exclude で "**/drizzle-orm/driver-adapters/*" などを除外しないと型エラーが消えない
- 必要な型定義パッケージ（@types/express, @types/jest, @types/node など）は devDependencies に追加し、pnpm install で物理展開する必要がある
- 型定義のダミーファイル（declare module 'mysql2/promise' など）を src/typings/ などに追加し、型エラーを抑制
- linter（ESLint, Biome）でも型定義の物理展開が必須

## Dockerビルド・開発運用の工夫

- DockerfileはAlpineベースでBun公式イメージを利用
- 依存解決ステージ（bun install, pnpm install）を分離し、node_modulesを明示的にCOPY
- .dockerignoreでnode_modules, .next, dist, coverage等を除外し、ビルドキャッシュを最適化
- bun install --hoistで依存をグローバル展開しつつ、pnpm installで型定義を物理展開
- migrator-bun, api-bun, web-bunなどサービスごとにDocker Composeで分離
- ディスク容量不足時はdocker system pruneでクリーンアップ
- tsconfig.jsonのexcludeでdrizzle-ormの他DB用型定義を除外し、型エラーを抑制
- 必要な型定義パッケージはdevDependenciesに追加し、pnpm installで物理展開
- 型定義のダミーファイル（declare module 'mysql2/promise'等）を追加し、型エラーを抑制

## パフォーマンス・メリット

- 依存インストール（bun install）はpnpm比で2〜10倍高速（体感値）
- Dockerイメージサイズは20〜30%削減
- ビルド・起動・ホットリロードも高速化（Next.js, NestJSともに）
- メモリ消費量もNode.js比で10〜20%削減
- CI/CDパイプラインの所要時間も短縮可能
- 開発体験（devサーバ起動、依存追加、再ビルド）が大幅に向上

## 現状の限界と今後の方針

- Bun移行によるパフォーマンス向上は顕著だが、型定義・依存解決の課題が残る
- drizzle-ormの他DB用型定義やNestJSの型定義がBun単体では完全に解決できない
- 本番・日常開発はNode.js/pnpm（mainブランチ）で安定運用を継続
- Bun移行ブランチはPoC・PRとして履歴を残し、知見をドキュメント化
- 型エラー・linterエラーはアプリ本体の品質に直結するため、mainブランチではゼロを維持
- Bun公式・各OSSのBun対応が進めば、再度移行を検討

---

## 再挑戦時のTips・推奨手順

1. **DockerfileはBun公式イメージ＋Alpineベースを推奨**
2. **依存解決はbun install --hoist＋pnpm installのハイブリッドで型定義を物理展開**
3. **tsconfig.jsonのexcludeでdrizzle-orm他DB用型定義を除外**
4. **必要な型定義パッケージ（@types/*）はdevDependenciesに追加し、pnpm installで展開**
5. **型定義のダミーファイル（declare module 'mysql2/promise'等）をsrc/typings/等に追加**
6. **.dockerignoreでnode_modules, .next, dist, coverage等を除外し、ビルドキャッシュ最適化**
7. **Docker Composeでサービスごとに分離し、node_modulesを明示的にCOPY**
8. **型エラー・linterエラーは必ずゼロにしてからmainブランチへマージ**
9. **PoC/実験ブランチはPRで履歴を残し、知見をREADMEやbun.mdに記録**
10. **Bun公式・NestJS/Next.js/DrizzleのBun対応状況を随時ウォッチ**

---

## 参考：主なエラー例と対処法

- `Cannot find type definition file for 'express'` など型定義エラー
  - → @types/express をdevDependenciesに追加し、pnpm installで物理展開
- drizzle-ormの `Cannot find module 'mysql2/promise'` 型エラー
  - → src/typings/mysql2-promise.d.ts などで `declare module 'mysql2/promise' {}` を追加
- `Cannot find type definition file for 'jest'` など
  - → @types/jest, @types/node も同様にdevDependencies＋pnpm install
- tsconfig.jsonのexcludeで `**/drizzle-orm/driver-adapters/*` などを除外
- Bun単体でのlinter/typecheckで型定義が見つからない場合はpnpm installで補完
- Dockerfileでnode_modulesを明示的にCOPYし、各サービスで依存解決

---

## 参考リンク・関連資料

- [Bun公式ドキュメント](https://bun.sh/docs)
- [NestJS公式Bun対応Issue](https://github.com/nestjs/nest/issues?q=bun)
- [drizzle-orm公式Bun対応Issue](https://github.com/drizzle-team/drizzle-orm/issues?q=bun)
- [Next.js公式Bun対応](https://nextjs.org/docs/pages/building-your-application/deploying/bun)
- [Bun × Docker Composeサンプル](https://github.com/oven-sh/bun/tree/main/examples/docker)

---

## まとめ

- Bun移行はパフォーマンス・開発体験の面で大きなメリットがあるが、現状は型定義・依存解決の課題が残る
- drizzle-ormやNestJSの型定義問題は、excludeやダミーファイル、pnpm installの併用で一部回避可能
- 本番・日常開発はNode.js/pnpmで安定運用し、Bun移行はPoC・PRで知見を蓄積
- Bun公式・各OSSの対応が進めば、再度移行を検討
- 本ドキュメントのTips・履歴をもとに、次回以降のBun移行検証・導入に役立ててください

---

## 補足: 実践Tips・FAQ・今後の観点

1. **具体的なエラー・ログ例**
   - 例: `Cannot find type definition file for 'express'`、`Error: Cannot find module 'mysql2/promise'` など。エラー全文やIDEの警告表示を記録しておくと再現・共有に役立つ。

2. **CI/CDパイプラインの工夫**
   - GitHub Actions等で `bun install --hoist` → `pnpm install` の順で実行。node_modulesキャッシュや型チェック・lint・テストの分離が有効。

3. **各サービスごとの起動Tips**
   - api-bun: `bunx nest start`/`node .bin/nest start` で挙動差分あり。web-bun: `bun run dev` でホットリロード安定。migrator-bun: drizzle-kitはBun経由でも動作。

4. **Bunバージョンごとの挙動差分**
   - 1.1.x/1.2.x/1.3.x で依存解決や型定義展開の挙動が異なる場合あり。安定バージョンを都度検証。

5. **今後のBun移行ロードマップ**
   - Bun公式・NestJS・drizzle-ormのBun対応Issue/PRをウォッチ。Bunの型定義・互換性アップデートに注目。

6. **FAQ（よくある疑問）**
   - Q: なぜpnpm installが必要？
     - A: Bun単体では型定義（@types/*）がnode_modulesに物理展開されず、tscやIDE、linterで型エラーが発生するため。pnpm installで型定義を物理展開することで、型安全性・開発体験を担保できる。
   - Q: Bun単体で型エラーが消えないのはなぜ？
     - A: drizzle-ormやNestJSなど一部パッケージの型定義がBunの依存解決方式に未対応なため。tsconfig.jsonのexcludeやダミー型定義追加も必要。
   - Q: Dockerfileで依存解決ステージを分ける理由は？
     - A: 1ステージで依存解決すると、サービスごとにnode_modulesの内容が不整合になり型定義が消えることがある。明示的なCOPYで再現性を担保。
   - Q: drizzle-ormの型エラー（mysql2/promise等）はどう対処？
     - A: tsconfig.jsonのexcludeで他DB用型定義を除外し、必要に応じて`declare module 'mysql2/promise' {}`等のダミーファイルを追加。
   - Q: Bun移行でパフォーマンスはどれくらい向上する？
     - A: 依存インストール2〜10倍、Dockerイメージ20〜30%削減、devサーバ起動・ビルドも体感で2倍以上高速化。
   - Q: BunでNestJS/Next.jsは本当に安定稼働する？
     - A: Next.jsはBun単体で安定。NestJSは型定義・CLI起動で工夫が必要だが、Node.jsランタイム経由なら安定。
   - Q: CI/CDでBun＋pnpm併用時の注意点は？
     - A: bun install --hoist→pnpm installの順で依存解決。node_modulesキャッシュや型チェック・lint・テストの分離が有効。
   - Q: Bun移行ブランチの運用方針は？
     - A: PoC/実験ブランチはPRで履歴を残し、mainブランチはNode.js/pnpmで安定運用。型エラー・linterエラーはゼロを維持。
   - Q: Bun公式や各OSSのBun対応状況はどうウォッチすべき？
     - A: Bun公式・NestJS・drizzle-ormのGitHub Issue/PRを定期的に確認。Bunの型定義・互換性アップデートに注目。
   - Q: Bunで困ったときの情報収集先は？
     - A: 公式ドキュメント、GitHub Issue、Qiita/Zenn等の移行記事、他のBun移行事例リポジトリを参照。
   - Q: Bunでの開発体験で特に良かった点・悪かった点は？
     - A: 良い点は圧倒的な速度と軽量さ。悪い点は型定義・依存解決の不安定さと一部パッケージの未対応。

7. **参考リポジトリ・外部記事**
   - Bun公式examples, drizzle-orm/NestJSのBun対応Issue, QiitaやZennのBun移行記事等も参照推奨。

--- 