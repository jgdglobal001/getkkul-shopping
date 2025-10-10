"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { FaChevronDown } from "react-icons/fa";
import { useTranslations } from 'next-intl';

interface CategoryProps {
  categories?: any[];
  allProducts?: any[];
}

const Category = ({ categories = [], allProducts = [] }: CategoryProps) => {
  const [isOpen, setIsOpen] = useState(true); // Open by default
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");
  const t = useTranslations();

  // Helper function to get exact product count for a category
  const getProductCountForCategory = (categorySlug: string): number => {
    if (!allProducts || allProducts.length === 0) return 0;
    return allProducts.filter(
      (product: any) =>
        product.category.toLowerCase() === categorySlug.toLowerCase()
    ).length;
  };

  // Helper function to get count for special categories
  const getSpecialCategoryCount = (categoryName: string): number => {
    if (!allProducts || allProducts.length === 0) return 0;

    switch (categoryName) {
      case "bestsellers":
        // Products with rating >= 4.5 or high review count
        return allProducts.filter(
          (product: any) =>
            product.rating >= 4.5 ||
            (product.reviews && product.reviews.length > 50)
        ).length;
      case "new":
        // Products from last few categories (simulated new arrivals)
        return Math.floor(allProducts.length * 0.15); // Assume 15% are new
      case "offers":
        // Products with discount percentage > 10%
        return allProducts.filter(
          (product: any) => product.discountPercentage > 10
        ).length;
      default:
        return 0;
    }
  };

  // Special categories that should appear at the top
  const specialCategories = [
    { name: "bestsellers", label: t('categories.bestSellers') },
    { name: "new", label: t('categories.newArrivals') },
    { name: "offers", label: t('categories.specialOffers') },
  ];

  const handleCategoryClick = (categorySlug: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("category", categorySlug);
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/products${query}`);
  };

  return (
    <div className="w-full">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 px-0 text-left focus:outline-none group"
      >
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {t('filters.shopByCategory')}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronDown className="w-4 h-4 text-gray-500" />
        </motion.div>
      </button>

      {/* Accordion Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-2 pb-4">
              <div className="space-y-2">
                {/* Special Categories */}
                {specialCategories.map((category, index) => {
                  const isActive = currentCategory === category.name;
                  const count = getSpecialCategoryCount(category.name);
                  return (
                    <div key={`special-${index}`} className="flex items-center">
                      <input
                        type="radio"
                        id={`category-${category.name}`}
                        name="category"
                        checked={isActive}
                        onChange={() => {}}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                      />
                      <button
                        onClick={() => handleCategoryClick(category.name)}
                        className="ml-2 text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors flex-1 text-left"
                      >
                        {category.label} ({count})
                      </button>
                    </div>
                  );
                })}

                {/* Regular Categories */}
                {categories.map((category, index) => {
                  const isActive = currentCategory === category.slug;
                  const count = getProductCountForCategory(category.slug);

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

                  const categoryKey = getCategoryKey(category.slug);
                  const categoryName = t(`categories.${categoryKey}`) || category.name;

                  return (
                    <div key={index} className="flex items-center">
                      <input
                        type="radio"
                        id={`category-${category.slug}`}
                        name="category"
                        checked={isActive}
                        onChange={() => {}}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                      />
                      <button
                        onClick={() => handleCategoryClick(category.slug)}
                        className="ml-2 text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors flex-1 text-left"
                      >
                        {categoryName} ({count})
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Category;
