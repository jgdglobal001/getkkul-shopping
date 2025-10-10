import { NextRequest, NextResponse } from "next/server";

// Firebase storage has been removed
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "Image upload is currently disabled" },
    { status: 503 }
  );
}
