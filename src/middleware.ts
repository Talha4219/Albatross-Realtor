
import { NextResponse, type NextRequest } from 'next/server';
import * as jose from 'jose'; 

const JWT_SECRET_STRING = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@albatrossrealtor.com'; 

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

  // Check if the current path is a public API route
  if (publicApiRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  const authHeader = request.headers.get('authorization');
  let userId: string | null = null;
  let userEmail: string | null = null;
  let userRole: string | null = null; // Add role

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const decodedPayload = await verifyToken(token);
    if (decodedPayload && decodedPayload.userId && typeof decodedPayload.userId === 'string') {
      userId = decodedPayload.userId;
      requestHeaders.set('x-user-id', userId); // Standardize to x-user-id
      if (decodedPayload.email && typeof decodedPayload.email === 'string') {
        userEmail = decodedPayload.email;
        requestHeaders.set('x-user-email', userEmail);
      }
      if (decodedPayload.role && typeof decodedPayload.role === 'string') { // Extract role
        userRole = decodedPayload.role;
        requestHeaders.set('x-user-role', userRole);
      }
    }
  }
  
  // Allow public GET /api/properties (for listing approved properties)
  // Also allow public GET /api/properties/[id] (for viewing a single approved property)
  if (pathname.startsWith('/api/properties') && request.method === 'GET') {
    // No specific JWT check needed for public GETs here, but headers are passed along if token was valid
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Protected API routes:
  // - /api/admin/*
  // - /api/properties (POST, PUT, DELETE to / or /[id])
  // - /api/my-properties
  // - /api/properties/[id]/update-status
  const isAdminRoute = pathname.startsWith('/api/admin/');
  const isPropertyMutation = pathname.startsWith('/api/properties') && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method);
  const isMyPropertiesRoute = pathname.startsWith('/api/my-properties');
  const isUpdateStatusRoute = pathname.startsWith('/api/properties/') && pathname.endsWith('/update-status') && request.method === 'PATCH';


  if (isAdminRoute || isPropertyMutation || isMyPropertiesRoute || isUpdateStatusRoute) {
    if (!userId) { // No valid token found or token verification failed
      return new NextResponse(JSON.stringify({ success: false, error: 'Authorization header missing, malformed, or token invalid/expired.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    // Admin-specific route checks for /api/admin/* and /api/properties/[id]/update-status
    if (isAdminRoute || isUpdateStatusRoute) {
      if (userEmail !== ADMIN_EMAIL) { // or check userRole === 'admin'
        return new NextResponse(JSON.stringify({ success: false, error: 'Forbidden: Admin access required' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
      }
    }
    
    // For other protected property mutations (POST /api/properties, PUT/DELETE /api/properties/[id])
    // and /api/my-properties, just being authenticated (userId present) is enough for middleware.
    // The route handlers themselves will perform finer-grained checks (e.g., ownership for PUT/DELETE, admin role for certain actions).

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // For any other API routes not covered, default to allowing (or add more specific rules)
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*', // Apply middleware to all API routes
  ],
};
