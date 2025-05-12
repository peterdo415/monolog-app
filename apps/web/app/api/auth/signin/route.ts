import { NextResponse } from 'next/server';
import { signIn } from '@monolog/auth';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // バリデーション
  if (!email || !password) {
    return NextResponse.json({ error: 'メールアドレスとパスワードは必須です' }, { status: 400 });
  }

  // 認証処理（仮実装）
  const user = await signIn(email, password);

  // Cookieをセット
  const res = NextResponse.json({ ok: true });
  res.cookies.set('monolog_auth_user', JSON.stringify({ name: user.name, email: user.email }), {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    // secure: true, // 本番環境では推奨
  });
  return res;
} 