import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  console.log('🔒 Middleware checking path:', path);

  // Don't protect the login page itself or API routes
  if (path === '/admin/login' || path.startsWith('/api/')) {
    console.log('📄 Public path, allowing access');
    return NextResponse.next();
  }

  // Protect other admin routes
  if (path.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')?.value;

    console.log('🍪 Token found:', token ? 'YES' : 'NO');

    if (!token) {
      console.log('❌ No token, redirecting to login');
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    console.log('✅ Token exists, allowing access to:', path);
    // In production, you should verify the token here
    // For now, we just check if it exists
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
