"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { SiKakao, SiNaver } from "react-icons/si";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Sign in successful!");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: "google" | "kakao" | "naver") => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch (error) {
      console.error("OAuth sign in failed:", error);
      toast.error("소셜 로그인에 실패했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      {/* 소셜 로그인만 제공 */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          소셜 계정으로 로그인
        </h3>
        <p className="text-sm text-gray-600">
          간편하고 안전한 소셜 로그인을 이용해보세요
        </p>
      </div>

      <div>

        <div className="mt-6 grid grid-cols-1 gap-3">
          {/* Google 로그인 */}
          <button
            onClick={() => handleOAuthSignIn("google")}
            className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FaGoogle className="h-5 w-5 text-red-500" />
            <span className="ml-2">Google로 로그인</span>
          </button>

          {/* 카카오 로그인 */}
          <button
            onClick={() => handleOAuthSignIn("kakao")}
            className="w-full inline-flex justify-center py-3 px-4 border border-yellow-400 rounded-md shadow-sm bg-yellow-400 text-sm font-medium text-gray-900 hover:bg-yellow-500 transition-colors"
          >
            <SiKakao className="h-5 w-5 text-gray-900" />
            <span className="ml-2">카카오로 로그인</span>
          </button>

          {/* 네이버 로그인 */}
          <button
            onClick={() => handleOAuthSignIn("naver")}
            className="w-full inline-flex justify-center py-3 px-4 border border-green-500 rounded-md shadow-sm bg-green-500 text-sm font-medium text-white hover:bg-green-600 transition-colors"
          >
            <SiNaver className="h-5 w-5 text-white" />
            <span className="ml-2">네이버로 로그인</span>
          </button>
        </div>
      </div>

      <div className="text-center">
        <span className="text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign up
          </Link>
        </span>
      </div>
    </div>
  );
}
