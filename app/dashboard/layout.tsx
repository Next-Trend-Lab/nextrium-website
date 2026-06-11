import DashboardShell from '@/components/dashboard/DashboardShell'

export const metadata = {
  title: { default: 'Dashboard', template: '%s | NexTrium Dashboard' },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardShell>{children}</DashboardShell>
}