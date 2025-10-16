import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';

export default async function AddressesPage() {
  const locale = await getLocale();
  redirect(`/${locale}/account/addresses`);
  return null;
}
