'use client'

import { createContext, useContext, useState } from 'react'

export interface CopilotTarget {
  domainType: string
  resourceId: string
  reportId?: string | null
  candidateName?: string
  /** Optional seed prompt/context shown when the drawer opens, e.g. from a "Refine" action. */
  initialPrompt?: string
}

interface DashboardContextType {
  sidebarOpen: boolean
  toggleSidebar: () => void
  closeSidebar: () => void
  copilotTarget: CopilotTarget | null
  openCopilot: (target: CopilotTarget) => void
  closeCopilot: () => void
}

const DashboardContext = createContext<DashboardContextType>({
  sidebarOpen: false,
  toggleSidebar: () => {},
  closeSidebar:  () => {},
  copilotTarget: null,
  openCopilot: () => {},
  closeCopilot: () => {},
})

export function useDashboard() {
  return useContext(DashboardContext)
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [copilotTarget, setCopilotTarget] = useState<CopilotTarget | null>(null)

  return (
    <DashboardContext.Provider value={{
      sidebarOpen,
      toggleSidebar: () => setSidebarOpen((v) => !v),
      closeSidebar:  () => setSidebarOpen(false),
      copilotTarget,
      openCopilot: (target) => setCopilotTarget(target),
      closeCopilot: () => setCopilotTarget(null),
    }}>
      {children}
    </DashboardContext.Provider>
  )
}
