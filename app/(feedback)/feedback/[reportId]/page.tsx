import { createClient } from '@/lib/supabase/server'
import { notFound }     from 'next/navigation'
import ReportClient     from './ReportClient'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title:  'Evaluation Report',
    robots: { index: false, follow: false },
  }
}

interface Props {
  params: Promise<{ reportId: string }>
}

export default async function ReportPage({ params }: Props) {
  const { reportId } = await params
  const supabase     = await createClient()

  const { data: report, error } = await supabase
    .from('screening_reports')
    .select('*')
    .eq('id', reportId.toUpperCase())
    .single()

  if (error || !report) notFound()

  return <ReportClient report={report as any} />
}