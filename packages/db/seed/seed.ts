// packages/db/scripts/seed.ts
import path from 'path';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { users, itemCategories, units, locations, householdItems } from '../schema/index';
import { eq } from 'drizzle-orm';

// 1) 必ず最初に .env を読み込む
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

// 2) DB クライアント初期化
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool);

type NewUserRecord = typeof users.$inferInsert;
type NewHouseholdItem = typeof householdItems.$inferInsert;

async function main() {
  // 3) テーブルがなければ作成
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id serial PRIMARY KEY,
      name varchar(255) NOT NULL,
      email varchar(255) NOT NULL UNIQUE,
      password varchar(255) NOT NULL,
      created_at timestamp DEFAULT now() NOT NULL
    );
  `);

  // 4) ダミーデータ生成
  const DUMMY_COUNT = 10;
  const records: NewUserRecord[] = Array.from({ length: DUMMY_COUNT }).map(() => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }));

  // 5) 一括挿入
  await db.insert(users).values(records);

  console.log(`✔ ${DUMMY_COUNT} 件のダミー・ユーザーを作成しました`);

  // loginユーザーを作成（既存なら取得）
  const loginUserArr = await db.select().from(users).where(eq(users.email, 'login@login.com')).limit(1);
  let loginUser = loginUserArr[0];
  if (!loginUser) {
    [loginUser] = await db.insert(users).values({ name: 'login', email: 'login@login.com', password: 'login' }).returning();
  }

  // マスターデータ取得
  const [category] = await db.select().from(itemCategories).limit(1);
  const [unit] = await db.select().from(units).limit(1);
  const [location] = await db.select().from(locations).limit(1);
  if (!category || !unit || !location) {
    throw new Error('マスターデータ（カテゴリ・単位・場所）が不足しています');
  }

  // household_itemsダミーデータ
  const items: NewHouseholdItem[] = [
    {
      userId: loginUser.id,
      categoryId: category.id,
      unitId: unit.id,
      locationId: location.id,
      name: 'トイレットペーパー',
      quantity: 8,
      lowStockThreshold: 2,
      purchasedAt: '2024-05-01',
      expiresAt: '2024-12-31',
      notifyBeforeDays: 3,
      notifyEnabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: loginUser.id,
      categoryId: category.id,
      unitId: unit.id,
      locationId: location.id,
      name: 'キッチンペーパー',
      quantity: 2,
      lowStockThreshold: 1,
      purchasedAt: '2024-04-15',
      expiresAt: '2024-07-15',
      notifyBeforeDays: 3,
      notifyEnabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  await db.insert(householdItems).values(items);
  console.log('✔ household_items ダミーデータを追加しました (loginユーザー用)');
}

main()
  .catch(err => {
    console.error('❌ シード実行中にエラー:', err);
    process.exit(1);
  })
  .finally(() => pool.end());
