'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface HeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export default function Header({ title, description, action }: HeaderProps) {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/dashboard/login')
    router.refresh()
  }

  return (
    <>
      <style>{`
        .dash-header {
          height: 64px; flex-shrink: 0;
          background: var(--navy);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center; padding: 0 32px; gap: 16px;
        }
        .dash-header-title {
          font-family: var(--font-exo2, 'Exo 2', sans-serif);
          font-weight: 700; font-size: 18px; color: var(--white); letter-spacing: -0.3px;
        }
        .dash-header-desc { font-size: 12px; color: var(--grey-mid); margin-top: 1px; }
        .dash-header-right { margin-left: auto; display: flex; align-items: center; gap: 12px; }
        .dash-signout-btn {
          font-family: var(--font-mono, 'Space Mono', monospace);
          font-size: 8px; letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--grey-mid); background: none; cursor: pointer;
          padding: 6px 12px; border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.15s ease;
        }
        .dash-signout-btn:hover { color: var(--white); border-color: rgba(255,255,255,0.2); }
      `}</style>

      <header className="dash-header">
        <div>
          <div className="dash-header-title">{title}</div>
          {description && <div className="dash-header-desc">{description}</div>}
        </div>
        <div className="dash-header-right">
          {action}
          <button className="dash-signout-btn" onClick={handleSignOut}>Sign out</button>
        </div>
      </header>
    </>
  )
}
