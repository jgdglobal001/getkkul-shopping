"use client";

import { useAppSession as useSession } from "@/hooks/useAppSession";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getDefaultDashboardRoute } from "@/lib/rbac/roles";
import MainLoader from "@/components/MainLoader";

export default function RoleDashboardRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (!session?.user) {
      router.push("/auth/signin");
      return;
    }

    const userRole = (session.user.role || "user") as any;
    const dashboardRoute = getDefaultDashboardRoute(userRole);
    router.push(dashboardRoute);
  }, [session, status, router]);

  if (status === "loading") {
    return <MainLoader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <MainLoader />
    </div>
  );
}
