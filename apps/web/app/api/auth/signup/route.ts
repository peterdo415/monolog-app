import { NextResponse } from 'next/server';
import { signIn } from '@monolog/auth';

const API_BASE = process.env.API_URL || 'http://api:3001';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // 必須チェック
    if (!name || !email || !password) {
      return NextResponse.json({ error: '全ての項目は必須です' }, { status: 400 });
    }

    // 1. DBにユーザー登録
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return NextResponse.json({ error: data.error || 'ユーザー登録に失敗しました' }, { status: 400 });
    }

    // 2. サインイン
    const user = await signIn(email, password);

    // 3. Cookieをセット
    const response = NextResponse.json({ ok: true }, { status: 201 });
    response.cookies.set('monolog_auth_user', JSON.stringify({ name: user.name, email: user.email }), {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      // secure: true, // 本番環境では推奨
    });
    return response;
  } catch (err) {
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  }
} 