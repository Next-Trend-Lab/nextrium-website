'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Application } from '@/lib/types/database'
import { deleteApplication } from './actions'

interface ApplicationsClientProps {
  applications: Application[]
}

const STATUS_OPTIONS: Application['status'][] = ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted']

const STATUS_STYLES: Record<Application['status'], { bg: string; color: string }> = {
  pending:     { bg: 'rgba(219,103,39,0.1)',  color: 'var(--orange)'  },
  reviewed:    { bg: 'rgba(74,111,165,0.1)',  color: 'var(--slate)'   },
  shortlisted: { bg: 'rgba(212,168,67,0.1)',  color: 'var(--gold)'    },
  rejected:    { bg: 'rgba(232,69,69,0.1)',   color: 'var(--error)'   },
  accepted:    { bg: 'rgba(34,193,122,0.1)',  color: 'var(--success)' },
}

export default function ApplicationsClient({ applications: initial }: ApplicationsClientProps) {
  const [applications, setApplications] = useState(initial)
  const [selected,     setSelected]     = useState<Application | null>(null)
  const [updating,     setUpdating]     = useState(false)
  const [deleting,     setDeleting]     = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  async function updateStatus(id: string, status: Application['status']) {
    setUpdating(true)
    const supabase = createClient()
    const { error } = await (supabase.from('applications') as any)
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (!error) {
      setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status } : a))
      if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : null)
    }
    setUpdating(false)
  }

  async function handleDelete(id: string) {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    setDeleting(true)
    const { error } = await deleteApplication(id)
    if (!error) {
      setApplications((prev) => prev.filter((a) => a.id !== id))
      setSelected(null)
      setConfirmDelete(false)
    }
    setDeleting(false)
  }

  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = applications.filter((a) => a.status === s).length
    return acc
  }, {} as Record<Application['status'], number>)

  return (
    <>
      <style>{`
        .apps-layout { display: grid; grid-template-columns: 1fr 360px; gap: 24px; align-items: start; }
        .apps-panel { background: var(--navy); border: 1px solid rgba(255,255,255,0.06); }
        .apps-count-row { display: flex; gap: 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .apps-count-item { flex: 1; padding: 12px 8px; text-align: center; border-right: 1px solid rgba(255,255,255,0.04); }
        .apps-count-item:last-child { border-right: none; }
        .apps-count-num { font-family: var(--font-exo2); font-weight: 800; font-size: 20px; color: var(--white); line-height: 1; }
        .apps-count-label { font-family: var(--font-mono); font-size: 7px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--grey-dark); margin-top: 4px; }
        .app-row { padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.04); cursor: pointer; transition: background 0.15s ease; }
        .app-row:last-child { border-bottom: none; }
        .app-row:hover { background: rgba(255,255,255,0.03); }
        .app-row.selected { background: rgba(219,103,39,0.06); border-left: 2px solid var(--orange); }
        .app-row-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 4px; }
        .app-name { font-size: 14px; color: var(--white); font-weight: 500; }
        .app-role { font-size: 11px; color: var(--grey-mid); margin-bottom: 4px; }
        .app-date { font-size: 10px; color: var(--grey-dark); font-family: var(--font-mono); }
        .dash-badge { font-family: var(--font-mono); font-size: 7.5px; letter-spacing: 0.12em; text-transform: uppercase; padding: 3px 8px; display: inline-block; white-space: nowrap; }
        .detail-panel { background: var(--navy); border: 1px solid rgba(255,255,255,0.06); position: sticky; top: 24px; }
        .detail-header { padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .detail-name { font-family: var(--font-exo2); font-weight: 700; font-size: 18px; color: var(--white); letter-spacing: -0.3px; margin-bottom: 4px; }
        .detail-email { font-size: 13px; color: var(--orange); }
        .detail-body { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
        .detail-section-title { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--grey-mid); margin-bottom: 8px; }
        .detail-text { font-size: 13px; color: var(--off-white); line-height: 1.7; }
        .detail-status-row { display: flex; flex-direction: column; gap: 6px; }
        .status-select-btn { padding: 9px 14px; font-family: var(--font-mono); font-size: 8px; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); background: none; color: var(--grey-mid); transition: all 0.15s ease; text-align: left; display: flex; align-items: center; justify-content: space-between; }
        .status-select-btn:hover { color: var(--white); border-color: rgba(255,255,255,0.2); }
        .status-select-btn.active { border-color: var(--orange); color: var(--white); background: rgba(219,103,39,0.08); }
        .status-select-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .detail-empty { padding: 48px 24px; text-align: center; font-size: 13px; color: var(--grey-dark); }
        .apps-empty-state { padding: 64px 32px; text-align: center; background: var(--navy); border: 1px solid rgba(255,255,255,0.06); }
        .apps-empty-title { font-family: var(--font-exo2); font-weight: 700; font-size: 20px; color: var(--white); margin-bottom: 8px; }
        .apps-empty-desc { font-size: 14px; color: var(--grey-mid); }
        @media (max-width: 1100px) { .apps-layout { grid-template-columns: 1fr; } .detail-panel { position: static; } }
      `}</style>

      {applications.length === 0 ? (
        <div className="apps-empty-state">
          <div className="apps-empty-title">No applications yet.</div>
          <div className="apps-empty-desc">Applications submitted through the careers page will appear here.</div>
        </div>
      ) : (
        <div className="apps-layout">
          <div className="apps-panel">
            <div className="apps-count-row">
              {STATUS_OPTIONS.map((s) => {
                const ss = STATUS_STYLES[s]
                return (
                  <div key={s} className="apps-count-item">
                    <div className="apps-count-num" style={{ color: ss.color }}>{counts[s]}</div>
                    <div className="apps-count-label">{s}</div>
                  </div>
                )
              })}
            </div>
            {applications.map((app) => {
              const ss = STATUS_STYLES[app.status]
              return (
                <div
                  key={app.id}
                  className={`app-row ${selected?.id === app.id ? 'selected' : ''}`}
                  onClick={() => { setSelected(app); setConfirmDelete(false) }}
                >
                  <div className="app-row-top">
                    <span className="app-name">{app.name}</span>
                    <span className="dash-badge" style={{ background: ss.bg, color: ss.color, border: `1px solid ${ss.color}33` }}>
                      {app.status}
                    </span>
                  </div>
                  <div className="app-role">{app.role_title ?? 'Open application'}</div>
                  <div className="app-date">{new Date(app.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </div>
              )
            })}
          </div>

          <div className="detail-panel">
            {selected ? (
              <>
                <div className="detail-header">
                  <div className="detail-name">{selected.name}</div>
                  <div className="detail-email">{selected.email}</div>
                </div>
                <div className="detail-body">
                  <div>
                    <div className="detail-section-title">Applied for</div>
                    <div className="detail-text">{selected.role_title ?? 'Open application'}</div>
                  </div>

                  {((selected as any).phone || (selected as any).location) && (
                    <div>
                      <div className="detail-section-title">Contact</div>
                      {(selected as any).phone && <div className="detail-text">{(selected as any).phone}</div>}
                      {(selected as any).location && <div className="detail-text" style={{ color: 'var(--grey-mid)', fontSize: '12px' }}>{(selected as any).location}</div>}
                    </div>
                  )}

                  {((selected as any).linkedin_url || (selected as any).portfolio_url || (selected as any).github_url || (selected as any).design_url || (selected as any).published_work_url) && (
                    <div>
                      <div className="detail-section-title">Links</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {(selected as any).linkedin_url && (
                          <a href={(selected as any).linkedin_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: 'var(--orange)' }}>LinkedIn ↗</a>
                        )}
                        {(selected as any).portfolio_url && (
                          <a href={(selected as any).portfolio_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: 'var(--orange)' }}>Portfolio ↗</a>
                        )}
                        {(selected as any).github_url && (
                          <a href={(selected as any).github_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: 'var(--orange)' }}>GitHub ↗</a>
                        )}
                        {(selected as any).design_url && (
                          <a href={(selected as any).design_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: 'var(--orange)' }}>Design portfolio ↗</a>
                        )}
                        {(selected as any).published_work_url && (
                          <a href={(selected as any).published_work_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: 'var(--orange)' }}>Published work ↗</a>
                        )}
                      </div>
                    </div>
                  )}

                  {(selected as any).project_links && Array.isArray((selected as any).project_links) && (selected as any).project_links.length > 0 && (
                    <div>
                      <div className="detail-section-title">Project links</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {((selected as any).project_links as { url: string; description: string }[]).map((link, i) => (
                          <div key={i} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: 'var(--orange)', display: 'block', marginBottom: '4px' }}>{link.url} ↗</a>
                            {link.description && <div style={{ fontSize: '12px', color: 'var(--grey-mid)' }}>{link.description}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(selected as any).currently_building && (
                    <div>
                      <div className="detail-section-title">Currently building</div>
                      <div className="detail-text">{(selected as any).currently_building}</div>
                    </div>
                  )}

                  {selected.cover_note && (
                    <div>
                      <div className="detail-section-title">Cover note</div>
                      <div className="detail-text">{selected.cover_note}</div>
                    </div>
                  )}

                  {selected.cv_url && (
                    <div>
                      <div className="detail-section-title">CV / Resume</div>
                      <a
                        href={`/api/cv-download?path=${encodeURIComponent(selected.cv_url)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '13px', color: 'var(--orange)', textDecoration: 'underline' }}
                      >
                        Download CV ↗
                      </a>
                    </div>
                  )}

                  <div>
                    <div className="detail-section-title">Update status</div>
                    <div className="detail-status-row">
                      {STATUS_OPTIONS.map((s) => {
                        const ss = STATUS_STYLES[s]
                        return (
                          <button key={s} type="button"
                            className={`status-select-btn ${selected.status === s ? 'active' : ''}`}
                            onClick={() => updateStatus(selected.id, s)}
                            disabled={updating || selected.status === s}
                          >
                            <span>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
                            {selected.status === s && <span style={{ color: ss.color }}>✓</span>}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--grey-dark)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                    Received {new Date(selected.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>

                  <div style={{ borderTop: '1px solid rgba(232,69,69,0.15)', paddingTop: '16px' }}>
                    {!confirmDelete ? (
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(true)}
                        style={{ width: '100%', padding: '9px 14px', fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', border: '1px solid rgba(232,69,69,0.3)', background: 'none', color: 'var(--error)', transition: 'all 0.15s ease', textAlign: 'left' }}
                      >
                        Delete application
                      </button>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--error)', lineHeight: '1.5' }}>
                          This cannot be undone. The applicant will not be notified.
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => setConfirmDelete(false)}
                            disabled={deleting}
                            style={{ flex: 1, padding: '9px 14px', fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.15)', background: 'none', color: 'var(--grey-mid)', transition: 'all 0.15s ease' }}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(selected.id)}
                            disabled={deleting}
                            style={{ flex: 1, padding: '9px 14px', fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', border: '1px solid var(--error)', background: 'rgba(232,69,69,0.1)', color: 'var(--error)', transition: 'all 0.15s ease' }}
                          >
                            {deleting ? 'Deleting...' : 'Confirm delete'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="detail-empty">Select an application to view details.</div>
            )}
          </div>
        </div>
      )}
    </>
  )
}