import { getSession } from '@monolog/auth';
import { redirect } from 'next/navigation';
import { LoginForm } from './LoginForm';

export default async function LoginPage() {
  const session = await getSession();
  // デバッグ用: サーバー側でsessionの内容を出力
  console.log('login page session:', session);
  if (session?.user) {
    redirect('/household');
  }
  return <LoginForm />;
} 