import { db } from '@monolog/db/client';
import { itemCategories, units, locations, householdItems, users } from '@monolog/db/schema';
import { HouseholdClient } from './HouseholdClient';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';

async function getMasterData() {
  const [categories, unitsList, locationsList] = await Promise.all([
    db.select().from(itemCategories),
    db.select().from(units),
    db.select().from(locations),
  ]);
  return {
    categories,
    units: unitsList,
    locations: locationsList,
  };
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
  return <HouseholdClient master={master} initialItems={items} userEmail={userEmail} />;
} 