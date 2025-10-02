import { NextRequest, NextResponse } from "next/server";

import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  PAYMENT_METHODS,
  getVisibleOrderStatuses,
  canUpdateOrderStatus,
  canUpdatePaymentStatus,
  isValidStatusTransition,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
} from "@/lib/orderStatus";
import { hasPermission, UserRole } from "@/lib/rbac/permissions";
import { db } from "@/lib/db";
import { orders, users } from "@/lib/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import { auth } from "../../../../auth";

// GET - Fetch orders based on user role
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user role
    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userRole = user.role as UserRole || "user";

    // Check if user has permission to view orders
    if (!hasPermission(userRole, "orders", "read")) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const visibleStatuses = getVisibleOrderStatuses(userRole);
    if (visibleStatuses.length === 0) {
      return NextResponse.json({ orders: [] });
    }

    // Build query based on role
    let orderList;

    if (userRole === "admin" || userRole === "account") {
      // Admin and accountant can see all orders
      orderList = await db.query.orders.findMany({
        orderBy: [desc(orders.createdAt)],
      });
    } else {
      // Role-based filtering
      orderList = await db.query.orders.findMany({
        where: and(
          eq(orders.userEmail, session.user.email),
          inArray(orders.status, visibleStatuses)
        ),
        orderBy: [desc(orders.createdAt)],
      });
    }

    const formattedOrders = orderList.map((order) => {
      const { id: _, ...orderWithoutId } = order;
      return {
        id: order.orderId,
        ...orderWithoutId,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        items: Array.isArray(order.items) ? order.items : JSON.parse(String(order.items)),
        shippingAddress: order.shippingAddress ? (typeof order.shippingAddress === 'string' ? JSON.parse(order.shippingAddress) : order.shippingAddress) : null,
        billingAddress: order.billingAddress ? (typeof order.billingAddress === 'string' ? JSON.parse(order.billingAddress) : order.billingAddress) : null,
        statusHistory: Array.isArray(order.statusHistory) ? order.statusHistory : (typeof order.statusHistory === 'string' ? JSON.parse(order.statusHistory) : []),
        paymentHistory: Array.isArray(order.paymentHistory) ? order.paymentHistory : (typeof order.paymentHistory === 'string' ? JSON.parse(order.paymentHistory) : []),
        deliveryNotes: Array.isArray(order.deliveryNotes) ? order.deliveryNotes : (typeof order.deliveryNotes === 'string' ? JSON.parse(order.deliveryNotes) : []),
      };
    });

    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// PUT - Update order status
export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, status, paymentStatus, deliveryNotes } =
      await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Get user role
    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userRole = user.role as UserRole || "user";

    // Check if user has permission to update orders
    if (!hasPermission(userRole, "orders", "update")) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Get current order
    const currentOrder = await db.query.orders.findFirst({
      where: eq(orders.orderId, orderId),
    });

    if (!currentOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const currentStatus = currentOrder.status as OrderStatus;
    const currentPaymentStatus = currentOrder.paymentStatus as PaymentStatus;
    const paymentMethod = currentOrder.paymentMethod as PaymentMethod;

    const updateData: any = {
      updatedAt: new Date(),
    };

    // Handle order status update
    if (status && status !== currentStatus) {
      // Validate status transition
      if (!isValidStatusTransition(currentStatus, status)) {
        return NextResponse.json(
          {
            error: `Invalid status transition from ${currentStatus} to ${status}`,
          },
          { status: 400 }
        );
      }

      // Check role permissions for status update
      if (!canUpdateOrderStatus(userRole, currentStatus, status)) {
        return NextResponse.json(
          {
            error: `You don't have permission to change status from ${currentStatus} to ${status}`,
          },
          { status: 403 }
        );
      }

      updateData.status = status;

      // Add status history
      const statusHistory = Array.isArray(currentOrder.statusHistory) ? currentOrder.statusHistory : (typeof currentOrder.statusHistory === 'string' ? JSON.parse(currentOrder.statusHistory) : []);
      statusHistory.push({
        status,
        timestamp: new Date().toISOString(),
        updatedBy: session.user.email,
        userRole,
        notes: deliveryNotes || `Status changed to ${status}`,
      });
      updateData.statusHistory = JSON.stringify(statusHistory);
    }

    // Handle payment status update
    if (paymentStatus && paymentStatus !== currentPaymentStatus) {
      // Check role permissions for payment status update
      if (
        !canUpdatePaymentStatus(
          userRole,
          paymentMethod,
          currentPaymentStatus,
          paymentStatus
        )
      ) {
        return NextResponse.json(
          {
            error: `You don't have permission to update payment status for ${paymentMethod} payments`,
          },
          { status: 403 }
        );
      }

      updateData.paymentStatus = paymentStatus;

      // Add payment history
      const paymentHistory = Array.isArray(currentOrder.paymentHistory) ? currentOrder.paymentHistory : (typeof currentOrder.paymentHistory === 'string' ? JSON.parse(currentOrder.paymentHistory) : []);
      paymentHistory.push({
        status: paymentStatus,
        timestamp: new Date().toISOString(),
        updatedBy: session.user.email,
        userRole,
        method: paymentMethod,
        notes: deliveryNotes || `Payment status changed to ${paymentStatus}`,
      });
      updateData.paymentHistory = JSON.stringify(paymentHistory);
    }

    // Add delivery notes if provided
    if (deliveryNotes) {
      const notes = Array.isArray(currentOrder.deliveryNotes) ? currentOrder.deliveryNotes : (typeof currentOrder.deliveryNotes === 'string' ? JSON.parse(currentOrder.deliveryNotes) : []);
      notes.push({
        note: deliveryNotes,
        timestamp: new Date().toISOString(),
        addedBy: session.user.email,
        userRole,
      });
      updateData.deliveryNotes = JSON.stringify(notes);
    }

    // Update the order
    await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.orderId, orderId));

    // Also update user's order in users table if needed
    if (currentOrder.userEmail) {
      const userOrders = await db.query.users.findFirst({
        where: eq(users.email, currentOrder.userEmail),
      });

      if (userOrders && userOrders.orders) {
        const currentUserOrders = JSON.parse(String(userOrders.orders));
        const updatedUserOrders = currentUserOrders.map((order: any) => {
          if (order.orderId === orderId) {
            return {
              ...order,
              ...updateData,
              statusHistory: Array.isArray(updateData.statusHistory) ? updateData.statusHistory : JSON.parse(updateData.statusHistory || '[]'),
              paymentHistory: Array.isArray(updateData.paymentHistory) ? updateData.paymentHistory : JSON.parse(updateData.paymentHistory || '[]'),
              deliveryNotes: Array.isArray(updateData.deliveryNotes) ? updateData.deliveryNotes : JSON.parse(updateData.deliveryNotes || '[]'),
            };
          }
          return order;
        });

        await db
          .update(users)
          .set({
            orders: JSON.stringify(updatedUserOrders),
            updatedAt: new Date(),
          })
          .where(eq(users.email, currentOrder.userEmail));
      }
    }

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      orderId,
      updates: { ...updateData, updatedBy: session.user.email },
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

// POST - Create new order (from checkout)
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderData = await request.json();

    // Create order with initial status
    const newOrder = {
      ...orderData,
      status: ORDER_STATUSES.PENDING,
      paymentStatus:
        orderData.paymentMethod === PAYMENT_METHODS.CASH
          ? PAYMENT_STATUSES.PENDING
          : PAYMENT_STATUSES.PAID,
      userEmail: session.user.email,
      createdAt: new Date(),
      updatedAt: new Date(),
      statusHistory: JSON.stringify([
        {
          status: ORDER_STATUSES.PENDING,
          timestamp: new Date().toISOString(),
          updatedBy: session.user.email,
          userRole: "user",
          notes: "Order placed",
        },
      ]),
      paymentHistory: JSON.stringify([
        {
          status:
            orderData.paymentMethod === PAYMENT_METHODS.CASH
              ? PAYMENT_STATUSES.PENDING
              : PAYMENT_STATUSES.PAID,
          timestamp: new Date().toISOString(),
          updatedBy: session.user.email,
          userRole: "user",
          method: orderData.paymentMethod || PAYMENT_METHODS.ONLINE,
          notes: `Order created with ${
            orderData.paymentMethod || "online"
          } payment`,
        },
      ]),
    };

    // Add to orders table
    const insertedOrder = await db.insert(orders).values(newOrder).returning();

    const orderId = insertedOrder[0].orderId;

    // Add to user's orders array in users table
    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });

    if (user) {
      const currentUserOrders = user.orders ? JSON.parse(user.orders as string) : [];
      currentUserOrders.push({
        ...newOrder,
        id: orderId,
        statusHistory: JSON.parse(newOrder.statusHistory),
        paymentHistory: JSON.parse(newOrder.paymentHistory),
      });

      await db
        .update(users)
        .set({
          orders: JSON.stringify(currentUserOrders),
          updatedAt: new Date(),
        })
        .where(eq(users.email, session.user.email));
    }

    return NextResponse.json({
      success: true,
      orderId,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
