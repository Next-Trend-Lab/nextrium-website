import { createClient } from '@/lib/supabase/server'

export type DashboardRole = 'admin' | 'content' | 'community'

interface DashboardUserRole {
  role: DashboardRole
}

export async function getDashboardRole(): Promise<DashboardRole> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 'community'

  const { data } = await supabase
    .from('dashboard_users')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle() as { data: DashboardUserRole | null; error: unknown }

  if (!data) return 'community'

  return data.role
}