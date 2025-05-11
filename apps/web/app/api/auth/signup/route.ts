import { NextResponse } from 'next/server';
import { signIn } from '@monolog/auth';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // 必須チェック
    if (!name || !email || !password) {
      return NextResponse.json({ error: '全ての項目は必須です' }, { status: 400 });
    }

    // TODO: DB保存や重複チェック、パスワードハッシュ化など

    // 登録成功時に自動でサインイン
    await signIn(email, password);

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  }
} 