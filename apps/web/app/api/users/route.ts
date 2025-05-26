// apps/web/app/api/users/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const API_URL =
    process.env.API_URL ||
    (process.env.NODE_ENV === 'development'
      ? 'http://api:3001'
      : 'http://api:3001');
  const res = await fetch(`${API_URL}/users`, { cache: 'no-store' });
  const users = await res.json();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const API_URL =
      process.env.API_URL ||
      (process.env.NODE_ENV === 'development'
        ? 'http://api:3001'
        : 'http://api:3001');
    const res = await fetch(`${API_URL}/users`, {
      cache: 'no-store',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const isDev = process.env.NODE_ENV !== 'production';
      const text = await res.text();
    
      if (isDev) {
        // 開発時は詳細なエラー情報を返す
        return NextResponse.json(
          { upstreamStatus: res.status, upstreamBody: text },
          { status: res.status }
        );
      } else {
        // 本番時は汎用的なエラーメッセージのみ返す
        return NextResponse.json(
          { error: 'BFF error' },
          { status: res.status }
        );
      }
    }

    const newUser = await res.json();
    // 追加成功は 201 を明示
    return NextResponse.json(newUser, { status: 201 });
  } catch (err) {
    // どんな場合も 500 以上の正常なステータスを返す
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
