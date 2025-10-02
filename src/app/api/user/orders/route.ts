import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { db } from "@/lib/db";
import { orders } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get user's orders from orders table
    const userOrders = await db.query.orders.findMany({
      where: eq(orders.userEmail, session.user.email),
      orderBy: [desc(orders.createdAt)],
    });

    const orderList = userOrders.map((order: any) => ({
      id: order.id,
      ...order,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      items: JSON.parse(String(order.items)),
      shippingAddress: order.shippingAddress ? JSON.parse(String(order.shippingAddress)) : null,
      billingAddress: order.billingAddress ? JSON.parse(String(order.billingAddress)) : null,
    }));

    return NextResponse.json(orderList);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
