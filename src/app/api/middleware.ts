import { NextRequest, NextResponse } from 'next/server';
import cookie from 'cookie';
import { jwtMiddleware } from '@/lib/jwt'; // Function to verify and decode JWT
import { validatePermission } from '@/lib/permissions'; // Permission validation

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip public routes (like login or public APIs)
  if (path.startsWith('/api/auth') || path.startsWith('/')) {
    console.log('[Middleware] Public route, bypassing...');
    return NextResponse.next();
  }

  // Retrieve the token from cookies
  const cookies = cookie.parse(request.headers.get('Cookie') || '');
  const token = cookies.auth_token;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
  }

  try {
    // Decode and validate token from cookies
    const decodedToken = jwtMiddleware(request);

    if (!decodedToken || !decodedToken.data?.user) {
      return NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 });
    }

    // You can remove the `allowedRoles` check if you use `validatePermission`
    const action = getActionFromPath(path, request.method);
    
    // Permission check based on action and user role
    const permissionCheck = validatePermission(decodedToken.data.user, action);
    
    if (permissionCheck !== true) {
      return permissionCheck; // If permission fails, return response directly
    }

    // If everything passes, proceed to the next middleware or route
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error.message);
    return NextResponse.json({ error: error.message || 'Unauthorized access' }, { status: 401 });
  }
}

// Helper function to determine action based on path and HTTP method
function getActionFromPath(path: string, method: string): string {
  if (method === 'POST') return 'create';
  if (method === 'GET') return 'read';
  if (method === 'PUT') return 'update';
  if (method === 'DELETE') return 'delete';
  return 'unknown'; // Default action
}

// Matcher for all API routes
export const config = {
  matcher: ['/api/:path*'], // This ensures the middleware is applied only to API routes
};

console.log('object configuration:' , config);