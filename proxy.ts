import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const { response, user } = await updateSession(request)

  if (pathname.startsWith('/dashboard')) {
    if (pathname === '/dashboard/login') {
      if (user) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      return response
    }

    if (!user) {
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