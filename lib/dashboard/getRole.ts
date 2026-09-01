import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export type DashboardRole = 'admin' | 'content' | 'community' | 'moderator'

interface DashboardUserRole {
  role: DashboardRole
}

const ROLE_COOKIE = 'nextrium-role'

/**
 * Resolves the current user's dashboard role. Checks the same
 * "<userId>:<role>" cookie the middleware caches per-request first — this
 * page-level lookup used to run its own independent auth.getUser() +
 * dashboard_users query on every single dashboard page render, on top of
 * the middleware doing the exact same check moments earlier. Reusing the
 * cache here cuts that duplicate round-trip on every navigation.
 */
export async function getDashboardRole(): Promise<DashboardRole> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 'community'

  const cookieStore = await cookies()
  const cached = cookieStore.get(ROLE_COOKIE)?.value
  if (cached) {
    const [cachedUserId, cachedRole] = cached.split(':')
    if (cachedUserId === user.id && cachedRole) return cachedRole as DashboardRole
  }

  const { data } = await supabase
    .from('dashboard_users')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle() as { data: DashboardUserRole | null; error: unknown }

  if (!data) return 'community'

  return data.role
}