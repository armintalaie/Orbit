import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import { middlewares as activatedMiddleware } from '@/lib/middlewares/config';
import { withContext } from './context';
const allowedContextKeys = ['user', 'query'];

export default withContext(allowedContextKeys, async (setContext, req) => {

  return NextResponse.next();
  if (req.nextUrl.pathname.endsWith('.js')) {
    return NextResponse.next();
  }

  if (
    req.nextUrl.pathname.startsWith('/api/auth/callback') ||
    req.nextUrl.pathname.startsWith('/api/auth/signout') ||
    req.nextUrl.pathname.startsWith('/auth') ||
    req.nextUrl.pathname.startsWith('/api/health')
  ) {
    return NextResponse.next();
  }
  if (req.nextUrl.pathname.startsWith('/api')) {
    // Load middleware functions
    const middlewareFunctions = activatedMiddleware.map((fn) =>
      fn(setContext, req)
    );

    // Option 1: Run middleware synchronously
    // This allows you to handle each result before moving to the next\
    for (const fn of middlewareFunctions) {
      const result = await fn;

      // console.log(result);

      if (!result.ok) {
        return result;
      }
    }

    return NextResponse.next();

    // Option 2: Run middleware asynchronously
    // Using Promise.allSettled allows concurrent execution
    // const results = await Promise.allSettled(middlewareFunctions);

    // // Check each result
    // for (const result of results) {
    //   // If rejected or not OK, return first response
    //   if (result.status === 'fulfilled' && !result.value?.ok) {
    //     return result.value;
    //   } else if (result.status === 'rejected') {
    //     throw result.reason;
    //   }
    // }

    // return NextResponse.next();
  }

  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // if user is signed in and the current path is / redirect the user to /account
  if (user && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/issues/me', req.url));
  }

  // if user is not signed in and the current path is not / redirect the user to /
  if (!user && req.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
});

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
