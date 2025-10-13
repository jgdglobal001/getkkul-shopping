import Container from "@/components/Container";
import EnhancedProductsSideNav from "@/components/products/EnhancedProductsSideNav";
import { getData } from "../../../(user)/helpers";
import InfiniteProductList from "@/components/products/InfiniteProductList";
import {
  getBestSellers,
  getNewArrivals,
  getOffers,
  searchProducts,
  getProductsByCategory,
} from "../../../(user)/helpers/productHelpers";
import Link from "next/link";
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

const ProductsPage = async () => {
  // 정적 빌드를 위해 searchParams 제거
  const t = await getTranslations();

  // Fetch all products and categories
  const [productsData, categoriesData] = await Promise.all([
    getData(`https://dummyjson.com/products?limit=0`),
    getData(`https://dummyjson.com/products/categories`),
  ]);

  let { products } = productsData;
  const allProducts = [...products]; // Keep original for filters

  // Extract unique brands from all products
  const uniqueBrands = [
    ...new Set(allProducts.map((product: any) => product.brand)),
  ].sort();

  // 정적 빌드를 위해 필터링 제거 - 모든 제품 표시

  // Helper function to get category key for translations
  const getCategoryKey = (slug: string): string => {
    const keyMap: { [key: string]: string } = {
      'beauty': 'beauty',
      'fragrances': 'fragrances',
      'furniture': 'furniture',
      'groceries': 'groceries',
      'home-decoration': 'homeDecoration',
      'kitchen-accessories': 'kitchenAccessories',
      'laptops': 'laptops',
      'mens-shirts': 'mensShirts',
      'mens-shoes': 'mensShoes',
      'mens-watches': 'mensWatches',
      'mobile-accessories': 'mobileAccessories',
      'motorcycle': 'motorcycle',
      'skin-care': 'skincare',
      'smartphones': 'smartphones',
      'sports-accessories': 'sportsAccessories',
      'sunglasses': 'sunglasses',
      'tablets': 'tablets',
      'tops': 'tops',
      'vehicle': 'vehicle',
      'womens-bags': 'womensBags',
      'womens-dresses': 'womensDresses',
      'womens-jewellery': 'womensJewellery',
      'womens-shoes': 'womensShoes',
      'womens-watches': 'womensWatches',
    };
    return keyMap[slug] || slug;
  };

  // Get the page title - 정적 빌드용
  const getPageTitle = () => {
    return t('categories.allCategories') + ' ' + t('common.products');
  };

  return (
    <Container className="py-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {getPageTitle()}
        </h1>
        <p className="text-gray-600 text-lg">
          총 {products.length}개의 상품을 만나보세요
        </p>

        {/* Breadcrumb */}
        <nav className="mt-4 text-sm">
          <ol className="flex items-center space-x-2 text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-700">
                {t('common.home')}
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/products" className="hover:text-gray-700">
                {t('common.products')}
              </Link>
            </li>
          </ol>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-1/5">
          <EnhancedProductsSideNav
            categories={categoriesData}
            brands={uniqueBrands}
            allProducts={allProducts}
          />
        </div>

        {/* Products Section */}
        <div className="flex-1 min-w-0">
          <InfiniteProductList
            products={products}
            currentSort="default"
          />
        </div>
      </div>
    </Container>
  );
};

export default ProductsPage;
