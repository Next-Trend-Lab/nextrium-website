import { createServiceClient } from '@/lib/supabase/server'
import Header from '@/components/dashboard/Header'
import ApplicationsClient from './ApplicationsClient'
import type { Application, AgentScreeningResult } from '@/lib/types/database'

export const metadata = { title: 'Applications' }
export const dynamic = 'force-dynamic'

interface EmailSender {
  id: string
  name: string
  email: string
  is_default: boolean
}

async function getApplications(): Promise<Application[]> {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false })
  return data ?? []
}

async function getSenders(): Promise<EmailSender[]> {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('email_senders')
    .select('*')
    .order('is_default', { ascending: false })
  return (data ?? []) as EmailSender[]
}

async function getScreeningResults(): Promise<Record<string, AgentScreeningResult>> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('agent_screening_results')
    .select('*')
    .order('screened_at', { ascending: false })

  if (error) {
    console.warn('[ApplicationsPage] Could not fetch screening results:', error.message)
    return {}
  }

  const map: Record<string, AgentScreeningResult> = {}
  data?.forEach((row: any) => {
    // Keep most recent screening result per application
    if (!map[row.application_id]) {
      map[row.application_id] = row as AgentScreeningResult
    }
  })
  return map
}

export default async function ApplicationsPage() {
  const [applications, senders, screeningResults] = await Promise.all([
    getApplications(),
    getSenders(),
    getScreeningResults(),
  ])
  return (
    <>
      <Header title="Applications" description="Review and manage job applications" />
      <div className="dash-content">
        <ApplicationsClient
          applications={applications}
          senders={senders}
          initialScreeningResults={screeningResults}
        />
      </div>
    </>
  )
}