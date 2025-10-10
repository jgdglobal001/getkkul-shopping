import Banner from "@/components/pages/home/Banner";
import ProductSection from "@/components/pages/home/ProductSection";
import DynamicFeaturedCategories from "@/components/pages/home/DynamicFeaturedCategories";
import SpecialOffersBanner from "@/components/pages/home/SpecialOffersBanner";
import SectionDivider from "@/components/ui/SectionDivider";
import { getData } from "../../(user)/helpers";
import {
  getBestSellers,
  getNewArrivals,
  getOffers,
} from "../../(user)/helpers/productHelpers";
import { getTranslations } from 'next-intl/server';

export default async function Home() {
  const endpoint = `https://dummyjson.com/products?limit=0`; // Fetch all products
  const productData = await getData(endpoint);
  const allProducts = productData?.products || [];

  // Categorize products
  const bestSellers = getBestSellers(allProducts);
  const newArrivals = getNewArrivals(allProducts);
  const offers = getOffers(allProducts);

  // Get translations
  const t = await getTranslations();

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
        title={t('home.bestSellers')}
        subtitle={t('home.bestSellersDesc')}
        products={bestSellers}
        viewMoreLink="/products?category=bestsellers"
      />

      <SectionDivider />

      {/* New Arrivals Section */}
      <ProductSection
        title={t('home.newArrivals')}
        subtitle={t('home.newArrivalsDesc')}
        products={newArrivals}
        viewMoreLink="/products?category=new"
      />

      <SectionDivider />

      {/* Special Offers Section */}
      <ProductSection
        title={t('home.specialOffers')}
        subtitle={t('home.specialOffersDesc')}
        products={offers}
        viewMoreLink="/offers"
      />
    </main>
  );
}
