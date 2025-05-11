// apps/web/app/api/users/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const API_URL =
    process.env.API_URL ||
    (process.env.NODE_ENV === 'development'
      ? 'http://localhost:3001'
      : 'http://api:3001');
  console.log({ API_URL });
  const res = await fetch(`${API_URL}/users`, { cache: 'no-store' });
  const users = await res.json();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log({ body });   // todo: 削除
    const API_URL =
      process.env.API_URL ||
      (process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001'
        : 'http://api:3001');
    const res = await fetch(`${API_URL}/users`, {
      cache: 'no-store',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    // if (!res.ok) {
    //   // NestJS 側エラーコードをそのまま返す
    //   return NextResponse.json({ error: 'BFF error' }, { status: res.status });
    // }
    // todo: 削除、上に戻す
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { upstreamStatus: res.status, upstreamBody: text },
        { status: res.status }
      );
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

// apps/web/app/api/users/route.ts
// import { NextResponse } from 'next/server';
// export async function GET() {
//   // テスト用に固定レスポンスを返してみる
//   return NextResponse.json([{ id: 1, name: 'TestUser' }]);
// }

