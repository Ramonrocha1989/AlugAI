import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard', '/profile', '/proposals', '/admin', '/verification', '/pricing'];
const authCookieNames = ['refreshToken', '__Host-refreshToken'];

function isProtectedPath(pathname: string): boolean {
  return protectedRoutes.some((route) => pathname.startsWith(route));
}

function hasAuthCookie(req: NextRequest): boolean {
  return authCookieNames.some((name) => Boolean(req.cookies.get(name)?.value));
}

function isPrefetchRequest(req: NextRequest): boolean {
  return req.headers.get('next-router-prefetch') === '1' || req.headers.get('purpose') === 'prefetch';
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  // Evita ruído de prefetch RSC (ERR_TOO_MANY_REDIRECTS) sem enfraquecer o acesso real.
  if (isPrefetchRequest(req)) {
    return NextResponse.next();
  }

  if (hasAuthCookie(req)) {
    return NextResponse.next();
  }

  const loginUrl = new URL('/login', req.url);
  loginUrl.searchParams.set('next', `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/proposals/:path*', '/admin/:path*', '/verification/:path*', '/pricing/:path*'],
};
