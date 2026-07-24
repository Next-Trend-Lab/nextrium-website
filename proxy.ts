import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'
import { createClient } from '@supabase/supabase-js'

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

async function getUserRole(userId: string): Promise<string> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data } = await supabase
    .from('dashboard_users')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle() as { data: { role: string } | null; error: unknown }

  return data?.role ?? 'community'
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/login')        return NextResponse.next()
  if (pathname === '/set-password') return NextResponse.next()
  if (pathname.startsWith('/auth/')) return NextResponse.next()
  if (!pathname.startsWith('/dashboard')) return NextResponse.next()

  const { response, user } = await updateSession(request)

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const role = await getUserRole(user.id)

  if (isRestricted(pathname, role)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webpp)$).*)',
  ],
}