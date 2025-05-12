import { getSession } from '@monolog/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getSession();
  if (!session?.user) return NextResponse.json([]);

  const API_URL = process.env.API_URL || (process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001'
    : 'http://api:3001');
  const res = await fetch(`${API_URL}/household_items?userEmail=${session.user.email}`, { cache: 'no-store' });
  if (!res.ok) return NextResponse.json([]);
  const items = await res.json();
  return NextResponse.json(items);
} 