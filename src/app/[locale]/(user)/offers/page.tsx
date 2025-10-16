import Container from "@/components/Container";
import { getData } from "../../../(user)/helpers";
import OffersHero from "@/components/pages/offers/OffersHero";
import { ProductType } from "../../../../../type";
import OffersList from "@/components/pages/offers/OffersList";
import Link from "next/link";
import { getTranslations, getLocale } from 'next-intl/server';

export const metadata = {
  title: "Special Offers - Shofy",
  description:
    "Discover amazing deals and special offers on our best products. Save big on electronics, fashion, beauty, and more!",
};

const OffersPage = async () => {
  // 정적 빌드를 위해 searchParams 제거
  const t = await getTranslations();
  const locale = await getLocale();

  // Fetch all products
  const productsData = await getData(`https://dummyjson.com/products?limit=0`);
  let { products } = productsData;

  // Filter products with offers (discount > 0)
  const offersProducts = products.filter(
    (product: ProductType) => product.discountPercentage > 0
  );

  // 정적 빌드를 위해 기본 필터링만 적용
  products = offersProducts;

  // 정적 빌드를 위해 기본 정렬 적용 (할인율 높은 순)
  products.sort(
    (a: ProductType, b: ProductType) =>
      b.discountPercentage - a.discountPercentage
  );

  // Get categories for filtering
  const categories = [
    ...new Set(offersProducts.map((p: ProductType) => p.category)),
  ] as string[];

  // Calculate savings statistics
  const totalProducts = offersProducts.length;
  const averageDiscount =
    offersProducts.reduce(
      (sum: number, product: ProductType) => sum + product.discountPercentage,
      0
    ) / totalProducts;

  const maxDiscount = Math.max(
    ...offersProducts.map((p: ProductType) => p.discountPercentage)
  );

  return (
    <Container className="py-10">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          🔥 {t('categories.specialOffers')}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          놓치지 마세요! 최대 {Math.round(maxDiscount)}% 할인으로 좋아하는 상품을 저렴하게 만나보세요.
        </p>

        {/* Breadcrumb */}
        <nav className="text-sm">
          <ol className="flex items-center justify-center space-x-2 text-gray-500">
            <li>
              <Link href={`/${locale}/`} className="hover:text-gray-700 transition-colors">
                {t('common.home')}
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{t('categories.specialOffers')}</li>
          </ol>
        </nav>
      </div>

      {/* Hero Section with Stats */}
      <OffersHero
        totalOffers={totalProducts}
        averageDiscount={averageDiscount}
        maxDiscount={maxDiscount}
      />

      {/* Offers List */}
      <OffersList
        products={products}
        categories={categories}
        currentSort="discount-high"
        currentCategory={undefined}
        currentMinDiscount={undefined}
      />
    </Container>
  );
};

export default OffersPage;
