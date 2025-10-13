import Link from "next/link";
import Container from "@/components/Container";

export default function Unauthorized() {
  return (
    <Container>
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="text-red-500 text-6xl">⚠️</div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            접근 거부
          </h1>

          <p className="text-gray-600 mb-6">
            이 페이지에 접근할 권한이 없습니다.
          </p>

          <div className="space-y-3">
            <Link
              href="/account"
              className="block w-full bg-sky-600 text-white py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors duration-200"
            >
              내 계정으로 이동
            </Link>

            <Link
              href="/"
              className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              홈으로 돌아가기
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            문제가 있다고 생각되시면 관리자에게 문의하세요.
          </p>
        </div>
      </div>
    </Container>
  );
}
