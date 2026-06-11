'use client'

import { createContext, useContext, useState } from 'react'

interface DashboardContextType {
  sidebarOpen: boolean
  toggleSidebar: () => void
  closeSidebar: () => void
}

const DashboardContext = createContext<DashboardContextType>({
  sidebarOpen: false,
  toggleSidebar: () => {},
  closeSidebar:  () => {},
})

export function useDashboard() {
  return useContext(DashboardContext)
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <DashboardContext.Provider value={{
      sidebarOpen,
      toggleSidebar: () => setSidebarOpen((v) => !v),
      closeSidebar:  () => setSidebarOpen(false),
    }}>
      {children}
    </DashboardContext.Provider>
  )
}