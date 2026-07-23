import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

const BLOCKED_PATHS: Record<string, string[]> = {
  admin: [],
  content: [
    '/dashboard/applications',
    '/dashboard/contact',
    '/dashboard/email',
    '/dashboard/roles',
    '/dashboard/team',
    '/dashboard/settings',
  ],
  community: [
    '/dashboard/applications',
    '/dashboard/contact',
    '/dashboard/email',
    '/dashboard/roles',
    '/dashboard/team',
    '/dashboard/settings',
    '/dashboard/posts',
    '/dashboard/products',
  ],
}

function isRestricted(pathname: string, role: string): boolean {
  const blocked = BLOCKED_PATHS[role] ?? BLOCKED_PATHS['community']
  return blocked.some((path) => pathname.startsWith(path))
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/login') return NextResponse.next()
  if (!pathname.startsWith('/dashboard')) return NextResponse.next()

  const { response, user } = await updateSession(request)

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const role = request.cookies.get('dashboard_role')?.value ?? 'community'

  if (isRestricted(pathname, role)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}