import { NextRequest, NextResponse } from "next/server";
import { db as neonDb } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function DELETE(request: NextRequest) {
  try {
    const { email, addressIndex } = await request.json();

    if (!email || addressIndex === undefined) {
      return NextResponse.json(
        { error: "Email and address index are required" },
        { status: 400 }
      );
    }

    const result = await neonDb.select().from(users).where(eq(users.email, email)).limit(1);

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = result[0];
    let addresses = (userData.profile as any).addresses || [];

    // Remove address at specified index
    if (addressIndex >= 0 && addressIndex < addresses.length) {
      addresses.splice(addressIndex, 1);
    } else {
      return NextResponse.json(
        { error: "Invalid address index" },
        { status: 400 }
      );
    }

    await neonDb.update(users).set({
      profile: {
        ...(userData.profile as any),
        addresses,
      },
      updatedAt: new Date(),
    }).where(eq(users.email, email));

    return NextResponse.json({ success: true, addresses });
  } catch (error) {
    console.error("Address deletion error:", error);
    return NextResponse.json(
      {
        error: "Failed to delete address",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
