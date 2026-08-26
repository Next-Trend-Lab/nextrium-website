'use client'

import { useState } from 'react'
import { getTeamActivityLogs, type TeamActivityLog } from './actions'
import { useDashboardSearch } from '@/lib/dashboard/useDashboardSearch'
import DashboardSearchBox from '@/components/dashboard/DashboardSearchBox'

const ACTION_LABELS: Record<string, string> = {
  sign_in: 'Signed in',
  sign_out: 'Signed out',
  application_deleted: 'Deleted application',
  application_screened: 'Screened candidate',
  application_rescanned: 'Rescanned candidate',
  application_status_updated: 'Updated status',
  feedback_emails_dispatched: 'Dispatched feedback emails',
  bulk_screen_started: 'Started bulk screening',
}

const ACTION_COLORS: Record<string, string> = {
  sign_in: 'var(--success)',
  sign_out: 'var(--grey-mid)',
  application_deleted: 'var(--error)',
  application_screened: 'var(--orange)',
  application_rescanned: 'var(--orange)',
  application_status_updated: 'var(--slate)',
  feedback_emails_dispatched: 'var(--orange)',
  bulk_screen_started: 'var(--orange)',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}

function summarizeDetails(log: TeamActivityLog): string {
  const d = log.details ?? {}
  switch (log.action) {
    case 'application_deleted':
      return [d.name, d.email].filter(Boolean).join(' · ') || '—'
    case 'application_screened':
    case 'application_rescanned':
      return `Score ${d.compositeScore ?? '—'}% · ${d.recommendation ?? '—'}`
    case 'application_status_updated':
      return `→ ${d.newStatus ?? '—'}`
    case 'feedback_emails_dispatched':
      return `${d.sentCount ?? 0} sent, ${d.skippedCount ?? 0} skipped, ${d.failedCount ?? 0} failed`
    case 'bulk_screen_started':
      return `${d.applicationCount ?? '—'} candidate(s)`
    default:
      return Object.keys(d).length > 0 ? JSON.stringify(d) : '—'
  }
}

export default function LogsClient({
  initialLogs,
  initialError,
}: {
  initialLogs: TeamActivityLog[]
  initialError: string | null
}) {
  const [activeTab, setActiveTab] = useState<'team' | 'agent'>('team')
  const [logs, setLogs]     = useState(initialLogs)
  const [error, setError]   = useState(initialError)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(initialLogs.length >= 50)

  const { query, setQuery, results } = useDashboardSearch(
    logs,
    (log) => [log.actor_email, ACTION_LABELS[log.action] ?? log.action, log.target_id, log.action]
  )

  async function handleLoadMore() {
    if (logs.length === 0) return
    setLoadingMore(true)
    const oldest = logs[logs.length - 1].created_at
    const res = await getTeamActivityLogs({ limit: 50, before: oldest })
    if (res.error) {
      setError(res.error)
    } else {
      setLogs((prev) => [...prev, ...res.logs])
      setHasMore(res.logs.length >= 50)
    }
    setLoadingMore(false)
  }

  return (
    <>
      <style>{`
        .logs-tabs { display: flex; gap: 0; border-bottom: 1px solid rgba(255,255,255,0.06); margin-bottom: 20px; }
        .logs-tab { padding: 10px 20px; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; border: none; background: none; color: var(--grey-mid); border-bottom: 2px solid transparent; transition: all 0.15s ease; }
        .logs-tab:hover { color: var(--white); }
        .logs-tab.active { color: var(--orange); border-bottom-color: var(--orange); }

        .logs-panel { background: var(--navy); border: 1px solid rgba(255,255,255,0.06); }
        .logs-search-row { padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .logs-table { width: 100%; border-collapse: collapse; }
        .logs-table th { text-align: left; padding: 10px 16px; font-family: var(--font-mono); font-size: 8.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--grey-mid); border-bottom: 1px solid rgba(255,255,255,0.06); white-space: nowrap; }
        .logs-table td { padding: 11px 16px; font-size: 12.5px; color: var(--off-white); border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: top; }
        .logs-table tr:hover td { background: rgba(255,255,255,0.02); }
        .logs-table tr:last-child td { border-bottom: none; }
        .logs-action-badge { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.06em; text-transform: uppercase; white-space: nowrap; }
        .logs-empty { padding: 48px 24px; text-align: center; font-size: 13px; color: var(--grey-mid); }
        .logs-load-more { display: block; width: 100%; padding: 12px; text-align: center; font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; border: none; border-top: 1px solid rgba(255,255,255,0.06); background: none; color: var(--grey-mid); transition: all 0.15s ease; }
        .logs-load-more:hover:not(:disabled) { color: var(--orange); }
        .logs-load-more:disabled { opacity: 0.5; cursor: not-allowed; }
        .logs-error { padding: 14px 16px; font-size: 12.5px; color: var(--error); background: rgba(232,69,69,0.08); border-bottom: 1px solid rgba(232,69,69,0.2); }
        .logs-coming-soon { padding: 64px 32px; text-align: center; }
        .logs-coming-soon-title { font-family: var(--font-exo2); font-weight: 700; font-size: 18px; color: var(--white); margin-bottom: 8px; }
        .logs-coming-soon-desc { font-size: 13px; color: var(--grey-mid); max-width: 480px; margin: 0 auto; line-height: 1.6; }
      `}</style>

      <div className="logs-tabs">
        <button type="button" className={`logs-tab ${activeTab === 'team' ? 'active' : ''}`} onClick={() => setActiveTab('team')}>
          Team Activity
        </button>
        <button type="button" className={`logs-tab ${activeTab === 'agent' ? 'active' : ''}`} onClick={() => setActiveTab('agent')}>
          AI Agent Logs
        </button>
      </div>

      {activeTab === 'team' ? (
        <div className="logs-panel">
          <div className="logs-search-row">
            <DashboardSearchBox
              value={query}
              onChange={setQuery}
              placeholder="Search by actor, action, or target..."
              resultCount={results.length}
            />
          </div>

          {error && <div className="logs-error">Failed to load logs: {error}</div>}

          {results.length === 0 ? (
            <div className="logs-empty">No activity recorded yet.</div>
          ) : (
            <>
              <table className="logs-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Actor</th>
                    <th>Action</th>
                    <th>Target</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((log) => (
                    <tr key={log.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--grey-mid)', whiteSpace: 'nowrap' }}>
                        {formatDate(log.created_at)}
                      </td>
                      <td>{log.actor_email ?? '—'}</td>
                      <td>
                        <span className="logs-action-badge" style={{ color: ACTION_COLORS[log.action] ?? 'var(--grey-mid)' }}>
                          {ACTION_LABELS[log.action] ?? log.action}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--grey-mid)' }}>
                        {log.target_type ? `${log.target_type}${log.target_id ? ` · ${log.target_id.slice(0, 8)}` : ''}` : '—'}
                      </td>
                      <td style={{ fontSize: '12px', color: 'var(--grey-mid)' }}>{summarizeDetails(log)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {hasMore && !query && (
                <button type="button" className="logs-load-more" onClick={handleLoadMore} disabled={loadingMore}>
                  {loadingMore ? 'Loading...' : 'Load more'}
                </button>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="logs-panel">
          <div className="logs-coming-soon">
            <div className="logs-coming-soon-title">AI Agent Logs — coming soon</div>
            <div className="logs-coming-soon-desc">
              Step-by-step processing traces for every screening run (model calls, retries,
              consensus reasoning) will appear here once the Agents Engine's logging
              integration ships. This requires changes to the Agents Engine itself, which
              are proposed separately before implementation.
            </div>
          </div>
        </div>
      )}
    </>
  )
}
