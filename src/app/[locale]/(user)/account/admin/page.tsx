"use client";

import Link from "next/link";
import { FiUsers, FiBox, FiShoppingBag, FiBarChart2 } from "react-icons/fi";
import { useLocale } from "next-intl";

export default function AdminOverviewPage() {
  const locale = useLocale();
  const base = `/${locale}/admin-dashboard`;
  const cards = [
    { href: `${base}/orders`, title: "Orders", desc: "View and manage orders", icon: FiShoppingBag },
    { href: `${base}/products`, title: "Products", desc: "Manage catalog & inventory", icon: FiBox },
    { href: `${base}/users`, title: "Users", desc: "Manage users & roles", icon: FiUsers },
    { href: `${base}/settings`, title: "Settings", desc: "Store settings & configuration", icon: FiBarChart2 },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="group">
            <div className="border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-200 transition-all bg-white">
              <div className="flex items-center gap-3">
                <c.icon className="w-6 h-6 text-theme-color" />
                <div>
                  <div className="font-semibold text-gray-900">{c.title}</div>
                  <div className="text-sm text-gray-500">{c.desc}</div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="font-semibold mb-2">Recent Orders</div>
          <div className="text-sm text-gray-500">Coming soon</div>
        </div>
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="font-semibold mb-2">Low Inventory</div>
          <div className="text-sm text-gray-500">Coming soon</div>
        </div>
      </div>
    </div>
  );
}

