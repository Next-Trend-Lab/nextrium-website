import Header from '@/components/dashboard/Header'
import LogsClient from './LogsClient'
import { getTeamActivityLogs } from './actions'

export const metadata = { title: 'Activity Logs' }
export const dynamic = 'force-dynamic'

export default async function LogsPage() {
  const { logs, error } = await getTeamActivityLogs({ limit: 50 })

  return (
    <>
      <Header title="Activity Logs" description="Team actions and AI agent processing history" />
      <div className="dash-content">
        <LogsClient initialLogs={logs} initialError={error ?? null} />
      </div>
    </>
  )
}
