// packages/db/drizzle.config.ts
import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
import { join } from "path";

dotenv.config({ path: join(__dirname, "../../.env") });

export default defineConfig({
  // 「packages/db」直下で実行する前提なので、ここは相対パスで "./" から始める
  schema: "./schema/index.ts",

  // migrations フォルダも同様に相対指定
  out: "./migrations",

  // 必須パラメータ
  dialect: "postgresql",

  dbCredentials: {
    url: process.env.DATABASE_URL!
  },

  migrations: {
    prefix: "timestamp"  // または "supabase" など
  },

  verbose: true,
  strict: true
});
