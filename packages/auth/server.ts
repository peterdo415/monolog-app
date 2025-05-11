import { cookies } from 'next/headers';
import type { Session } from './types';

const COOKIE_NAME = 'monolog_auth_user';

export async function signIn(email: string, password: string) {
  if (!email) throw new Error('email is required');
  // 本来はDB認証し、ユーザー情報を取得
  // ここでは仮でnameをemailの前半部分に
  const name = email.split('@')[0];
  cookies().set(COOKIE_NAME, JSON.stringify({ name, email }), { httpOnly: true, path: '/' });
}

export async function signOut() {
  // Cookie削除でセッションも削除
  cookies().delete(COOKIE_NAME);
}

export async function getSession(): Promise<Session> {
  const value = cookies().get(COOKIE_NAME)?.value;
  if (!value) return null;
  try {
    const user = JSON.parse(value);
    return { user };
  } catch {
    return null;
  }
} 