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
): Promise<{ error?: string; result?: any; screeningRecord?: AgentScreeningResult; statusUpdated?: string | null }> {
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
  } catch (err) {
    console.error('[screenCandidateAction] Error:', err)
    return { error: err instanceof Error ? err.message : 'Screening request failed.' }
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
  try {
    const engineUrl = process.env.AGENTS_ENGINE_URL || 'http://localhost:3001'
    const apiKey = process.env.AGENTS_ENGINE_API_KEY

    const response = await fetch(`${engineUrl}/api/v1/agents/hr/dispatch-emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({ applicationIds }),
      cache: 'no-store',
    })

    const data = await response.json()
    if (!response.ok || !data.success) {
      throw new Error(data.error || `Agents Engine error (${response.status})`)
    }

    revalidatePath('/dashboard/applications')
    return {
      sentCount: data.sentCount,
      skippedCount: data.skippedCount,
      failedCount: data.failedCount,
      results: data.results,
    }
  } catch (err) {
    console.error('[dispatchEmailsAction] Error:', err)
    return { error: err instanceof Error ? err.message : 'Email dispatch failed.' }
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
  try {
    const engineUrl = process.env.AGENTS_ENGINE_URL || 'http://localhost:3001'
    const apiKey = process.env.AGENTS_ENGINE_API_KEY

    const response = await fetch(`${engineUrl}/api/v1/agents/hr/bulk-screen`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({ applicationIds }),
      cache: 'no-store',
    })

    const data = await response.json()

    // 409 means a job is already running — surface its jobId so the client can resume polling it.
    if (response.status === 409 && data.jobId) {
      return { jobId: data.jobId, error: data.error }
    }

    if (!response.ok || !data.success) {
      throw new Error(data.error || `Agents Engine error (${response.status})`)
    }

    return { jobId: data.jobId, total: data.total }
  } catch (err) {
    console.error('[startBulkScreenAction] Error:', err)
    return { error: err instanceof Error ? err.message : 'Failed to start bulk screening.' }
  }
}

export async function getBulkScreenJobStatus(
  jobId: string
): Promise<{ job?: BulkScreenJob; error?: string }> {
  try {
    const engineUrl = process.env.AGENTS_ENGINE_URL || 'http://localhost:3001'
    const apiKey = process.env.AGENTS_ENGINE_API_KEY

    const response = await fetch(`${engineUrl}/api/v1/agents/hr/bulk-screen/${jobId}`, {
      headers: { ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}) },
      cache: 'no-store',
    })

    const data = await response.json()
    if (!response.ok || !data.success) {
      throw new Error(data.error || `Agents Engine error (${response.status})`)
    }

    if (data.job?.status === 'completed') {
      revalidatePath('/dashboard/applications')
    }

    return { job: data.job }
  } catch (err) {
    console.error('[getBulkScreenJobStatus] Error:', err)
    return { error: err instanceof Error ? err.message : 'Failed to fetch job status.' }
  }
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