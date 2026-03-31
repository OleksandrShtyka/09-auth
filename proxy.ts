import { NextRequest, NextResponse } from 'next/server';

const PRIVATE_PATHS = ['/notes', '/profile'];
const AUTH_PATHS = ['/sign-in', '/sign-up'];

function isPrivatePath(pathname: string) {
  return PRIVATE_PATHS.some((path) => pathname.startsWith(path));
}

function isAuthPath(pathname: string) {
  return AUTH_PATHS.some((path) => pathname.startsWith(path));
}

export function proxy(request: NextRequest): NextResponse | undefined {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isLoggedIn = !!(accessToken || refreshToken);

  if (!isLoggedIn && isPrivatePath(pathname)) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isLoggedIn && isAuthPath(pathname)) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return undefined;
}
