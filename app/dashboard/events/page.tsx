import { createServiceClient } from '@/lib/supabase/server'
import Header from '@/components/dashboard/Header'
import Link from 'next/link'
import type { NTEvent } from '@/lib/types/database'

export const metadata = { title: 'Events' }

const TYPE_LABELS: Record<NTEvent['event_type'], string> = {
  hackathon: 'Hackathon',
  workshop:  'Workshop',
  summit:    'Summit',
  community: 'Community',
  other:     'Other',
}

const STATUS_STYLES: Record<NTEvent['status'], { bg: string; color: string }> = {
  upcoming:  { bg: 'rgba(74,111,165,0.1)',  color: 'var(--slate)'   },
  ongoing:   { bg: 'rgba(212,168,67,0.1)',  color: 'var(--gold)'    },
  completed: { bg: 'rgba(34,193,122,0.1)',  color: 'var(--success)' },
  cancelled: { bg: 'rgba(232,69,69,0.1)',   color: 'var(--error)'   },
}

async function getEvents(): Promise<NTEvent[]> {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('events')
    .select('*')
    .order('start_date', { ascending: false })
  return data ?? []
}

export default async function EventsPage() {
  const events = await getEvents()

  return (
    <>
      <style>{`
        .dash-list-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .dash-list-count { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--grey-mid); }
        .dash-new-btn { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; padding: 10px 20px; background: var(--orange); color: var(--white); border: none; text-decoration: none; cursor: pointer; transition: background 0.15s ease; display: inline-flex; align-items: center; gap: 8px; }
        .dash-new-btn:hover { background: var(--orange-f, #C4521A); }
        .dash-table { width: 100%; border-collapse: collapse; }
        .dash-table th { font-family: var(--font-mono); font-size: 8px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--grey-mid); padding: 10px 16px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.06); background: var(--navy); white-space: nowrap; }
        .dash-table td { padding: 14px 16px; font-size: 13px; color: var(--off-white); border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle; }
        .dash-table tr:hover td { background: rgba(255,255,255,0.02); }
        .dash-table tr:last-child td { border-bottom: none; }
        .dash-table-wrap { background: var(--navy); border: 1px solid rgba(255,255,255,0.06); }
        .dash-badge { font-family: var(--font-mono); font-size: 7.5px; letter-spacing: 0.12em; text-transform: uppercase; padding: 3px 8px; display: inline-block; white-space: nowrap; }
        .badge-hub { background: rgba(219,103,39,0.1); color: var(--orange); border: 1px solid rgba(219,103,39,0.2); }
        .dash-edit-link { font-family: var(--font-mono); font-size: 8px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--grey-mid); text-decoration: none; padding: 5px 10px; border: 1px solid rgba(255,255,255,0.08); transition: all 0.15s ease; display: inline-block; }
        .dash-edit-link:hover { color: var(--white); border-color: rgba(255,255,255,0.2); }
        .dash-empty-state { padding: 64px 32px; text-align: center; background: var(--navy); border: 1px solid rgba(255,255,255,0.06); }
        .dash-empty-title { font-family: var(--font-exo2); font-weight: 700; font-size: 20px; color: var(--white); margin-bottom: 8px; }
        .dash-empty-desc { font-size: 14px; color: var(--grey-mid); margin-bottom: 24px; }
      `}</style>

      <Header
        title="Events"
        description="Manage Hub events and community programmes"
        action={<Link href="/dashboard/events/new" className="dash-new-btn">+ New event</Link>}
      />

      <div className="dash-content">
        {events.length === 0 ? (
          <div className="dash-empty-state">
            <div className="dash-empty-title">No events yet.</div>
            <div className="dash-empty-desc">Create your first event to get started.</div>
            <Link href="/dashboard/events/new" className="dash-new-btn">+ New event</Link>
          </div>
        ) : (
          <>
            <div className="dash-list-header">
              <span className="dash-list-count">{events.length} event{events.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Hub</th>
                    <th>Updated</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => {
                    const ss = STATUS_STYLES[event.status]
                    return (
                      <tr key={event.slug}>
                        <td>
                          <div style={{ fontWeight: 500, color: 'var(--white)' }}>{event.title}</div>
                        </td>
                        <td style={{ fontSize: '11px', color: 'var(--grey-mid)' }}>{TYPE_LABELS[event.event_type]}</td>
                        <td>
                          <span className="dash-badge" style={{ background: ss.bg, color: ss.color, border: `1px solid ${ss.color}33` }}>
                            {event.status}
                          </span>
                        </td>
                        <td style={{ fontSize: '11px', color: 'var(--grey-mid)', whiteSpace: 'nowrap' }}>
                          {new Date(event.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td style={{ fontSize: '11px', color: 'var(--grey-mid)' }}>{event.location}</td>
                        <td>
                          {event.is_hub_event && <span className="dash-badge badge-hub">Hub</span>}
                        </td>
                        <td style={{ fontSize: '11px', color: 'var(--grey-mid)', whiteSpace: 'nowrap' }}>
                          {new Date(event.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td>
                          <Link href={`/dashboard/events/${event.slug}`} className="dash-edit-link">Edit →</Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  )
}