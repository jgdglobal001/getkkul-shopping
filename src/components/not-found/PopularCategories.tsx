import Link from "next/link";
import { useLocale } from 'next-intl';

interface Category {
  name: string;
  icon: string;
  color: string;
}

interface PopularCategoriesProps {
  title?: string;
  className?: string;
}

export default function PopularCategories({
  title = "Popular Categories",
  className = "",
}: PopularCategoriesProps) {
  const locale = useLocale();

  const categories: Category[] = [
    { name: "Electronics", icon: "📱", color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
    { name: "Fashion", icon: "👕", color: "bg-pink-100 text-pink-700 hover:bg-pink-200" },
    { name: "Home & Garden", icon: "🏡", color: "bg-green-100 text-green-700 hover:bg-green-200" },
    { name: "Sports", icon: "⚽", color: "bg-orange-100 text-orange-700 hover:bg-orange-200" },
    { name: "Beauty", icon: "💄", color: "bg-purple-100 text-purple-700 hover:bg-purple-200" },
    { name: "Books", icon: "📚", color: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" },
  ];

  const mapNameToSlug: Record<string, string> = {
    "Electronics": "smartphones",
    "Fashion": "mens-shirts",
    "Home & Garden": "home-decoration",
    "Sports": "sports-accessories",
    "Beauty": "beauty",
    "Books": "laptops",
  };

  return (
    <div className={`bg-gray-50 rounded-2xl p-8 ${className}`}>
      <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
        {title}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => {
          const slug = mapNameToSlug[category.name] || "";
          const href = slug ? `/${locale}/products?category=${encodeURIComponent(slug)}` : `/${locale}/products`;
          return (
            <Link
              key={category.name}
              href={href}
              className="group flex flex-col items-center p-4 bg-white rounded-xl hover:shadow-md transition-all duration-200 hover:-translate-y-1"
            >
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 transition-colors ${category.color}`}
              >
                <span className="text-xl group-hover:scale-110 transition-transform">
                  {category.icon}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700 text-center group-hover:text-gray-900">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
