import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  const resp = await updateSession(request);
  if (request.nextUrl.pathname.endsWith('.js')) {
    return resp;
  }

  if (
    request.nextUrl.pathname.startsWith('/api/auth/callback') ||
    request.nextUrl.pathname.startsWith('/api/auth/signout') ||
    request.nextUrl.pathname.startsWith('/auth')
  ) {
    return resp;
  }
  if (request.nextUrl.pathname.startsWith('/api')) {
    if (!resp.headers.get('user') || !resp.headers.get('user') === null) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }
  return resp;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - icon.png
     */
    '/((?!_next/static|_next/image|favicon.ico|icon.png|public/.*).*)',
  ],
};
