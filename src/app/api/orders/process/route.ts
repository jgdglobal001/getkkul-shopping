import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { users, orders } from "@/lib/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { sessionId, email } = await request.json();

    if (!sessionId || !email) {
      return NextResponse.json(
        { success: false, error: "Session ID and email are required" },
        { status: 400 }
      );
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product"],
    });

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { success: false, error: "Payment not completed" },
        { status: 400 }
      );
    }

    // Find user in Neon DB
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Check if order already exists to prevent duplicates
    const existingOrder = await db.query.orders.findFirst({
      where: eq(orders.orderId, sessionId),
    });

    if (existingOrder) {
      return NextResponse.json({
        success: true,
        message: "Order already processed",
        order: {
          id: existingOrder.orderId,
          amount: existingOrder.amount,
          status: existingOrder.status,
          items: Array.isArray(existingOrder.items) ? existingOrder.items.length : 0,
        },
      });
    }

    // Extract order information with enhanced details
    let shippingAddress = null;
    if (session.metadata?.shippingAddress) {
      try {
        shippingAddress = JSON.parse(session.metadata.shippingAddress);
      } catch (e) {
        console.warn("Failed to parse shipping address from metadata:", e);
      }
    } else {
      console.warn("No shipping address found in session metadata");
    }

    const items = session.line_items?.data?.map((item: any) => ({
      id:
        item.price?.product?.metadata?.productId ||
        item.price?.product?.id ||
        "",
      name: item.price?.product?.name || "",
      description: item.price?.product?.description || "",
      images: item.price?.product?.images || [],
      quantity: item.quantity,
      price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
      total: item.amount_total ? item.amount_total / 100 : 0,
      category: item.price?.product?.metadata?.category || "",
      originalPrice: item.price?.product?.metadata?.originalPrice || "",
      discountPercentage:
        item.price?.product?.metadata?.discountPercentage || "0",
    })) || [];

    const orderData = {
      orderId: sessionId,
      amount: session.amount_total
        ? (Number(session.amount_total) / 100).toString()
        : "0.00",
      currency: session.currency || "usd",
      status: "confirmed",
      paymentStatus: session.payment_status,
      paymentMethod: "card",
      customerEmail: session.customer_details?.email || email,
      customerName: session.customer_details?.name || "",
      shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : null,
      billingAddress: session.customer_details?.address ? JSON.stringify(session.customer_details.address) : null,
      items: JSON.stringify(items),
      userEmail: email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert order into orders table
    await db.insert(orders).values(orderData);

    // Update user's orders array in users table
    const currentOrders = Array.isArray(user.orders) ? user.orders : [];
    currentOrders.push({
      ...orderData,
      items: items, // Keep as array for user data
      createdAt: orderData.createdAt.toISOString(),
      updatedAt: orderData.updatedAt.toISOString(),
    });

    await db
      .update(users)
      .set({
        orders: JSON.stringify(currentOrders),
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return NextResponse.json({
      success: true,
      message: "Order processed successfully",
      order: {
        id: orderData.orderId,
        amount: orderData.amount,
        status: orderData.status,
        items: items.length,
      },
    });
  } catch (error) {
    console.error("Order processing error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process order" },
      { status: 500 }
    );
  }
}
