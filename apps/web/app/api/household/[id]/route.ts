import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@monolog/auth/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://api:3001';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }
  const body = await req.json();
  // userEmailを強制的に上書き
  const res = await fetch(`${API_BASE}/household_items/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, userEmail }),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }
  const res = await fetch(`${API_BASE}/household_items/${id}?userEmail=${encodeURIComponent(userEmail)}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
} 