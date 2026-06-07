import { createServiceClient } from '@/lib/supabase/server'
import Header from '@/components/dashboard/Header'
import ApplicationsClient from './ApplicationsClient'
import type { Application } from '@/lib/types/database'

export const metadata = { title: 'Applications' }

async function getApplications(): Promise<Application[]> {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function ApplicationsPage() {
  const applications = await getApplications()
  return (
    <>
      <Header title="Applications" description="Review and manage job applications" />
      <div className="dash-content">
        <ApplicationsClient applications={applications} />
      </div>
    </>
  )
}