import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import {
  getOperatorAuthConfig,
  OPERATOR_SESSION_COOKIE,
  validateSessionToken,
} from '@/lib/auth/operator-auth';

const PROTECTED_PATHS = ['/assistant'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

  if (!isProtected) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get(OPERATOR_SESSION_COOKIE);

  if (!authCookie?.value) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  let sessionSecret: string;
  try {
    ({ sessionSecret } = getOperatorAuthConfig());
  } catch {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete(OPERATOR_SESSION_COOKIE);
    return response;
  }

  if (!(await validateSessionToken(authCookie.value, sessionSecret))) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnTo', pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(OPERATOR_SESSION_COOKIE);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/assistant/:path*'],
};
