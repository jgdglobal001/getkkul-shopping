"use client";

import { useState } from "react";
// import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import { FaKakao, FaGoogle } from "react-icons/fa";
import { toast } from "react-hot-toast";

import { useLocale } from 'next-intl';

export default function RegisterForm() {
  const locale = useLocale();

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSocialSignIn = async (provider: "kakao" | "naver" | "google") => {
    const cb = `/${locale}`;
    const target = new URL(`/api/auth/signin?provider=${provider}&callback=${encodeURIComponent(cb)}`, window.location.origin).toString();
    window.location.assign(target);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-sm text-gray-600">
          소셜 계정으로 간편하게 가입하세요
        </p>
      </div>

      <div className="space-y-3">
        {/* 카카오 로그인 */}
        <button
          onClick={() => handleSocialSignIn("kakao")}
          disabled={isLoading}
          className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-yellow-300 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="w-5 h-5 mr-3 text-black font-bold">K</span>
          카카오로 가입하기
        </button>

        {/* 네이버 로그인 */}
        <button
          onClick={() => handleSocialSignIn("naver")}
          disabled={isLoading}
          className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="w-5 h-5 mr-3 text-white font-bold">N</span>
          네이버로 가입하기
        </button>

        {/* 구글 로그인 */}
        <button
          onClick={() => handleSocialSignIn("google")}
          disabled={isLoading}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="w-5 h-5 mr-3 text-gray-700 font-bold">G</span>
          구글로 가입하기
        </button>
      </div>

      <div className="text-center">
        <span className="text-sm text-gray-600">
          이미 계정이 있으신가요?{" "}
          <Link
            href={`/${locale}/auth/signin`}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            로그인
          </Link>
        </span>
      </div>
    </div>
  );
}
