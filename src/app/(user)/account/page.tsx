import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';

export default async function AccountPage() {
  const locale = await getLocale();
  redirect(`/${locale}/account`);
  return null;
}
