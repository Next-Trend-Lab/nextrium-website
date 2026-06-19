'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import NTMark from '@/components/shared/NTMark'
import { useDashboard } from './DashboardContext'

const NAV_GROUPS = [
  {
    label: 'Content',
    items: [
      { label: 'Overview',           href: '/dashboard',                    icon: '◈' },
      { label: 'Posts',              href: '/dashboard/posts',              icon: '✦' },
      { label: 'Products',           href: '/dashboard/products',           icon: '◈' },
      { label: 'Events',             href: '/dashboard/events',             icon: '◉' },
      { label: 'Roles',              href: '/dashboard/roles',              icon: '◎' },
      { label: 'Community Projects', href: '/dashboard/community-projects', icon: '◈' },
      { label: 'Team',               href: '/dashboard/team',               icon: '◈' },
    ],
  },
  {
    label: 'Inbox',
    items: [
      { label: 'Applications', href: '/dashboard/applications', icon: '◐' },
      { label: 'Contact',      href: '/dashboard/contact',      icon: '◑' },
      { label: 'Send Email',   href: '/dashboard/email',        icon: '✉' },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, closeSidebar } = useDashboard()

  useEffect(() => {
    closeSidebar()
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <style>{`
        .sidebar-overlay { display: none; position: fixed; inset: 0; z-index: 39; background: rgba(7,22,40,0.7); backdrop-filter: blur(2px); }
        .sidebar-overlay.open { display: block; }
        .sidebar { width: 240px; flex-shrink: 0; background: var(--navy); border-right: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; height: 100vh; position: sticky; top: 0; overflow-y: auto; z-index: 40; transition: transform 0.25s ease; }
        .sidebar-logo { padding: 24px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .sidebar-wordmark { font-family: var(--font-exo2, 'Exo 2', sans-serif); font-weight: 900; font-size: 18px; letter-spacing: -0.3px; color: var(--off-white); }
        .sidebar-wordmark span { color: var(--orange); }
        .sidebar-badge { font-family: var(--font-mono, 'Space Mono', monospace); font-size: 7px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--orange); background: rgba(219,103,39,0.1); border: 1px solid rgba(219,103,39,0.2); padding: 2px 6px; margin-left: auto; }
        .sidebar-nav { flex: 1; padding: 16px 0; }
        .sidebar-group { margin-bottom: 8px; }
        .sidebar-group-label { font-family: var(--font-mono, 'Space Mono', monospace); font-size: 8px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--grey-dark); padding: 8px 20px 4px; }
        .sidebar-item { display: flex; align-items: center; gap: 10px; padding: 9px 20px; text-decoration: none; font-size: 13px; color: var(--grey-mid); transition: all 0.15s ease; border-left: 2px solid transparent; margin: 1px 0; }
        .sidebar-item:hover { color: var(--white); background: rgba(255,255,255,0.04); }
        .sidebar-item.active { color: var(--white); background: rgba(219,103,39,0.08); border-left-color: var(--orange); }
        .sidebar-icon { font-size: 10px; color: inherit; opacity: 0.6; flex-shrink: 0; }
        .sidebar-item.active .sidebar-icon { opacity: 1; color: var(--orange); }
        .sidebar-footer { padding: 16px 20px; border-top: 1px solid rgba(255,255,255,0.06); }
        .sidebar-footer-link { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--grey-mid); text-decoration: none; padding: 8px 0; transition: color 0.15s ease; }
        .sidebar-footer-link:hover { color: var(--white); }
        .sidebar-footer-link + .sidebar-footer-link { border-top: 1px solid rgba(255,255,255,0.04); }
        @media (max-width: 768px) {
          .sidebar { position: fixed; top: 0; left: 0; bottom: 0; height: 100dvh; transform: translateX(-100%); }
          .sidebar.mobile-open { transform: translateX(0); box-shadow: 4px 0 32px rgba(0,0,0,0.4); }
        }
      `}</style>

      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={closeSidebar} />

      <aside className={`sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
        <Link href="/dashboard" className="sidebar-logo">
          <NTMark size={28} />
          <span className="sidebar-wordmark">Nex<span>T</span>rium</span>
          <span className="sidebar-badge">Admin</span>
        </Link>

        <nav className="sidebar-nav">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="sidebar-group">
              <div className="sidebar-group-label">{group.label}</div>
              {group.items.map((item) => {
                const isActive = item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link key={item.href} href={item.href} className={`sidebar-item ${isActive ? 'active' : ''}`}>
                    <span className="sidebar-icon">{item.icon}</span>
                    {item.label}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link href="/" className="sidebar-footer-link" target="_blank">↗ View site</Link>
          <Link href="/dashboard/settings" className="sidebar-footer-link">⚙ Settings</Link>
        </div>
      </aside>
    </>
  )
}