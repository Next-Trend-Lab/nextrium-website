'use server'

export interface FailedScreeningEntry {
  applicationId: string
  candidateName: string
  error?: string
  jobId: string
  occurredAt: string
}

export interface AgentMetrics {
  completedScreenings: number
  failedScreenings: number
  failedList: FailedScreeningEntry[]
  rebuttals: { total: number; pending: number; reviewed: number }
  ratings: { total: number; average: number; distribution: Record<string, number> }
  tierDistribution: Record<string, number>
  averageScore: number
  emailStats: { sent: number; pending: number }
  lastJob: {
    jobId: string
    status: 'running' | 'completed' | 'failed'
    startedAt: string
    finishedAt: string | null
    total: number
    succeeded: number
    failed: number
  } | null
}

export async function getAgentMetrics(): Promise<{ metrics?: AgentMetrics; error?: string }> {
  try {
    const engineUrl = process.env.AGENTS_ENGINE_URL || 'http://localhost:3001'
    const apiKey = process.env.AGENTS_ENGINE_API_KEY

    const response = await fetch(`${engineUrl}/api/v1/agents/hr/metrics`, {
      headers: { ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}) },
      cache: 'no-store',
    })

    const data = await response.json()
    if (!response.ok || !data.success) {
      throw new Error(data.error || `Agents Engine error (${response.status})`)
    }

    return { metrics: data.metrics }
  } catch (err) {
    console.error('[getAgentMetrics] Error:', err)
    return { error: err instanceof Error ? err.message : 'Failed to load AI engine metrics.' }
  }
}
