export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function OPTIONS() {
  return new NextResponse(null, { headers: cors() });
}

export async function GET() {
  return NextResponse.json({}, { headers: { ...cors(), 'Cache-Control': 'no-store' } });
}

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

