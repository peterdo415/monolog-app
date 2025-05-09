// apps/web/app/api/users/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch('http://api:3001/users', { cache: 'no-store' });
  const users = await res.json();
  return NextResponse.json(users);
}

// apps/web/app/api/users/route.ts
// import { NextResponse } from 'next/server';
// export async function GET() {
//   // テスト用に固定レスポンスを返してみる
//   return NextResponse.json([{ id: 1, name: 'TestUser' }]);
// }

