"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { authClient } from "@/lib/auth/auth-client";
import { StateType } from "../../../../../type";
import { addToFavorite, addToCart, resetFavorite } from "@/redux/getkkulSlice";
import Container from "@/components/Container";
import Link from "next/link";
import { FaHeart, FaShoppingCart, FaEye, FaTrash } from "react-icons/fa";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import toast from "react-hot-toast";
import PriceFormat from "@/components/PriceFormat";
import { useTranslations } from 'next-intl';

const FavoritePage = () => {
  const { favorite } = useSelector((state: StateType) => state?.getkkul);
  const { data: session } = authClient.useSession();
  const dispatch = useDispatch();
  const t = useTranslations();

  const handleRemoveFromFavorite = (productId: number) => {
    const product = favorite.find((item) => item.id === productId);
    if (product) {
      dispatch(addToFavorite(product)); // This will remove it due to toggle logic
      toast.success("즐겨찾기에서 제거되었습니다");
    }
  };

  const handleAddToCart = (product: any) => {
    dispatch(addToCart(product));
    toast.success("장바구니에 추가되었습니다!");
  };

  const handleClearAllFavorites = () => {
    if (favorite.length > 0) {
      dispatch(resetFavorite());
      toast.success("모든 즐겨찾기가 삭제되었습니다");
    }
  };

  if (!session?.user) {
    return (
      <Container className="py-20">
        <div className="text-center">
          <div className="mb-8">
            <FaHeart className="mx-auto text-6xl text-gray-300 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              로그인이 필요합니다
            </h1>
            <p className="text-gray-600 mb-8">
              즐겨찾기를 보려면 먼저 로그인해주세요.
            </p>
            <Link
              href="/auth/signin"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              로그인하기
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  if (favorite.length === 0) {
    return (
      <Container className="py-20">
        <div className="text-center">
          <div className="mb-8">
            <MdFavoriteBorder className="mx-auto text-6xl text-gray-300 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              즐겨찾기가 비어있습니다
            </h1>
            <p className="text-gray-600 mb-8">
              마음에 드는 상품을 즐겨찾기에 추가해보세요.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              상품 둘러보기
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            내 즐겨찾기
          </h1>
          <p className="text-gray-600">
            {favorite.length}개의 상품이 즐겨찾기에 있습니다
          </p>
        </div>
        
        {favorite.length > 0 && (
          <button
            onClick={handleClearAllFavorites}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
          >
            <FaTrash className="mr-2" />
            모두 삭제
          </button>
        )}
      </div>

      {/* Breadcrumb */}
      <nav className="mb-8 text-sm">
        <ol className="flex items-center space-x-2 text-gray-500">
          <li>
            <Link href="/" className="hover:text-gray-700">
              {t('common.home')}
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium">즐겨찾기</li>
        </ol>
      </nav>

      {/* Favorites Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorite.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {/* Product Image */}
            <div className="relative group">
              <Link href={`/products/${product.id}`}>
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              
              {/* Remove from favorites button */}
              <button
                onClick={() => handleRemoveFromFavorite(product.id)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                title="즐겨찾기에서 제거"
              >
                <MdFavorite className="text-red-500 text-lg" />
              </button>

              {/* Discount badge */}
              {product.discountPercentage > 0 && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                  -{Math.round(product.discountPercentage)}%
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4">
              <Link href={`/products/${product.id}`}>
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                  {product.title}
                </h3>
              </Link>
              
              <p className="text-sm text-gray-500 mb-2 capitalize">
                {t(`categories.${product.category}`) || product.category}
              </p>

              {/* Price */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <PriceFormat amount={product.price} />
                  {product.discountPercentage > 0 && (
                    <span className="text-sm text-gray-500 line-through">
                      <PriceFormat 
                        amount={product.price / (1 - product.discountPercentage / 100)} 
                      />
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <FaShoppingCart className="mr-2" />
                  장바구니
                </button>
                
                <Link
                  href={`/products/${product.id}`}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  title="상품 보기"
                >
                  <FaEye className="text-gray-600" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default FavoritePage;
