import { NextResponse } from 'next/server';

import {
  generateSessionToken,
  getOperatorAuthConfig,
  OPERATOR_SESSION_COOKIE,
} from '@/lib/auth/operator-auth';

export async function POST(request: Request) {
  try {
    const { operators, sessionSecret } = getOperatorAuthConfig();
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const operator = operators.find(
      (op) =>
        op.username.toLowerCase() === username.toLowerCase() &&
        op.password === password
    );

    if (!operator) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const token = await generateSessionToken(sessionSecret);

    const response = NextResponse.json({ success: true, operator: operator.username });

    response.cookies.set(OPERATOR_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Login failed' },
      { status: 500 }
    );
  }
}
