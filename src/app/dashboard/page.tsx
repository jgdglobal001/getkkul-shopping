"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getDashboardRoute, USER_ROLES } from "@/lib/rbac/permissions";

export default function DashboardRouter() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Show loading state
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  useEffect(() => {
    if (!session?.user) {
      router.push("/auth/signin");
      return;
    }

    // @ts-ignore
    const userRole = session.user.role || USER_ROLES.USER;
    const dashboardRoute = getDashboardRoute(userRole as any);

    router.push(dashboardRoute);
  }, [session, status, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
}
