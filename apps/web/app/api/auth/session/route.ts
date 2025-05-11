import { getSession } from '@monolog/auth';

export async function GET() {
  const session = await getSession();
  return Response.json({ user: session?.user ?? null });
} 