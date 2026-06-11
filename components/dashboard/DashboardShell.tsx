'use client'

import Sidebar from './Sidebar'
import { DashboardProvider, useDashboard } from './DashboardContext'

function ShellInner({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, closeSidebar } = useDashboard()

  return (
    <>
      <style>{`
        .dash-shell { display: flex; min-height: 100vh; background: var(--navy-deep); }
        .dash-main { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow-x: hidden; }
        .dash-content { flex: 1; padding: 32px; overflow-y: auto; }
        @media (max-width: 768px) { .dash-content { padding: 16px; } }
      `}</style>
      <div className="dash-shell">
        <Sidebar open={sidebarOpen} onClose={closeSidebar} />
        <div className="dash-main">{children}</div>
      </div>
    </>
  )
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <ShellInner>{children}</ShellInner>
    </DashboardProvider>
  )
}