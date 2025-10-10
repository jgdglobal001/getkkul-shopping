"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getDashboardRoute, USER_ROLES } from "@/lib/rbac/permissions";

export default function DashboardRouter() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      setIsRedirecting(true);
      router.push("/auth/signin");
      return;
    }

    // @ts-ignore
    const userRole = session.user.role || USER_ROLES.USER;
    const dashboardRoute = getDashboardRoute(userRole as any);

    setIsRedirecting(true);
    router.push(dashboardRoute);
  }, [session, status, router]);

  // Show loading state
  if (status === "loading" || isRedirecting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">대시보드로 이동 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">대시보드로 이동 중...</p>
      </div>
    </div>
  );
}
