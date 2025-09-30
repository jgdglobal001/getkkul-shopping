import Banner from "@/components/pages/home/Banner";
import ProductSection from "@/components/pages/home/ProductSection";
import DynamicFeaturedCategories from "@/components/pages/home/DynamicFeaturedCategories";
import SpecialOffersBanner from "@/components/pages/home/SpecialOffersBanner";
import SectionDivider from "@/components/ui/SectionDivider";
import { getData } from "./helpers";
import {
  getBestSellers,
  getNewArrivals,
  getOffers,
} from "./helpers/productHelpers";
import { useTranslations } from 'next-intl';

export default async function Home() {
  const endpoint = `https://dummyjson.com/products?limit=0`; // Fetch all products
  const productData = await getData(endpoint);
  const allProducts = productData?.products || [];

  // Categorize products
  const bestSellers = getBestSellers(allProducts);
  const newArrivals = getNewArrivals(allProducts);
  const offers = getOffers(allProducts);

  return (
    <main>
      <Banner />

      {/* Featured Categories Section */}
      <DynamicFeaturedCategories />

      {/* Special Offers Banner */}
      <SpecialOffersBanner />

      <SectionDivider />

      {/* Best Sellers Section */}
      <ProductSection
        title="베스트셀러"
        subtitle="고객들이 사랑하는 인기 상품"
        products={bestSellers}
        viewMoreLink="/products?category=bestsellers"
      />

      <SectionDivider />

      {/* New Arrivals Section */}
      <ProductSection
        title="신상품"
        subtitle="컬렉션에 새로 추가된 최신 상품"
        products={newArrivals}
        viewMoreLink="/products?category=new"
      />

      <SectionDivider />

      {/* Special Offers Section */}
      <ProductSection
        title="특별 할인"
        subtitle="놓치지 마세요! 놀라운 할인 상품"
        products={offers}
        viewMoreLink="/offers"
      />
    </main>
  );
}
