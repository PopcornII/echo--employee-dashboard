import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export function middleware(req: NextRequest) {
  const token = req.headers.get('auth_token')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url)); // Redirect to login if no token
  }

  try {
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.redirect(new URL('/login', req.url)); // Invalid token, redirect to login
    }
 
    return NextResponse.next(); // Proceed if valid
  } catch (error) {
    return NextResponse.redirect(new URL('/login', req.url)); // Catch any error and redirect to login
  }
}

// Apply middleware to specific routes
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};


// import { NextRequest, NextResponse } from 'next/server';
// import { verifyToken } from '@/lib/jwt';

// const roleAccess: { [key: string]: string[] } = {
//   "1": ['/dashboard', '/admin'], // Admin routes
//   "2": ['/dashboard', '/teacher'], // Teacher routes
//   "3": ['/dashboard'],  // Student routes
//   "4": ['/home'],  // Guest routes
// };

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get('auth_token')?.value;
  
//   if (!token) {
//     return NextResponse.redirect(new URL('/login', request.url)); // Redirect if token is missing
//   }

//   try {
//     const payload = verifyToken(token);
//     const userRole = String(payload.role);
//     const requestedPath = request.nextUrl.pathname;

//     if (!roleAccess[userRole]?.some((path) => requestedPath.startsWith(path))) {
//       return NextResponse.redirect(new URL('/403', request.url)); // Forbidden
//     }

//     return NextResponse.next();
//   } catch (error) {
//     console.error('Token verification failed:', error);
//     return NextResponse.redirect(new URL('/login', request.url)); // Redirect if verification fails
//   }
// }

// export const config = {
//   matcher: ['/dashboard/:path*', '/admin/:path*', '/teacher/:path*'],
// };
