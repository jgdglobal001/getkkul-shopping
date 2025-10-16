"use client";

import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiUsers, FiBox, FiSettings, FiShoppingBag } from "react-icons/fi";
import { useLocale } from "next-intl";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const locale = useLocale();
  const base = `/${locale}/admin-dashboard`;

  const NavItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
          ${active ? "bg-theme-color/10 text-theme-color" : "text-gray-700 hover:bg-gray-100"}`}
      >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 text-sm">Manage products, orders, and users</p>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar */}
            <aside className="col-span-12 md:col-span-3 lg:col-span-2">
              <nav className="space-y-2 bg-white border border-gray-200 p-3 rounded-xl">
                <NavItem href={base} icon={FiHome} label="Overview" />
                <NavItem href={`${base}/orders`} icon={FiShoppingBag} label="Orders" />
                <NavItem href={`${base}/products`} icon={FiBox} label="Products" />
                <NavItem href={`${base}/users`} icon={FiUsers} label="Users" />
                <NavItem href={`${base}/settings`} icon={FiSettings} label="Settings" />
              </nav>
            </aside>

            {/* Main */}
            <main className="col-span-12 md:col-span-9 lg:col-span-10">
              <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </AdminProtectedRoute>
  );
}

