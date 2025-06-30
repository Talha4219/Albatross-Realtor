
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
  const requestHeaders = new Headers(request.headers);

  // --- Start: Token Verification and Header Injection ---
  // This logic runs for all matched API routes.
  const authHeader = request.headers.get('authorization');
  let userId: string | null = null;
  let userRole: string | null = null;

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const decodedPayload = await verifyToken(token);
    if (decodedPayload && decodedPayload.userId && typeof decodedPayload.userId === 'string') {
      userId = decodedPayload.userId;
      userRole = (decodedPayload.role as string) || null;
      
      requestHeaders.set('x-user-id', userId);
      if (decodedPayload.email && typeof decodedPayload.email === 'string') {
        requestHeaders.set('x-user-email', decodedPayload.email);
      }
      if (decodedPayload.name && typeof decodedPayload.name === 'string') {
        requestHeaders.set('x-user-name', decodedPayload.name);
      }
      if (userRole) {
        requestHeaders.set('x-user-role', userRole);
      }
    }
  }
  // --- End: Token Verification and Header Injection ---

  // --- Start: Route Protection ---
  // Now, check if the route requires authentication or specific roles.
  
  // Routes requiring admin role
  const adminRoutes = ['/api/admin/', '/api/properties/[id]/update-status'];
  if (adminRoutes.some(route => pathname.startsWith(route.replace(/\[.*?\]/, '[^/]+')))) {
    if (userRole !== 'admin') {
      return new NextResponse(JSON.stringify({ success: false, error: 'Forbidden: Admin access required' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }
  }

  // Routes requiring any authenticated user
  const isPostProperty = pathname.startsWith('/api/properties') && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method) && !pathname.endsWith('/increment-view');
  const isPostBlog = pathname === '/api/blog/posts' && request.method === 'POST';
  const isMyProperties = pathname.startsWith('/api/my-properties');
  const isProfileRoute = pathname.startsWith('/api/profile');

  if (isPostProperty || isPostBlog || isMyProperties || isProfileRoute) {
    if (!userId) {
      return new NextResponse(JSON.stringify({ success: false, error: 'Unauthorized or Invalid User ID' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
  }
  // --- End: Route Protection ---

  // If we've reached here, the request is allowed to proceed.
  // Pass the (potentially modified) headers to the next handler.
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/api/:path*', // Apply middleware to all API routes
  ],
};
