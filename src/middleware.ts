
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
    // console.error('JWT verification failed:', error); // Can be noisy
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public API routes that don't require JWT verification
  const publicApiRoutes = [
    '/api/auth/login',
    '/api/auth/signup',
  ];

  if (publicApiRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  const authHeader = request.headers.get('authorization');
  let userId: string | null = null;
  let userEmail: string | null = null;
  let userRole: string | null = null;
  let userName: string | null = null;

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const decodedPayload = await verifyToken(token);
    if (decodedPayload && decodedPayload.userId && typeof decodedPayload.userId === 'string') {
      userId = decodedPayload.userId;
      requestHeaders.set('x-user-id', userId);
      if (decodedPayload.email && typeof decodedPayload.email === 'string') {
        userEmail = decodedPayload.email;
        requestHeaders.set('x-user-email', userEmail);
      }
      if (decodedPayload.name && typeof decodedPayload.name === 'string') {
        userName = decodedPayload.name;
        requestHeaders.set('x-user-name', userName);
      }
      if (decodedPayload.role && typeof decodedPayload.role === 'string') {
        userRole = decodedPayload.role;
        requestHeaders.set('x-user-role', userRole);
      }
    }
  }
  
  // Public GET routes for viewing data
  const isPublicGet = request.method === 'GET' && (
    pathname.startsWith('/api/properties') ||
    pathname.startsWith('/api/blog') || // Allow public GET for all blog content
    pathname.startsWith('/api/projects') ||
    pathname.startsWith('/api/testimonials')
  );
  if (isPublicGet) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Protected API routes
  const isAdminRoute = pathname.startsWith('/api/admin/');
  const isPropertyMutation = pathname.startsWith('/api/properties') && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method);
  const isBlogPostCreation = pathname === '/api/blog/posts' && request.method === 'POST';
  const isMyPropertiesRoute = pathname.startsWith('/api/my-properties');
  const isUpdateStatusRoute = pathname.startsWith('/api/properties/') && pathname.endsWith('/update-status') && request.method === 'PATCH';

  if (isAdminRoute || isPropertyMutation || isBlogPostCreation || isMyPropertiesRoute || isUpdateStatusRoute) {
    if (!userId) {
      return new NextResponse(JSON.stringify({ success: false, error: 'Authorization header missing, malformed, or token invalid/expired.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    if (isAdminRoute || isUpdateStatusRoute) {
      if (userRole !== 'admin') {
        return new NextResponse(JSON.stringify({ success: false, error: 'Forbidden: Admin access required' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
      }
    }

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // For any other API routes not covered, default to allowing
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*', // Apply middleware to all API routes
  ],
};
