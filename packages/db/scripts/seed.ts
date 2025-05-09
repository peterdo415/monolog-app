// packages/db/scripts/seed.ts
import path from 'path';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { users } from '../src/schema';

// 1) 必ず最初に .env を読み込む
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

// 2) DB クライアント初期化
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool);

type UserRecord = { name: string; email: string; };

async function main() {
  // 3) テーブルがなければ作成
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id serial PRIMARY KEY,
      name varchar(255) NOT NULL,
      email varchar(255) NOT NULL UNIQUE,
      created_at timestamp DEFAULT now() NOT NULL
    );
  `);

  // 4) ダミーデータ生成
  const DUMMY_COUNT = 10;
  const records: UserRecord[] = Array.from({ length: DUMMY_COUNT }).map(() => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
  }));

  // 5) 一括挿入
  await db.insert(users).values(records);

  console.log(`✔ ${DUMMY_COUNT} 件のダミー・ユーザーを作成しました`);
}

main()
  .catch(err => {
    console.error('❌ シード実行中にエラー:', err);
    process.exit(1);
  })
  .finally(() => pool.end());
