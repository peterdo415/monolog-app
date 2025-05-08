// packages/db/drizzle.config.ts
import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: process.cwd() + "/.env" });

export default defineConfig({
  // 「packages/db」直下で実行する前提なので、ここは相対パスで "./" から始める
  schema: "./schema/index.ts",

  // migrations フォルダも同様に相対指定
  out: "./migrations",

  // 必須パラメータ
  dialect: "postgresql",

  dbCredentials: {
    connectionString: process.env.DATABASE_URL!
  },

  migrations: {
    prefix: "timestamp"  // または "supabase" など
  },

  verbose: true,
  strict: true
});
