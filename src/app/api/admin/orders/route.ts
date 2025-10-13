import { NextRequest, NextResponse } from "next/server";
import { hasPermission } from "@/lib/rbac/roles";
import { db } from "@/lib/db";
import { users, orders } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // TODO: Add proper authentication check
    // For now, assume admin access

    // Fetch all orders from Neon DB
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));

    // Fetch all users from Neon DB
    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));

    return NextResponse.json(
      {
        users: allUsers,
        standaloneOrders: allOrders,
        totalUsers: allUsers.length,
        totalOrders: allOrders.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // TODO: Add proper authentication and permission checks

    const body = await request.json();
    const { orderId, status, paymentStatus } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    // Build updates object
    const updateFields: any = {
      updatedAt: new Date(),
    };
    if (status) updateFields.status = status;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;

    // Update order in Neon DB
    const updatedOrder = await db.update(orders)
      .set(updateFields)
      .where(eq(orders.id, orderId))
      .returning();

    if (updatedOrder.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      updated: "orders_table",
      order: updatedOrder[0],
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function DELETE(request: NextRequest) {
  try {
    // TODO: Add proper authentication and permission checks

    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    // Delete from Neon DB
    const deletedOrder = await db.delete(orders)
      .where(eq(orders.id, orderId))
      .returning();

    if (deletedOrder.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      deleted: "orders_table",
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
