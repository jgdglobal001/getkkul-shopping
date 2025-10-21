export const runtime = 'edge';

import { NextResponse } from 'next/server';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { headers: CORS });
}

export async function GET(req: Request) {
  const cookieHeader = req.headers.get('cookie') || '';
  const m = cookieHeader.match(/app_session=([^;]+)/);
  if (!m) {
    return new NextResponse('null', { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...CORS } });
  }
  let raw: any = null;
  try { raw = JSON.parse(atob(m[1])); } catch {
    try { raw = JSON.parse(decodeURIComponent(escape(atob(m[1])))); } catch { raw = null; }
  }
  if (!raw || !raw.user) {
    return new NextResponse('null', { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...CORS } });
  }
  const maxAgeSec = 60 * 60 * 24 * 14;
  const expires = new Date((raw.issuedAt || Date.now()) + maxAgeSec * 1000).toISOString();
  const user = { name: raw.user.name, email: raw.user.email, role: raw.user.role || 'user', id: raw.user.id };
  return NextResponse.json({ user, expires }, { headers: { 'Cache-Control': 'no-store', ...CORS } });
}

