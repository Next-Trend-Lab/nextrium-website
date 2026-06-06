import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/dashboard/Sidebar'

export const metadata = {
  title: { default: 'Dashboard', template: '%s | NexTrium Dashboard' },
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/dashboard/login')

  return (
    <>
      <style>{`
        .dash-shell { display: flex; min-height: 100vh; background: var(--navy-deep); }
        .dash-main { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow-x: hidden; }
        .dash-content { flex: 1; padding: 32px; overflow-y: auto; }
      `}</style>
      <div className="dash-shell">
        <Sidebar />
        <div className="dash-main">{children}</div>
      </div>
    </>
  )
}
