import { signOut } from '@monolog/auth';

export async function POST() {
  await signOut();
  return Response.json({ ok: true });
} 