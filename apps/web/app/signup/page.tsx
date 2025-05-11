import { getSession } from '@monolog/auth';
import { redirect } from 'next/navigation';
import { SignupForm } from './SignupForm';

export default async function SignupPage() {
  const session = await getSession();
  if (session?.user) {
    redirect('/');
  }
  return <SignupForm />;
} 