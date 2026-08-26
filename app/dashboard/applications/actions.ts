'use server'

import { createServiceClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { fetchAgentsEngine } from '@/lib/agentsEngine'
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
): Promise<{ error?: string; result?: any; screeningRecord?: AgentScreeningResult; statusUpdated?: string | null }> {
  const res = await fetchAgentsEngine('/api/v1/agents/hr/screen-consensus', {
    method: 'POST',
    body: JSON.stringify({
      applicationId,
      forceRescan,
      updateStatus: true,
      emailDispatch: false,
    }),
  })

  if (!res.ok) {
    return { error: res.error }
  }

  const data = res.data

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
    evaluation_track: (screeningRecord as any)?.evaluation_track ?? consensus.evaluationTrack ?? '',
    full_result: (screeningRecord as any)?.full_result ?? { consensus },
    screened_at: (screeningRecord as any)?.screened_at ?? new Date().toISOString(),
    email_sent: (screeningRecord as any)?.email_sent ?? false,
    webhook_sent: (screeningRecord as any)?.webhook_sent ?? false,
  }

  revalidatePath('/dashboard/applications')
  return {
    result: consensus,
    screeningRecord: (screeningRecord as unknown as AgentScreeningResult) || fallbackRecord,
    statusUpdated: data.statusUpdated ?? null,
  }
}

export interface DispatchEmailsResult {
  error?: string
  sentCount?: number
  skippedCount?: number
  failedCount?: number
  results?: {
    applicationId: string | null
    candidateName: string
    candidateEmail: string | null
    status: 'sent' | 'skipped' | 'failed'
    reason?: string
  }[]
}

export async function dispatchEmailsAction(applicationIds: string[] = []): Promise<DispatchEmailsResult> {
  const res = await fetchAgentsEngine('/api/v1/agents/hr/dispatch-emails', {
    method: 'POST',
    body: JSON.stringify({ applicationIds }),
  })

  if (!res.ok) {
    return { error: res.error }
  }

  revalidatePath('/dashboard/applications')
  return {
    sentCount: res.data.sentCount,
    skippedCount: res.data.skippedCount,
    failedCount: res.data.failedCount,
    results: res.data.results,
  }
}

export interface BulkScreenOutcome {
  applicationId: string
  candidateName: string
  success: boolean
  error?: string
  compositeScore?: number
  consensusTier?: string
  recommendation?: string
  evaluationTrack?: string
  statusUpdated?: string | null
  reportId?: string
}

export interface BulkScreenJob {
  id: string
  status: 'running' | 'completed' | 'failed'
  application_ids: string[]
  total: number
  succeeded: number
  failed: number
  current_index: number
  results: BulkScreenOutcome[]
  error: string | null
}

export async function startBulkScreenAction(
  applicationIds: string[]
): Promise<{ jobId?: string; total?: number; error?: string }> {
  const res = await fetchAgentsEngine('/api/v1/agents/hr/bulk-screen', {
    method: 'POST',
    body: JSON.stringify({ applicationIds }),
  })

  // 409 means a job is already running — surface its jobId so the client can resume polling it.
  if (res.status === 409 && res.data?.jobId) {
    return { jobId: res.data.jobId, error: res.error }
  }

  if (!res.ok) {
    return { error: res.error }
  }

  return { jobId: res.data.jobId, total: res.data.total }
}

export async function getBulkScreenJobStatus(
  jobId: string
): Promise<{ job?: BulkScreenJob; error?: string }> {
  const res = await fetchAgentsEngine(`/api/v1/agents/hr/bulk-screen/${jobId}`, {
    method: 'GET',
  })

  if (!res.ok) {
    return { error: res.error }
  }

  if (res.data.job?.status === 'completed') {
    revalidatePath('/dashboard/applications')
  }

  return { job: res.data.job }
}

export async function getScreeningResultsForApplications(
  applicationIds: string[]
): Promise<Record<string, AgentScreeningResult>> {
  if (applicationIds.length === 0) return {}
  try {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('agent_screening_results')
      .select('*')
      .in('application_id', applicationIds)
      .order('screened_at', { ascending: false })

    const map: Record<string, AgentScreeningResult> = {}
    data?.forEach((row: any) => {
      if (!map[row.application_id]) map[row.application_id] = row as AgentScreeningResult
    })
    return map
  } catch (err) {
    console.error('[getScreeningResultsForApplications] Error:', err)
    return {}
  }
}
