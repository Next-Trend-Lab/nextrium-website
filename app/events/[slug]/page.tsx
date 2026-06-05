import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import SectionTag from '@/components/shared/SectionTag'
import CTABox from '@/components/ui/CTABox'
import { ALL_EVENTS } from '../page'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const event = ALL_EVENTS.find((e) => e.slug === slug)
  if (!event) return { title: 'Event not found' }
  return { title: event.title, description: event.description }
}

export async function generateStaticParams() {
  return ALL_EVENTS.map((e) => ({ slug: e.slug }))
}

const TYPE_LABELS: Record<string, string> = {
  hackathon: 'Hackathon', workshop: 'Workshop',
  summit: 'Summit', community: 'Community', other: 'Event',
}

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string; label: string }> = {
  upcoming:  { bg: 'rgba(10,139,139,0.1)',  color: 'var(--teal)',    border: 'rgba(10,139,139,0.2)',  label: 'Upcoming'  },
  ongoing:   { bg: 'rgba(219,103,39,0.1)',  color: 'var(--orange)', border: 'rgba(219,103,39,0.2)',  label: 'Ongoing'   },
  completed: { bg: 'rgba(34,193,122,0.1)',  color: 'var(--success)',border: 'rgba(34,193,122,0.2)',  label: 'Completed' },
  cancelled: { bg: 'rgba(232,69,69,0.1)',   color: 'var(--error)',  border: 'rgba(232,69,69,0.2)',   label: 'Cancelled' },
}

const HUB_PROJECTS: Record<string, { name: string; team: string; description: string; tags: string[] }[]> = {
  'cats-hackathon-2026': [
    {
      name: 'AgriDatum',
      team: 'Team AgriDatum',
      description: 'A data-driven agricultural intelligence platform helping smallholder farmers access market pricing, weather insights, and supply chain connectivity.',
      tags: ['Agriculture', 'Data', 'Cardano'],
    },
    {
      name: 'TechKR',
      team: 'Team TechKR',
      description: 'A knowledge-sharing and reputation platform for technical contributors in the African developer community.',
      tags: ['Community', 'Reputation', 'EdTech'],
    },
    {
      name: 'Medisure',
      team: 'Team Medisure',
      description: 'A decentralised health identity and insurance access platform targeting Nigeria\'s uninsured informal economy workers.',
      tags: ['Health', 'Identity', 'DeFi'],
    },
  ],
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params
  const event = ALL_EVENTS.find((e) => e.slug === slug)
  if (!event) notFound()

  const ss = STATUS_STYLES[event.status]
  const projects = HUB_PROJECTS[slug] ?? []

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .event-hero {
          background: var(--navy-deep);
          padding-top: calc(var(--nav-height) + 80px);
          padding-bottom: 80px;
          position: relative; overflow: hidden;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .event-hero-glow {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 50% 60% at 90% 10%, rgba(219,103,39,0.09) 0%, transparent 55%),
            radial-gradient(ellipse 40% 50% at 5% 90%, rgba(74,111,165,0.07) 0%, transparent 50%);
        }
        .event-hero-grid {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.03;
          background-image:
            linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px);
          background-size: 72px 72px;
        }
        .event-hero-inner {
          position: relative; z-index: 1;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: end;
        }
        .event-hero-meta {
          display: flex; align-items: center; gap: 10px;
          flex-wrap: wrap; margin-bottom: 20px;
          animation: fadeUp 0.6s ease both;
        }
        .event-type-badge {
          font-family: var(--font-mono); font-size: 8px;
          letter-spacing: 0.15em; text-transform: uppercase;
          padding: 4px 10px; color: var(--orange);
          border: 1px solid rgba(219,103,39,0.3);
        }
        .event-hub-badge {
          font-family: var(--font-mono); font-size: 8px;
          letter-spacing: 0.15em; text-transform: uppercase;
          padding: 4px 10px; color: var(--gold);
          border: 1px solid rgba(212,168,67,0.3);
        }
        .event-title {
          font-family: var(--font-exo2); font-weight: 900;
          font-size: clamp(36px, 6vw, 72px);
          line-height: 0.97; letter-spacing: -2px;
          color: var(--white);
          animation: fadeUp 0.7s ease both; animation-delay: 0.1s;
        }
        .event-hero-right {
          animation: fadeUp 0.7s ease both; animation-delay: 0.25s;
          padding-bottom: 8px;
        }
        .event-details-grid { display: flex; flex-direction: column; gap: 0; margin-bottom: 32px; }
        .event-detail-row {
          display: grid; grid-template-columns: 120px 1fr;
          gap: 16px; padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .event-detail-row:first-child { border-top: 1px solid rgba(255,255,255,0.06); }
        .event-detail-label {
          font-family: var(--font-mono); font-size: 9px;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--grey-mid); padding-top: 2px;
        }
        .event-detail-value { font-size: 14px; color: var(--off-white); line-height: 1.5; }
        .event-body-section { background: var(--off-white); padding: var(--section-py) 0; }
        .event-body-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: start;
        }
        .event-body-title {
          font-family: var(--font-exo2); font-weight: 800;
          font-size: clamp(28px, 3.5vw, 44px); color: var(--navy-deep);
          letter-spacing: -0.5px; line-height: 1.1; margin-bottom: 24px;
        }
        .event-body-text { font-size: 16px; color: var(--grey-dark); line-height: 1.8; }
        .projects-section { background: var(--navy-deep); padding: var(--section-py) 0; }
        .projects-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: rgba(255,255,255,0.06);
        }
        .project-card {
          background: var(--navy); padding: 32px;
          display: flex; flex-direction: column; gap: 16px; position: relative;
        }
        .project-card::before, .project-card::after {
          content: ''; position: absolute; width: 10px; height: 10px;
          border-color: rgba(219,103,39,0.25); border-style: solid;
        }
        .project-card::before { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
        .project-card::after  { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }
        .project-team {
          font-family: var(--font-mono); font-size: 8.5px;
          letter-spacing: 0.15em; text-transform: uppercase; color: var(--orange);
        }
        .project-name {
          font-family: var(--font-exo2); font-weight: 700;
          font-size: 20px; color: var(--white); letter-spacing: -0.3px;
        }
        .project-desc { font-size: 13px; color: var(--grey-mid); line-height: 1.7; flex: 1; }
        .project-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .project-tag {
          font-family: var(--font-mono); font-size: 7.5px;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 3px 8px; border: 1px solid rgba(255,255,255,0.08); color: var(--grey-mid);
        }
        .back-link {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--font-mono); font-size: 9px;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--grey-mid); text-decoration: none;
          transition: color var(--transition-base); margin-bottom: 40px;
        }
        .back-link:hover { color: var(--orange); }
        .event-cta-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: center;
        }
        .event-cta-statement {
          font-family: var(--font-exo2); font-weight: 800;
          font-size: clamp(28px, 3.5vw, 44px); color: var(--white);
          letter-spacing: -1px; line-height: 1.05;
        }
        .event-cta-statement em { font-style: normal; color: var(--orange); }
        .event-cta-right { display: flex; flex-direction: column; gap: 12px; }
        .event-cta-right a { max-width: 100% !important; width: 100% !important; }
        @media (max-width: 900px) {
          .event-hero-inner  { grid-template-columns: 1fr; gap: 40px; }
          .event-body-grid   { grid-template-columns: 1fr; gap: 32px; }
          .projects-grid     { grid-template-columns: 1fr; }
          .event-cta-grid    { grid-template-columns: 1fr; gap: 40px; }
        }
        @media (max-width: 600px) {
          .event-detail-row { grid-template-columns: 1fr; gap: 2px; }
        }
      `}</style>

      <Navbar />

      <section className="event-hero">
        <div className="event-hero-glow" />
        <div className="event-hero-grid" />
        <div className="container">
          <Link href="/events" className="back-link">← Back to events</Link>
          <div className="event-hero-inner">
            <div>
              <div className="event-hero-meta">
                <span className="event-type-badge">{TYPE_LABELS[event.event_type]}</span>
                {event.is_hub_event && <span className="event-hub-badge">Hub event</span>}
                <span className="event-type-badge" style={{ background: ss.bg, color: ss.color, border: `1px solid ${ss.border}` }}>
                  {ss.label}
                </span>
              </div>
              <h1 className="event-title">{event.title}</h1>
            </div>
            <div className="event-hero-right">
              <div className="event-details-grid">
                {[
                  ['Date', `${event.start_date}${event.end_date && event.end_date !== event.start_date ? ` to ${event.end_date}` : ''}`],
                  ['Location', event.location],
                  ['Type', TYPE_LABELS[event.event_type]],
                  ['Organised by', event.is_hub_event ? 'NexTrium Hub' : 'NexTrium'],
                ].map(([label, value]) => (
                  <div key={label} className="event-detail-row">
                    <span className="event-detail-label">{label}</span>
                    <span className="event-detail-value">{value}</span>
                  </div>
                ))}
              </div>
              {event.status === 'upcoming' && (
                <CTABox href="#register" label="Register now" variant="dark" />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="event-body-section">
        <div className="container">
          <div className="event-body-grid">
            <div>
              <SectionTag label="About this event" />
              <h2 className="event-body-title">What happened<br />and why it matters.</h2>
            </div>
            <p className="event-body-text">{event.description}</p>
          </div>
        </div>
      </section>

      {projects.length > 0 && (
        <section className="projects-section">
          <div className="container">
            <div style={{ marginBottom: '48px' }}>
              <SectionTag label="Community projects" />
              <h2 className="section-title">What the teams<br />shipped.</h2>
            </div>
            <div className="projects-grid">
              {projects.map((project) => (
                <div key={project.name} className="project-card">
                  <div className="project-team">{project.team}</div>
                  <div className="project-name">{project.name}</div>
                  <div className="project-desc">{project.description}</div>
                  <div className="project-tags">
                    {project.tags.map((tag) => (
                      <span key={tag} className="project-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section style={{ background: 'var(--navy-deep)', padding: '80px 0', borderTop: '2px solid var(--orange)' }}>
        <div className="container">
          <div className="event-cta-grid">
            <div className="event-cta-statement">
              Want to be part of<br />the <em>next one?</em>
            </div>
            <div className="event-cta-right">
              <CTABox href="/contact?subject=partnership" label="Host an event with us" variant="dark" />
              <CTABox href="/hub" label="Explore the Hub" variant="dark" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
