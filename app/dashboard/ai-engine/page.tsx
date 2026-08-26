import Header from '@/components/dashboard/Header'
import AIEngineClient from './AIEngineClient'
import { getAgentMetrics } from './actions'

export const metadata = { title: 'AI Engine' }
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export default async function AIEnginePage() {
  const { metrics, error } = await getAgentMetrics()

  return (
    <>
      <Header title="AI Engine" description="Monitor and manage Nextrium's AI agents" />
      <div className="dash-content">
        <AIEngineClient initialMetrics={metrics ?? null} initialError={error ?? null} />
      </div>
    </>
  )
}
