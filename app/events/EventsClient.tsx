'use client'

import { useState } from 'react'
import Link from 'next/link'
import SectionTag from '@/components/shared/SectionTag'
import type { NTEvent } from './page'

type FilterType = 'all' | 'upcoming' | 'completed' | 'hackathon' | 'workshop' | 'community'

const FILTERS: { value: FilterType; label: string }[] = [
  { value: 'all',       label: 'All'       },
  { value: 'upcoming',  label: 'Upcoming'  },
  { value: 'completed', label: 'Past'      },
  { value: 'hackathon', label: 'Hackathon' },
  { value: 'workshop',  label: 'Workshop'  },
  { value: 'community', label: 'Community' },
]

const TYPE_LABELS: Record<NTEvent['event_type'], string> = {
  hackathon: 'Hackathon',
  workshop:  'Workshop',
  summit:    'Summit',
  community: 'Community',
  other:     'Event',
}

const STATUS_STYLES: Record<NTEvent['status'], { bg: string; color: string; border: string; label: string }> = {
  upcoming:  { bg: 'rgba(10,139,139,0.1)',  color: 'var(--teal)',    border: 'rgba(10,139,139,0.2)',  label: 'Upcoming'  },
  ongoing:   { bg: 'rgba(219,103,39,0.1)',  color: 'var(--orange)', border: 'rgba(219,103,39,0.2)',  label: 'Ongoing'   },
  completed: { bg: 'rgba(34,193,122,0.1)',  color: 'var(--success)',border: 'rgba(34,193,122,0.2)',  label: 'Completed' },
  cancelled: { bg: 'rgba(232,69,69,0.1)',   color: 'var(--error)',  border: 'rgba(232,69,69,0.2)',   label: 'Cancelled' },
}

interface EventsClientProps {
  events: NTEvent[]
}

export default function EventsClient({ events }: EventsClientProps) {
  const [active, setActive] = useState<FilterType>('all')

  const filtered = events.filter((e) => {
    if (active === 'all')       return true
    if (active === 'upcoming')  return e.status === 'upcoming' || e.status === 'ongoing'
    if (active === 'completed') return e.status === 'completed'
    return e.event_type === active
  })

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .events-hero {
          background: var(--navy-deep);
          padding-top: calc(var(--nav-height) + 80px);
          padding-bottom: 80px;
          position: relative; overflow: hidden;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .events-hero-glow {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 50% 60% at 90% 10%, rgba(219,103,39,0.09) 0%, transparent 55%),
            radial-gradient(ellipse 40% 50% at 5% 90%, rgba(212,168,67,0.07) 0%, transparent 50%);
        }
        .events-hero-grid {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.03;
          background-image:
            linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px);
          background-size: 72px 72px;
        }
        .events-hero-inner {
          position: relative; z-index: 1;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: end;
        }
        .events-headline {
          font-family: var(--font-exo2); font-weight: 900;
          font-size: clamp(48px, 8vw, 88px);
          line-height: 0.95; letter-spacing: -2.5px;
          color: var(--white); margin-bottom: 0;
          animation: fadeUp 0.7s ease both; animation-delay: 0.1s;
        }
        .events-headline em { font-style: normal; color: var(--orange); }
        .events-hero-desc {
          font-weight: 300; font-size: clamp(15px, 1.6vw, 18px);
          color: var(--grey-mid); line-height: 1.75;
          animation: fadeUp 0.7s ease both; animation-delay: 0.25s;
          padding-bottom: 8px;
        }
        .events-section { background: var(--navy-deep); padding: 80px 0; }
        .filter-bar {
          display: flex; align-items: center; gap: 2px;
          margin-bottom: 48px; flex-wrap: wrap;
        }
        .filter-btn {
          font-family: var(--font-mono); font-size: 9px;
          letter-spacing: 0.18em; text-transform: uppercase;
          padding: 10px 18px;
          border: 1px solid rgba(255,255,255,0.1);
          background: transparent; color: var(--grey-mid);
          cursor: pointer; transition: all var(--transition-base);
        }
        .filter-btn:hover { color: var(--white); border-color: rgba(255,255,255,0.25); }
        .filter-btn.active { background: var(--orange); color: var(--white); border-color: var(--orange); }
        .events-list { display: flex; flex-direction: column; gap: 1px; background: rgba(255,255,255,0.06); }
        .event-row {
          background: var(--navy);
          display: grid; grid-template-columns: 1fr auto;
          gap: 32px; align-items: start;
          padding: 40px 40px;
          text-decoration: none;
          transition: background var(--transition-base);
          position: relative;
        }
        .event-row::before {
          content: '';
          position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
          background: var(--orange); transform: scaleY(0); transform-origin: bottom;
          transition: transform var(--transition-slow);
        }
        .event-row:hover { background: var(--navy-mid); }
        .event-row:hover::before { transform: scaleY(1); }
        .event-row-meta {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 16px; flex-wrap: wrap;
        }
        .event-type-tag {
          font-family: var(--font-mono); font-size: 8px;
          letter-spacing: 0.15em; text-transform: uppercase;
          padding: 3px 8px; color: var(--orange);
          border: 1px solid rgba(219,103,39,0.3);
        }
        .event-hub-tag {
          font-family: var(--font-mono); font-size: 8px;
          letter-spacing: 0.15em; text-transform: uppercase;
          padding: 3px 8px; color: var(--gold);
          border: 1px solid rgba(212,168,67,0.3);
        }
        .event-row-title {
          font-family: var(--font-exo2); font-weight: 700;
          font-size: clamp(18px, 2.5vw, 26px); color: var(--white);
          letter-spacing: -0.3px; line-height: 1.2; margin-bottom: 12px;
        }
        .event-row-desc { font-size: 14px; color: var(--grey-mid); line-height: 1.7; max-width: 640px; }
        .event-row-right {
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 16px;
          padding-top: 4px; flex-shrink: 0;
        }
        .event-status-badge {
          font-family: var(--font-mono); font-size: 8px;
          letter-spacing: 0.15em; text-transform: uppercase;
          padding: 5px 10px; white-space: nowrap;
        }
        .event-date {
          font-family: var(--font-mono); font-size: 10px;
          letter-spacing: 0.1em; color: var(--grey-mid); text-align: right;
        }
        .event-location {
          font-family: var(--font-mono); font-size: 10px;
          letter-spacing: 0.1em; color: var(--grey-dark); text-align: right;
        }
        .event-arrow {
          font-size: 20px; color: var(--grey-dark);
          transition: color var(--transition-base), transform var(--transition-base);
        }
        .event-row:hover .event-arrow { color: var(--orange); transform: translate(3px, -3px); }
        .events-empty { background: var(--navy); padding: 80px 40px; text-align: center; }
        .events-empty-title {
          font-family: var(--font-exo2); font-weight: 700;
          font-size: 22px; color: var(--white); margin-bottom: 12px;
        }
        .events-empty-sub { font-size: 14px; color: var(--grey-mid); }
        .events-note { border-top: 1px solid rgba(255,255,255,0.06); padding: 40px 0; }
        .events-note-inner {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 16px;
        }
        .events-note-text {
          font-family: var(--font-mono); font-size: 10px;
          letter-spacing: 0.12em; text-transform: uppercase; color: var(--grey-dark);
        }
        .events-note-cta {
          font-family: var(--font-mono); font-size: 10px;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--orange); text-decoration: none;
          transition: color var(--transition-base);
        }
        .events-note-cta:hover { color: var(--orange-w); }
        @media (max-width: 900px) {
          .events-hero-inner { grid-template-columns: 1fr; gap: 32px; }
          .event-row { grid-template-columns: 1fr; gap: 20px; padding: 32px 24px; }
          .event-row-right { align-items: flex-start; flex-direction: row; flex-wrap: wrap; }
        }
        @media (max-width: 600px) {
          .filter-btn { padding: 8px 14px; font-size: 8px; }
        }
      `}</style>

      <section className="events-hero">
        <div className="events-hero-glow" />
        <div className="events-hero-grid" />
        <div className="container">
          <div className="events-hero-inner">
            <div>
              <SectionTag label="Events" />
              <h1 className="events-headline">
                Where the<br />community<br /><em>meets.</em>
              </h1>
            </div>
            <p className="events-hero-desc">
              NexTrium and the Hub host hackathons, workshops, and community sessions. Past events have produced real products. Upcoming events will produce more.
            </p>
          </div>
        </div>
      </section>

      <section className="events-section">
        <div className="container">
          <div className="filter-bar" role="group" aria-label="Filter events">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                className={`filter-btn ${active === f.value ? 'active' : ''}`}
                onClick={() => setActive(f.value)}
                aria-pressed={active === f.value}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="events-empty">
              <div className="events-empty-title">No events in this category yet.</div>
              <div className="events-empty-sub">Check back soon or view all events.</div>
            </div>
          ) : (
            <div className="events-list">
              {filtered.map((event) => {
                const ss = STATUS_STYLES[event.status]
                return (
                  <Link key={event.slug} href={`/events/${event.slug}`} className="event-row">
                    <div>
                      <div className="event-row-meta">
                        <span className="event-type-tag">{TYPE_LABELS[event.event_type]}</span>
                        {event.is_hub_event && <span className="event-hub-tag">Hub event</span>}
                      </div>
                      <div className="event-row-title">{event.title}</div>
                      <div className="event-row-desc">{event.description}</div>
                    </div>
                    <div className="event-row-right">
                      <span className="event-status-badge" style={{ background: ss.bg, color: ss.color, border: `1px solid ${ss.border}` }}>
                        {ss.label}
                      </span>
                      <span className="event-date">{event.start_date}</span>
                      <span className="event-location">{event.location}</span>
                      <span className="event-arrow">↗</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          <div className="events-note">
            <div className="events-note-inner">
              <span className="events-note-text">More events are being planned. Follow NexTrium for updates.</span>
              <Link href="/contact?subject=partnership" className="events-note-cta">Host an event with us →</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
