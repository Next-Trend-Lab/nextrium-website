import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Never redirect the login page — this prevents the loop
  if (pathname === '/dashboard/login') {
    return NextResponse.next()
  }

  // Only run auth check for dashboard routes
  if (!pathname.startsWith('/dashboard')) {
    return NextResponse.next()
  }

  const { response, user } = await updateSession(request)

  if (!user) {
    const loginUrl = new URL('/dashboard/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}