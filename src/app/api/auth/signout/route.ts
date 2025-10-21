export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const url = new URL(req.url);
  const origin = `${url.protocol}//${url.host}`.replace(/\/$/, '');
  return new NextResponse(null, {
    status: 302,
    headers: {
      Location: origin + '/',
      'Set-Cookie': 'app_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
    },
  });
}

export async function GET(req: Request) { return POST(req); }

