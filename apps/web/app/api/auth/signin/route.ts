import { signIn } from '@monolog/auth';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // バリデーション
  if (!email || !password) {
    return Response.json({ error: 'メールアドレスとパスワードは必須です' }, { status: 400 });
  }

  // 認証処理（仮実装）
  await signIn(email, password);
  return Response.json({ ok: true });
} 