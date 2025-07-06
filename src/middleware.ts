
import { NextResponse, type NextRequest } from 'next/server';
import * as jose from 'jose';

const JWT_SECRET_STRING = process.env.JWT_SECRET;

async function verifyToken(token: string): Promise<jose.JWTPayload | null> {
  if (!JWT_SECRET_STRING) {
    console.error('JWT_SECRET is not defined in environment variables.');
    return null;
  }
  try {
    const secret = new TextEncoder().encode(JWT_SECRET_STRING);
    const { payload } = await jose.jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);

  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const decodedPayload = await verifyToken(token);
    if (decodedPayload) {
      if (decodedPayload.userId && typeof decodedPayload.userId === 'string') {
        requestHeaders.set('x-user-id', decodedPayload.userId);
      }
      if (decodedPayload.email && typeof decodedPayload.email === 'string') {
        requestHeaders.set('x-user-email', decodedPayload.email);
      }
      if (decodedPayload.name && typeof decodedPayload.name === 'string') {
        requestHeaders.set('x-user-name', decodedPayload.name);
      }
      if (decodedPayload.role && typeof decodedPayload.role === 'string') {
        requestHeaders.set('x-user-role', decodedPayload.role);
      }
    }
  }

  // Pass modified headers to the next handler
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
};
