import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';

export default async function AdminDashboardPage() {
  const locale = await getLocale();
  redirect(`/${locale}/account/admin`);
  return null;
}
