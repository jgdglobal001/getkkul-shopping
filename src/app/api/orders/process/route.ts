import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, orders } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { paymentKey, orderId, amount, email, orderData } = await request.json();

    if (!paymentKey || !orderId || !amount || !email) {
      return NextResponse.json(
        { success: false, error: "Payment key, order ID, amount, and email are required" },
        { status: 400 }
      );
    }

    // 토스페이먼츠 결제 승인 API 호출
    const tossResponse = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${Buffer.from(process.env.TOSS_SECRET_KEY + ":").toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });

    const tossPayment = await tossResponse.json();

    if (!tossResponse.ok || tossPayment.status !== "DONE") {
      return NextResponse.json(
        { success: false, error: "Payment verification failed" },
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
    const existingOrder = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);

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

    // Extract order information from orderData
    const shippingAddress = orderData?.shippingAddress || null;
    const orderItems = orderData?.items || [];

    // Insert order into Neon DB
    const newOrder = await db.insert(orders).values({
      id: orderId,
      userId: userData.id,
      totalAmount: (amount / 100).toString(), // 토스페이먼츠는 원 단위로 전달됨
      currency: "KRW",
      status: "confirmed",
      paymentStatus: "paid",
      paymentMethod: tossPayment.method || "card",
      customerEmail: email,
      customerName: userData.name || "",
      shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : null,
      billingAddress: null,
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
