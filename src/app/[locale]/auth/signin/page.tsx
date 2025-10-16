import type { Metadata } from 'next';
import SignInForm from '@/components/auth/SignInForm';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: `${t('auth.signIn')} | Getkkul`,
    description: t('auth.signInDescription'),
  };
}

export default function SignInPage() {
  return (
    <div className="max-w-md mx-auto w-full py-10 px-4">
      <SignInForm />
    </div>
  );
}

