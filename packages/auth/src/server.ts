import { cookies } from 'next/headers';
import type { Session } from './types';

const COOKIE_NAME = 'monolog_auth_user';

export async function signIn(email: string, password: string) {
  if (!email) throw new Error('email is required');
  // 本来はDB認証し、ユーザー情報を取得
  // ここでは仮でnameをemailの前半部分に
  const name = email.split('@')[0];
  return { name, email };
}

export async function signOut() {
  // Cookie削除でセッションも削除
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<Session> {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  if (!value) return null;
  try {
    const user = JSON.parse(value);
    // 型安全性チェック
    if (typeof user === 'object' && user && typeof user.name === 'string' && typeof user.email === 'string') {
      return { user };
    } else {
      // 値が壊れている場合はCookieを削除
      cookieStore.delete(COOKIE_NAME);
      return null;
    }
  } catch {
    // パース失敗時もCookieを削除
    cookieStore.delete(COOKIE_NAME);
    return null;
  }
} 