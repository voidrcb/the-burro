import { NextResponse } from 'next/server';

import { OPERATOR_SESSION_COOKIE } from '@/lib/auth/operator-auth';

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.delete(OPERATOR_SESSION_COOKIE);

  return response;
}

export async function GET() {
  const response = NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));

  response.cookies.delete(OPERATOR_SESSION_COOKIE);

  return response;
}
