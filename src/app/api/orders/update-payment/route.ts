import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, orders } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const {
      orderId,
      email,
      paymentStatus = "paid",
      status,
    } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Find the order by orderId
    const order = await db.query.orders.findFirst({
      where: eq(orders.orderId, orderId),
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update the order in orders table
    await db
      .update(orders)
      .set({
        paymentStatus,
        ...(status && { status }),
        updatedAt: new Date(),
      })
      .where(eq(orders.orderId, orderId));

    // Update the user's orders array if email is provided
    if (email) {
      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (user && user.orders) {
        const currentOrders = JSON.parse(user.orders as string);
        const updatedOrders = currentOrders.map((order: any) => {
          if (order.orderId === orderId) {
            return {
              ...order,
              paymentStatus,
              ...(status && { status }),
              updatedAt: new Date().toISOString(),
            };
          }
          return order;
        });

        await db
          .update(users)
          .set({
            orders: JSON.stringify(updatedOrders),
            updatedAt: new Date(),
          })
          .where(eq(users.email, email));
      }
    }

    return NextResponse.json({
      message: "Order updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
