"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import EnhancedProductCard from "../../EnhancedProductCard";
import ProductSkeleton from "../../ProductSkeleton";
import { FiFilter, FiGrid, FiList, FiChevronDown } from "react-icons/fi";
import { ProductType } from "../../../../type";
import { useLocale, useTranslations } from 'next-intl';

interface OffersListProps {
  products: ProductType[];
  categories: string[];
  currentSort: string;
  currentCategory?: string;
  currentMinDiscount?: string;
}

const OffersList: React.FC<OffersListProps> = ({
  products,
  categories,
  currentSort,
  currentCategory,
  currentMinDiscount,
}) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations();

  const handleSortChange = (sortValue: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (sortValue === "discount-high") {
      current.delete("sort");
    } else {
      current.set("sort", sortValue);
    }
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/${locale}/offers${query}`);
  };

  const handleCategoryFilter = (category: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (category === "all") {
      current.delete("category");
    } else {
      current.set("category", category);
    }
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/${locale}/offers${query}`);
  };

  const handleDiscountFilter = (minDiscount: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (minDiscount === "0") {
      current.delete("min_discount");
    } else {
      current.set("min_discount", minDiscount);
    }
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/${locale}/offers${query}`);
  };

  const clearAllFilters = () => {
    router.push(`/${locale}/offers`);
  };

  const loadMore = () => {
    setIsLoadingMore(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      setItemsToShow((prev) => prev + 12);
      setIsLoadingMore(false);
    }, 800);
  };

  const displayedProducts = products.slice(0, itemsToShow);
  const hasMore = itemsToShow < products.length;

  return (
    <div className="space-y-6">
      {/* Filter and Sort Controls */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          {/* Results Count */}
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {products.length} {t('offersPage.offersFound')}
            </h3>
            {(currentCategory || currentMinDiscount) && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-blue-600 hover:text-blue-700 underline"
              >
                {t('offersPage.clearAllFilters')}
              </button>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <FiFilter className="w-4 h-4" />
              {t('offersPage.filters')}
            </button>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FiGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FiList className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="discount-high">{t('offersPage.sortHighestDiscount')}</option>
              <option value="discount-low">{t('offersPage.sortLowestDiscount')}</option>
              <option value="price-low">{t('offersPage.sortPriceLow')}</option>
              <option value="price-high">{t('offersPage.sortPriceHigh')}</option>
              <option value="name-asc">{t('offersPage.sortNameAsc')}</option>
              <option value="rating">{t('offersPage.sortHighestRated')}</option>
            </select>
          </div>
        </div>

        {/* Filters Section */}
        <div
          className={`${
            showFilters ? "block" : "hidden"
          } lg:block mt-4 pt-4 border-t border-gray-200`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('offersPage.category')}
              </label>
              <select
                value={currentCategory || "all"}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{t('offersPage.allCategories')}</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Discount Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('offersPage.minimumDiscount')}
              </label>
              <select
                value={currentMinDiscount || "0"}
                onChange={(e) => handleDiscountFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="0">{t('offersPage.anyDiscount')}</option>
                {[10,20,30,40,50].map((v) => (
                  <option key={v} value={v.toString()}>{t('offersPage.percentOrMore', { value: v })}</option>
                ))}
              </select>
            </div>

            {/* Active Filters Display */}
            <div className="flex flex-wrap items-center gap-2">
              {currentCategory && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {currentCategory}
                  <button
                    onClick={() => handleCategoryFilter("all")}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {currentMinDiscount && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  {t('offersPage.percentOffShort', { value: currentMinDiscount })}
                  <button
                    onClick={() => handleDiscountFilter("0")}
                    className="text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <>
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {displayedProducts.map((product) => (
              <EnhancedProductCard
                key={product.id}
                product={product}
                view={viewMode}
              />
            ))}
          </div>

          {/* Show Loading More Skeletons */}
          {isLoadingMore &&
            Array.from({ length: 12 }).map((_, index) => (
              <ProductSkeleton
                key={`loading-more-${index}`}
                variant={viewMode}
              />
            ))}

          {/* Load More Button */}
          {products.length > itemsToShow && !isLoadingMore && (
            <div className="col-span-full">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={loadMore}
                className="mx-auto block px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {t('offersPage.loadMoreOffers')}
              </motion.button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t('offersPage.noOffers')}
          </h3>
          <p className="text-gray-600 mb-4">
            {t('offersPage.adjustFilters')}
          </p>
          <button
            onClick={clearAllFilters}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            {t('offersPage.clearFilters')}
          </button>
        </div>
      )}
    </div>
  );
};

export default OffersList;
