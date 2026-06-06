import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const response = await updateSession(request)

  if (pathname.startsWith('/dashboard')) {
    if (pathname === '/dashboard/login') return response

    const sessionCookie =
      request.cookies.get('sb-access-token') ??
      request.cookies.get('sb-refresh-token') ??
      [...request.cookies.getAll()].find((c) =>
        c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
      )

    if (!sessionCookie) {
      const loginUrl = new URL('/dashboard/login', request.url)
      loginUrl.searchParams.set('redirected', '1')
      return NextResponse.redirect(loginUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
