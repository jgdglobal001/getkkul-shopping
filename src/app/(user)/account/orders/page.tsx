import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';

export default async function OrdersPage() {
  const locale = await getLocale();
  redirect(`/${locale}/account/orders`);
  return null;
}
