import React from "react";
import Link from "next/link";
import { FiArrowRight, FiPackage } from "react-icons/fi";
import { useTranslations } from 'next-intl';

interface Category {
  slug: string;
  name: string;
  url: string;
  count?: number;
}

interface CategoryGridProps {
  categories: Category[];
  totalProducts?: number;
}

// Category images mapping (you can replace with actual images later)
const categoryImages: { [key: string]: string } = {
  beauty:
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
  fragrances:
    "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop",
  furniture:
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
  groceries:
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
  "home-decoration":
    "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
  "kitchen-accessories":
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
  laptops:
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
  "mens-shirts":
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=300&fit=crop",
  "mens-shoes":
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop",
  "mens-watches":
    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400&h=300&fit=crop",
  "mobile-accessories":
    "https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=400&h=300&fit=crop",
  motorcycle:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
  "skin-care":
    "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&h=300&fit=crop",
  smartphones:
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
  "sports-accessories":
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
  sunglasses:
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop",
  tablets:
    "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=300&fit=crop",
  tops: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=300&fit=crop",
  vehicle:
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
  "womens-bags":
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
  "womens-dresses":
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop",
  "womens-jewellery":
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
  "womens-shoes":
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=300&fit=crop",
  "womens-watches":
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
};

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

const CategoryCard: React.FC<{ category: Category; index: number }> = ({
  category,
  index,
}) => {
  const t = useTranslations();
  const categorySlug = category.slug;
  const categoryKey = getCategoryKey(categorySlug);

  // Get translated category name and description
  const categoryName = t(`categories.${categoryKey}`) || category.name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());

  const image =
    categoryImages[categorySlug] ||
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop";

  const description = t(`categoryDescriptions.${categoryKey}`) ||
    "Discover amazing products in this category";

  const productCount = category.count || 0;

  return (
    <Link href={`/products?category=${categorySlug}`}>
      <div className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden h-full">
        {/* Image Container */}
        <div className="relative h-32 lg:h-40 overflow-hidden">
          <img
            src={image}
            alt={categoryName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Product Count Badge */}
          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {productCount} {t('filters.products')}
          </div>

          {/* Category Icon */}
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <FiPackage className="w-3 h-3 lg:w-4 lg:h-4 text-gray-700" />
          </div>
        </div>

        {/* Content */}
        <div className="p-3 lg:p-4">
          <h3 className="text-sm lg:text-base font-bold text-gray-900 mb-1 lg:mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-1">
            {categoryName}
          </h3>
          <p className="text-gray-600 text-xs lg:text-sm mb-2 lg:mb-3 line-clamp-2">
            {description}
          </p>

          {/* Action Button */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">
              {t('common.view')} {t('common.products')}
            </span>
            <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors duration-200">
              <FiArrowRight className="w-3 h-3 lg:w-4 lg:h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </div>
        </div>

        {/* Hover Border Effect */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-xl transition-colors duration-300" />
      </div>
    </Link>
  );
};

const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  totalProducts = 0,
}) => {
  const t = useTranslations();
  // Take only first 12 categories
  const displayCategories = categories?.slice(0, 12) || [];
  const totalBrands = Math.floor(totalProducts / 20); // Estimate brands based on products

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="text-center bg-gray-50 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {displayCategories.length}
            </div>
            <div className="text-gray-600">{t('common.categories')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {totalProducts}+
            </div>
            <div className="text-gray-600">{t('common.products')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {totalBrands}+
            </div>
            <div className="text-gray-600">{t('product.brands')}</div>
          </div>
        </div>
      </div>

      {/* Categories Grid - 6 per row on lg devices, 12 total */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {displayCategories.map((category, index) => (
          <CategoryCard key={category.slug} category={category} index={index} />
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          찾고 계신 상품이 없나요?
        </h3>
        <p className="text-gray-600 mb-6">
          모든 상품을 둘러보거나 검색 기능을 사용해서 원하는 상품을 찾아보세요.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            모든 상품 보기
          </Link>
          <Link
            href="/products?search="
            className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-300 transition-colors duration-200"
          >
            상품 검색
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;
