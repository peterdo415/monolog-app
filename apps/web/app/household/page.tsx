import { db } from '@monolog/db/client';
import { itemCategories, units, locations, householdItems, users } from '@monolog/db/schema';
import { HouseholdClient } from './HouseholdClient';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';

// マスタデータのみISRでキャッシュ
export const revalidate = 3600; // 1時間ごとに再生成

async function getMasterData() {
  // 1回のクエリでカテゴリ・単位・場所をJOINして取得
  const masterResult = await db.execute(
    `SELECT 
      c.id as category_id, c.code as category_code, c.label as category_label,
      u.id as unit_id, u.code as unit_code, u.label as unit_label,
      l.id as location_id, l.code as location_code, l.label as location_label
    FROM item_categories c
    CROSS JOIN units u
    CROSS JOIN locations l`
  );
  const masterRows = masterResult.rows;
  // データを整形
  const categories = [];
  const units = [];
  const locations = [];
  const catMap = new Map();
  const unitMap = new Map();
  const locMap = new Map();
  for (const row of masterRows) {
    if (!catMap.has(row.category_id)) {
      catMap.set(row.category_id, { id: row.category_id, code: row.category_code, label: row.category_label });
      categories.push(catMap.get(row.category_id));
    }
    if (!unitMap.has(row.unit_id)) {
      unitMap.set(row.unit_id, { id: row.unit_id, code: row.unit_code, label: row.unit_label });
      units.push(unitMap.get(row.unit_id));
    }
    if (!locMap.has(row.location_id)) {
      locMap.set(row.location_id, { id: row.location_id, code: row.location_code, label: row.location_label });
      locations.push(locMap.get(row.location_id));
    }
  }
  return { categories, units, locations };
}

async function getUserEmailFromSession() {
  // セッションCookieからユーザーemailを取得する（必要に応じてAPI呼び出しやjwtデコード等に変更）
  const cookieStore = await cookies();
  const session = cookieStore.get('monolog_auth_user');
  if (!session) return null;
  try {
    const user = JSON.parse(decodeURIComponent(session.value));
    return user.email;
  } catch {
    return null;
  }
}

// 共通: userEmailからユーザー取得
async function getUserByEmail(email: string) {
  return await db.select().from(users).where(eq(users.email, email)).then(rows => rows[0] ?? null);
}

async function getHouseholdItems(userEmail: string) {
  // household_itemsをuserEmailで取得
  const user = await getUserByEmail(userEmail);
  if (!user) return [];
  // householdItemsにリレーションjoinして必要な情報を取得
  const items = await db.select().from(householdItems)
    .where(eq(householdItems.userId, user.id));
  return items;
}

export default async function HouseholdPage() {
  const master = await getMasterData();
  const userEmail = await getUserEmailFromSession();
  if (!userEmail) redirect('/login?from=household');
  const items = await getHouseholdItems(userEmail);
  return (
    <>
      <HouseholdClient master={master} userEmail={userEmail} initialItems={items} />
    </>
  );
} 