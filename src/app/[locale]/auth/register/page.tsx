import type { Metadata } from 'next';
import RegisterForm from '@/components/auth/RegisterForm';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: `${t('auth.signUp')} | Getkkul`,
    description: t('auth.registerDescription'),
  };
}

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto w-full py-10 px-4">
      <RegisterForm />
    </div>
  );
}

