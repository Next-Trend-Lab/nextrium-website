'use server'

import { createServiceClient } from '@/lib/supabase/server'

export interface TeamActivityLog {
  id: string
  actor_id: string | null
  actor_email: string | null
  action: string
  target_type: string | null
  target_id: string | null
  details: Record<string, unknown>
  created_at: string
}

export async function getTeamActivityLogs(params: {
  limit?: number
  before?: string
} = {}): Promise<{ logs: TeamActivityLog[]; error?: string }> {
  try {
    const supabase = createServiceClient()
    let query = supabase
      .from('team_activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(params.limit ?? 50)

    if (params.before) {
      query = query.lt('created_at', params.before)
    }

    const { data, error } = await query

    if (error) throw new Error(error.message)

    return { logs: (data ?? []) as TeamActivityLog[] }
  } catch (err) {
    console.error('[getTeamActivityLogs] Error:', err)
    return { logs: [], error: err instanceof Error ? err.message : 'Failed to load activity logs.' }
  }
}
