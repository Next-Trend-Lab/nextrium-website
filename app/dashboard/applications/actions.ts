'use server'

import { createServiceClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { AgentScreeningResult } from '@/lib/types/database'

export async function deleteApplication(id: string): Promise<{ error?: string }> {
  try {
    const supabase = createServiceClient()
    const { error } = await (supabase.from('applications') as any)
      .delete()
      .eq('id', id)
    if (error) throw new Error(error.message)
    revalidatePath('/dashboard/applications')
    return {}
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to delete application.' }
  }
}

export async function screenCandidateAction(
  applicationId: string,
  forceRescan: boolean = false
): Promise<{ error?: string; result?: any; screeningRecord?: AgentScreeningResult }> {
  try {
    const engineUrl = process.env.AGENTS_ENGINE_URL || 'http://localhost:3001'
    const apiKey = process.env.AGENTS_ENGINE_API_KEY

    const response = await fetch(`${engineUrl}/api/v1/agents/hr/screen-consensus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        applicationId,
        forceRescan,
        updateStatus: true,
        emailDispatch: false,
      }),
      cache: 'no-store',
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || data.message || `Agents Engine error (${response.status})`)
    }

    // Query the stored record for the client
    const supabase = createServiceClient()
    const { data: screeningRecord } = await supabase
      .from('agent_screening_results')
      .select('*')
      .eq('application_id', applicationId)
      .order('screened_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const consensus = data.consensus || data
    const fallbackRecord: AgentScreeningResult = {
      id: (screeningRecord as any)?.id || crypto.randomUUID(),
      application_id: applicationId,
      input_hash: (screeningRecord as any)?.input_hash || data.inputHash || '',
      composite_score: (screeningRecord as any)?.composite_score ?? consensus.compositeMatchScore ?? 0,
      consensus_tier: (screeningRecord as any)?.consensus_tier ?? consensus.consensusTier ?? 'Tier 3',
      recommendation: (screeningRecord as any)?.recommendation ?? consensus.finalRecommendation ?? 'Manual Review',
      full_result: (screeningRecord as any)?.full_result ?? { consensus },
      screened_at: (screeningRecord as any)?.screened_at ?? new Date().toISOString(),
      email_sent: (screeningRecord as any)?.email_sent ?? false,
      webhook_sent: (screeningRecord as any)?.webhook_sent ?? false,
    }

    revalidatePath('/dashboard/applications')
    return {
      result: consensus,
      screeningRecord: (screeningRecord as unknown as AgentScreeningResult) || fallbackRecord,
    }
  } catch (err) {
    console.error('[screenCandidateAction] Error:', err)
    return { error: err instanceof Error ? err.message : 'Screening request failed.' }
  }
}