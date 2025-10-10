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

interface Props {
  searchParams: Promise<{
    category?: string;
    search?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    min_price?: string;
    max_price?: string;
    color?: string;
    sort?: string;
    page?: string;
  }>;
}

const ProductsPage = async ({ searchParams }: Props) => {
  // Await searchParams for Next.js 15 compatibility
  const params = await searchParams;
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

  // Apply filters
  if (params.category) {
    switch (params.category) {
      case "bestsellers":
        products = getBestSellers(products);
        break;
      case "new":
        products = getNewArrivals(products);
        break;
      case "offers":
        products = getOffers(products);
        break;
      default:
        products = getProductsByCategory(products, params.category);
    }
  }

  // Filter by search term
  if (params.search) {
    products = searchProducts(products, params.search);
  }

  // Filter by brand
  if (params.brand) {
    products = products.filter(
      (product: any) =>
        product.brand &&
        product.brand.toLowerCase().includes(params.brand!.toLowerCase())
    );
  }

  // Filter by color
  if (params.color) {
    products = products.filter((product: any) => {
      const productColors = product.tags || [];
      return productColors.some((color: string) =>
        color.toLowerCase().includes(params.color!.toLowerCase())
      );
    });
  }

  // Filter by price range
  if (params.min_price || params.max_price) {
    const minPrice = params.min_price ? parseFloat(params.min_price) : 0;
    const maxPrice = params.max_price
      ? parseFloat(params.max_price)
      : Number.MAX_VALUE;

    products = products.filter(
      (product: any) => product.price >= minPrice && product.price <= maxPrice
    );
  }

  // Sort products
  if (params.sort) {
    switch (params.sort) {
      case "price-low":
        products.sort((a: any, b: any) => a.price - b.price);
        break;
      case "price-high":
        products.sort((a: any, b: any) => b.price - a.price);
        break;
      case "name-asc":
        products.sort((a: any, b: any) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        products.sort((a: any, b: any) => b.title.localeCompare(a.title));
        break;
      case "rating":
        products.sort((a: any, b: any) => b.rating - a.rating);
        break;
      default:
        // Keep original order
        break;
    }
  }

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

  // Get the page title based on category
  const getPageTitle = () => {
    if (params.category) {
      switch (params.category) {
        case "bestsellers":
          return t('categories.bestSellers');
        case "new":
          return t('categories.newArrivals');
        case "offers":
          return t('categories.specialOffers');
        default:
          const categoryKey = getCategoryKey(params.category);
          const categoryName = t(`categories.${categoryKey}`) || 
            params.category.charAt(0).toUpperCase() + params.category.slice(1);
          return `${categoryName} ${t('common.products')}`;
      }
    }
    if (params.search) {
      return `"${params.search}" ${t('common.search')} 결과`;
    }
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
          {params.category || params.search
            ? `${products.length}${t('filters.found')}`
            : `총 ${products.length}개의 상품을 만나보세요`}
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
            {params.category && (
              <>
                <li>/</li>
                <li className="text-gray-900 font-medium">{getPageTitle()}</li>
              </>
            )}
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
            currentSort={params.sort || "default"}
          />
        </div>
      </div>
    </Container>
  );
};

export default ProductsPage;
