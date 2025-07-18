import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const protectedRoutes = ['/room', '/game', '/profile'];
  const authRoutes = ['/login', '/register'];
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('token')?.value;
  const isLoggedIn = token ? true : false;

  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (authRoutes.includes(pathname)) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
