'use client'

import Sidebar from './Sidebar'
import { DashboardProvider } from './DashboardContext'
import type { DashboardRole } from '@/lib/dashboard/getRole'

function ShellInner({ children, role }: { children: React.ReactNode; role: DashboardRole }) {
  return (
    <>
      <style>{`
        .dash-shell { display: flex; min-height: 100vh; background: var(--navy-deep); }
        .dash-main { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow-x: hidden; }
        .dash-content { flex: 1; padding: 32px; overflow-y: auto; }
        @media (max-width: 768px) { .dash-content { padding: 16px; } }
      `}</style>
      <div className="dash-shell">
        <Sidebar role={role} />
        <div className="dash-main">{children}</div>
      </div>
    </>
  )
}

export default function DashboardShell({ children, role }: { children: React.ReactNode; role: DashboardRole }) {
  return (
    <DashboardProvider>
      <ShellInner role={role}>{children}</ShellInner>
    </DashboardProvider>
  )
}