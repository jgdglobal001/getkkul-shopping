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

    // Find user in Neon DB first
    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (userResult.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const userData = userResult[0];

    // Check if order already exists to prevent duplicates
    const existingOrder = await db.select().from(orders).where(eq(orders.stripeSessionId, sessionId)).limit(1);

    if (existingOrder.length > 0) {
      return NextResponse.json({
        success: true,
        message: "Order already processed",
        order: {
          id: existingOrder[0].id,
          amount: existingOrder[0].totalAmount,
          status: existingOrder[0].status,
          items: existingOrder[0].items ? JSON.parse(existingOrder[0].items).length : 0,
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

    const orderItems = session.line_items?.data?.map((item: any) => ({
      id: item.price?.product?.metadata?.productId || item.price?.product?.id || "",
      name: item.price?.product?.name || "",
      description: item.price?.product?.description || "",
      images: item.price?.product?.images || [],
      quantity: item.quantity,
      price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
      total: item.amount_total ? item.amount_total / 100 : 0,
      category: item.price?.product?.metadata?.category || "",
      originalPrice: item.price?.product?.metadata?.originalPrice || "",
      discountPercentage: item.price?.product?.metadata?.discountPercentage || "0",
    })) || [];

    // Insert order into Neon DB
    const newOrder = await db.insert(orders).values({
      userId: userData.id,
      stripeSessionId: sessionId,
      totalAmount: session.amount_total ? (session.amount_total / 100).toString() : "0.00",
      currency: session.currency || "usd",
      status: "confirmed",
      paymentStatus: session.payment_status,
      paymentMethod: "card",
      customerEmail: session.customer_details?.email || email,
      customerName: session.customer_details?.name || "",
      shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : null,
      billingAddress: session.customer_details?.address ? JSON.stringify(session.customer_details.address) : null,
      items: JSON.stringify(orderItems),
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    return NextResponse.json({
      success: true,
      message: "Order processed successfully",
      order: {
        id: newOrder[0].id,
        amount: newOrder[0].totalAmount,
        status: newOrder[0].status,
        items: orderItems.length,
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
