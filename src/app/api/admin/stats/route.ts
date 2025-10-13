import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, orders } from "@/lib/schema";
import { count, sum, eq } from "drizzle-orm";

export async function GET() {
  try {
    // Fetch real data from Neon DB
    const [usersCount, ordersCount, totalRevenue, pendingOrders, completedOrders] = await Promise.all([
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(orders),
      db.select({ total: sum(orders.totalAmount) }).from(orders),
      db.select({ count: count() }).from(orders).where(eq(orders.status, "pending")),
      db.select({ count: count() }).from(orders).where(eq(orders.status, "completed")),
    ]);

    const stats = {
      totalUsers: usersCount[0]?.count || 0,
      totalOrders: ordersCount[0]?.count || 0,
      totalRevenue: parseFloat(totalRevenue[0]?.total || "0"),
      totalProducts: 89, // This would come from products table if you have it
      pendingOrders: pendingOrders[0]?.count || 0,
      completedOrders: completedOrders[0]?.count || 0,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
