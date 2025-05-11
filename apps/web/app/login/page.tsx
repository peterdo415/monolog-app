import { getSession } from '@monolog/auth';
import { redirect } from 'next/navigation';
import { LoginForm } from './LoginForm';

export default async function LoginPage() {
  const session = await getSession();
  if (session?.user) {
    redirect('/');
  }
  return <LoginForm />;
} 