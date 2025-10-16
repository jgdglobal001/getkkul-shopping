import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';

export default async function NotificationsPage() {
  const locale = await getLocale();
  redirect(`/${locale}/account/notifications`);
  return null;
}
