import { cookies } from 'next/headers'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { getDashboardRole } from '@/lib/dashboard/getRole'

export const metadata = {
  title: { default: 'Dashboard', template: '%s | NexTrium Dashboard' },
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const role = await getDashboardRole()

  const cookieStore = await cookies()
  cookieStore.set('dashboard_role', role, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  })

  return <DashboardShell role={role}>{children}</DashboardShell>
}