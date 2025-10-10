"use client";

import { signIn, getProviders } from "next-auth/react";
import { useEffect, useState } from "react";
import Container from "@/components/Container";
import Logo from "@/components/Logo";
import { FaKakao } from "react-icons/fa";
import { SiNaver, SiGoogle } from "react-icons/si";

interface Provider {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
}

export default function SignIn() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    fetchProviders();
  }, []);

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case "kakao":
        return <FaKakao className="text-xl" />;
      case "naver":
        return <SiNaver className="text-xl" />;
      case "google":
        return <SiGoogle className="text-xl" />;
      default:
        return null;
    }
  };

  const getProviderStyle = (providerId: string) => {
    switch (providerId) {
      case "kakao":
        return "bg-[#FEE500] text-black hover:bg-[#FDD835]";
      case "naver":
        return "bg-[#03C75A] text-white hover:bg-[#02B351]";
      case "google":
        return "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50";
      default:
        return "bg-gray-500 text-white hover:bg-gray-600";
    }
  };

  const getProviderName = (providerId: string) => {
    switch (providerId) {
      case "kakao":
        return "카카오로 로그인";
      case "naver":
        return "네이버로 로그인";
      case "google":
        return "구글로 로그인";
      default:
        return `${providerId}로 로그인`;
    }
  };

  // 순서 정의: 카카오 → 네이버 → 구글
  const providerOrder = ["kakao", "naver", "google"];

  const sortedProviders = providers
    ? providerOrder
        .map(id => providers[id])
        .filter(Boolean)
        .concat(
          Object.values(providers).filter(
            provider => !providerOrder.includes(provider.id)
          )
        )
    : [];

  return (
    <Container className="min-h-screen flex items-center justify-center py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-5 border p-5 rounded-md shadow-md">
            <Logo />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            겟꿀에 로그인하세요
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            소셜 계정으로 간편하게 로그인하세요
          </p>
        </div>

        <div className="space-y-4">
          {sortedProviders.map((provider) => (
            <button
              key={provider.id}
              onClick={() => signIn(provider.id, { callbackUrl: "/" })}
              className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${getProviderStyle(
                provider.id
              )}`}
            >
              {getProviderIcon(provider.id)}
              {getProviderName(provider.id)}
            </button>
          ))}
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            로그인하시면 겟꿀의{" "}
            <a href="/terms" className="text-theme-color hover:underline">
              이용약관
            </a>{" "}
            및{" "}
            <a href="/privacy" className="text-theme-color hover:underline">
              개인정보처리방침
            </a>
            에 동의하는 것으로 간주됩니다.
          </p>
        </div>
      </div>
    </Container>
  );
}
