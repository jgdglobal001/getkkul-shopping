export { default } from "../../../../../(user)/account/orders/[id]/page";

// For static export, we must pre-generate all locale+id combinations
export function generateStaticParams() {
  const locales = ["ko", "en", "zh"];
  const ids = ["1", "2", "3", "4", "5"]; // keep in sync with the base page's params
  const out = [] as Array<{ locale: string; id: string }>;
  for (const locale of locales) {
    for (const id of ids) {
      out.push({ locale, id });
    }
  }
  return out;
}

