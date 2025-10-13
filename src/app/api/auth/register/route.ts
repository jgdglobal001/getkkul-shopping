import { NextRequest, NextResponse } from "next/server";

// Email/password registration is disabled - only social auth is supported
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "Email/password registration is disabled. Please use social authentication." },
    { status: 403 }
  );
}
