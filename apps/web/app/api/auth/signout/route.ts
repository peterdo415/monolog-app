import { NextResponse } from 'next/server';
import { signOut } from '@monolog/auth';

export async function POST() {
  await signOut();
  // Cookieを削除
  const res = NextResponse.json({ ok: true });
  res.cookies.set('monolog_auth_user', '', {
    path: '/',
    expires: new Date(0), // 1970年に期限切れ
    // domain: 'localhost', // 本番では環境変数で切り替えを推奨
  });
  return res;
} 