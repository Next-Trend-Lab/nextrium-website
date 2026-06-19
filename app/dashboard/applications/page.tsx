import { createServiceClient } from '@/lib/supabase/server'
import Header from '@/components/dashboard/Header'
import ApplicationsClient from './ApplicationsClient'
import type { Application } from '@/lib/types/database'

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

export default async function ApplicationsPage() {
  const [applications, senders] = await Promise.all([
    getApplications(),
    getSenders(),
  ])
  return (
    <>
      <Header title="Applications" description="Review and manage job applications" />
      <div className="dash-content">
        <ApplicationsClient applications={applications} senders={senders} />
      </div>
    </>
  )
}