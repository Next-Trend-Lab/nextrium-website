'use server'

export async function submitReportRating(
  reportId: string,
  ratingStars: number,
  rationale: string
): Promise<{ error?: string }> {
  try {
    const engineUrl = process.env.AGENTS_ENGINE_URL || 'http://localhost:3001'
    const apiKey = process.env.AGENTS_ENGINE_API_KEY

    const response = await fetch(`${engineUrl}/api/v1/agents/hr/report-rating`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({ reportId, ratingStars, rationale }),
      cache: 'no-store',
    })

    const data = await response.json()
    if (!response.ok || !data.success) {
      throw new Error(data.error || `Agents Engine error (${response.status})`)
    }

    return {}
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to submit rating.' }
  }
}
