import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

// Routes that require authentication
const protectedRoutes = [
  '/cart',
  '/checkout',
  '/orders',
  '/admin',
];

// Routes that should redirect authenticated users away
const authRoutes = ['/login', '/register'];

// Admin-only routes
const adminRoutes = ['/admin'];

// Customer-only routes (admins should not access these)
const customerOnlyRoutes = ['/cart', '/checkout'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Get token from Authorization header or cookie
  const authHeader = request.headers.get('authorization');
  let token = authHeader?.replace('Bearer ', '');

  // Fallback to cookie if no header
  if (!token) {
    token = request.cookies.get('token')?.value;
  }

  let user = null;
  let isAuthenticated = false;

  // Verify token if exists
  if (token) {
    try {
      const decoded = verifyToken(token);
      user = decoded;
      isAuthenticated = true;
    } catch (error) {
      // Token invalid or expired - clear it
      const response = NextResponse.next();
      response.cookies.delete('token');
      isAuthenticated = false;
    }
  }

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isCustomerOnlyRoute = customerOnlyRoutes.some(route => pathname.startsWith(route));

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages (role-based)
  if (isAuthRoute && isAuthenticated) {
    if (user.role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/products', request.url));
    }
  }

  // Check admin access - prevent non-admins from accessing admin routes
  if (isAdminRoute && isAuthenticated) {
    if (user.role !== 'admin') {
      const response = NextResponse.redirect(new URL('/', request.url));

      // Set error message in cookie for UI to display
      response.cookies.set('auth_error', 'You do not have permission to access this page', {
        maxAge: 5,
        path: '/',
      });

      return response;
    }
  }

  // Prevent admins from accessing customer-only routes
  if (isCustomerOnlyRoute && isAuthenticated && user.role === 'admin') {
    const response = NextResponse.redirect(new URL('/admin/dashboard', request.url));

    response.cookies.set('auth_error', 'Admin users cannot access customer-only pages', {
      maxAge: 5,
      path: '/',
    });

    return response;
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|assets).*)',
  ],
};
