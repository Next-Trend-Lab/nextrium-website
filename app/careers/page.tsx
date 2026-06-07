import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import SectionTag from '@/components/shared/SectionTag'
import CTABox from '@/components/ui/CTABox'
import Link from 'next/link'
import CareersApplicationForm from './CareersApplicationForm'

export const metadata = {
  title: 'Careers',
  description:
    'Open roles at NexTrium. We are building products, infrastructure, and ventures for emerging markets. Join us.',
}

export interface Role {
  slug: string
  title: string
  team: string
  type: 'full_time' | 'contract' | 'volunteer' | 'internship'
  location: string
  description: string
  requirements: string[]
  closes_at?: string
}

const TYPE_LABELS: Record<Role['type'], string> = {
  full_time:  'Full-time',
  contract:   'Contract',
  volunteer:  'Volunteer',
  internship: 'Internship',
}

export const ALL_ROLES: Role[] = []

const VALUES = [
  {
    title: 'We build things that matter',
    description: 'Every role here connects to a product or a community that needs to exist. No busy work.',
  },
  {
    title: 'Remote and async by default',
    description: 'We are based in Lagos and operate globally. You work where and when you are most effective.',
  },
  {
    title: 'You own your work',
    description: 'We hire people we trust and give them the space to do what they do well. No micromanagement.',
  },
]

export default function CareersPage() {
  const hasRoles = ALL_ROLES.length > 0

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .careers-hero {
          background: var(--navy-deep);
          padding-top: calc(var(--nav-height) + 80px);
          padding-bottom: 80px;
          position: relative; overflow: hidden;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .careers-hero-glow {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 50% 60% at 90% 10%, rgba(219,103,39,0.09) 0%, transparent 55%),
            radial-gradient(ellipse 40% 50% at 5% 90%, rgba(34,193,122,0.06) 0%, transparent 50%);
        }
        .careers-hero-grid {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.03;
          background-image:
            linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px);
          background-size: 72px 72px;
        }
        .careers-hero-inner {
          position: relative; z-index: 1;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: end;
        }
        .careers-headline {
          font-family: var(--font-exo2); font-weight: 900;
          font-size: clamp(48px, 8vw, 88px);
          line-height: 0.95; letter-spacing: -2.5px;
          color: var(--white); margin-bottom: 0;
          animation: fadeUp 0.7s ease both; animation-delay: 0.1s;
        }
        .careers-headline em { font-style: normal; color: var(--orange); }
        .careers-hero-desc {
          font-weight: 300; font-size: clamp(15px, 1.6vw, 18px);
          color: var(--grey-mid); line-height: 1.75;
          animation: fadeUp 0.7s ease both; animation-delay: 0.25s;
          padding-bottom: 8px;
        }
        .values-section { background: var(--off-white); padding: var(--section-py) 0; }
        .values-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: var(--grey-light);
        }
        .value-card {
          background: var(--white); padding: 40px 32px;
          display: flex; flex-direction: column; gap: 14px; position: relative;
        }
        .value-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: var(--orange); transform: scaleX(0); transform-origin: left;
          transition: transform var(--transition-slow);
        }
        .value-card:hover::before { transform: scaleX(1); }
        .value-title {
          font-family: var(--font-exo2); font-weight: 700;
          font-size: 18px; color: var(--navy-deep);
          letter-spacing: -0.2px; line-height: 1.25;
        }
        .value-desc { font-size: 14px; color: var(--grey-dark); line-height: 1.75; }
        .roles-section { background: var(--navy-deep); padding: var(--section-py) 0; }
        .roles-list {
          display: flex; flex-direction: column;
          gap: 1px; background: rgba(255,255,255,0.06);
        }
        .role-row {
          background: var(--navy);
          display: grid; grid-template-columns: 1fr auto;
          gap: 32px; align-items: center;
          padding: 32px 40px; text-decoration: none;
          transition: background var(--transition-base); position: relative;
        }
        .role-row::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
          background: var(--orange); transform: scaleY(0); transform-origin: bottom;
          transition: transform var(--transition-slow);
        }
        .role-row:hover { background: var(--navy-mid); }
        .role-row:hover::before { transform: scaleY(1); }
        .role-title {
          font-family: var(--font-exo2); font-weight: 700;
          font-size: clamp(17px, 2vw, 22px); color: var(--white);
          letter-spacing: -0.2px; margin-bottom: 8px;
        }
        .role-badges { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .role-badge {
          font-family: var(--font-mono); font-size: 7.5px;
          letter-spacing: 0.15em; text-transform: uppercase;
          padding: 3px 8px; border: 1px solid rgba(255,255,255,0.12); color: var(--grey-mid);
        }
        .role-badge-team { color: var(--orange); border-color: rgba(219,103,39,0.3); }
        .role-arrow {
          font-size: 20px; color: var(--grey-dark); flex-shrink: 0;
          transition: color var(--transition-base), transform var(--transition-base);
        }
        .role-row:hover .role-arrow { color: var(--orange); transform: translate(3px, -3px); }
        .roles-empty {
          background: var(--navy); padding: 80px 40px;
          position: relative; overflow: hidden;
        }
        .roles-empty-grid {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.03;
          background-image:
            linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .roles-empty-corner-tl {
          position: absolute; top: -1px; left: -1px; width: 16px; height: 16px;
          border-top: 2px solid var(--orange); border-left: 2px solid var(--orange);
        }
        .roles-empty-corner-br {
          position: absolute; bottom: -1px; right: -1px; width: 16px; height: 16px;
          border-bottom: 2px solid var(--orange); border-right: 2px solid var(--orange);
        }
        .roles-empty-inner { position: relative; z-index: 1; }
        .roles-empty-title {
          font-family: var(--font-exo2); font-weight: 800;
          font-size: clamp(24px, 3vw, 36px); color: var(--white);
          letter-spacing: -0.5px; margin-bottom: 16px; line-height: 1.15;
        }
        .roles-empty-title em { font-style: normal; color: var(--orange); }
        .roles-empty-desc {
          font-size: 15px; color: var(--grey-mid); line-height: 1.75;
          max-width: 480px; margin-bottom: 32px;
        }
        .open-app-section { background: var(--navy); padding: var(--section-py) 0; }
        .open-app-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: start;
        }
        .open-app-title {
          font-family: var(--font-exo2); font-weight: 800;
          font-size: clamp(28px, 3.5vw, 44px); color: var(--white);
          letter-spacing: -1px; line-height: 1.05; margin-bottom: 16px;
        }
        .open-app-title em { font-style: normal; color: var(--orange); }
        .open-app-desc { font-size: 15px; color: var(--grey-mid); line-height: 1.75; }
        .open-app-form { display: flex; flex-direction: column; gap: 16px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-label {
          font-family: var(--font-mono); font-size: 9px;
          letter-spacing: 0.18em; text-transform: uppercase; color: var(--grey-mid);
        }
        .form-input {
          background: var(--navy-mid); border: 1px solid rgba(255,255,255,0.08);
          color: var(--white); font-family: var(--font-dm); font-size: 14px;
          padding: 12px 16px; outline: none;
          transition: border-color var(--transition-base);
        }
        .form-input:focus { border-color: var(--orange); }
        .form-input::placeholder { color: var(--grey-dark); }
        .form-textarea { resize: vertical; min-height: 100px; }
        .form-submit {
          font-family: var(--font-dm); font-size: 14px; font-weight: 400;
          color: var(--white); background: var(--orange);
          border: 1px solid var(--orange); padding: 16px 24px;
          cursor: pointer; transition: background var(--transition-base);
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
        }
        .form-submit:hover { background: var(--orange-f); }
        @media (max-width: 900px) {
          .careers-hero-inner { grid-template-columns: 1fr; gap: 32px; }
          .values-grid         { grid-template-columns: 1fr; }
          .role-row            { grid-template-columns: 1fr; gap: 12px; padding: 24px; }
          .open-app-grid       { grid-template-columns: 1fr; gap: 48px; }
        }
      `}</style>

      <Navbar />

      <section className="careers-hero">
        <div className="careers-hero-glow" />
        <div className="careers-hero-grid" />
        <div className="container">
          <div className="careers-hero-inner">
            <div>
              <SectionTag label="Careers" />
              <h1 className="careers-headline">
                Build what<br />matters.<br /><em>With us.</em>
              </h1>
            </div>
            <p className="careers-hero-desc">
              NexTrium is a small team building products for underserved markets. We move fast, own our work, and care about what we ship. If that sounds like your kind of environment, read on.
            </p>
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="container">
          <div style={{ marginBottom: '48px' }}>
            <SectionTag label="How we work" />
            <h2 className="section-title-dark">What it is like<br />to work here.</h2>
          </div>
          <div className="values-grid">
            {VALUES.map((v) => (
              <div key={v.title} className="value-card">
                <div className="value-title">{v.title}</div>
                <div className="value-desc">{v.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="roles-section">
        <div className="container">
          <div style={{ marginBottom: '48px' }}>
            <SectionTag label="Open roles" />
            <h2 className="section-title">
              {hasRoles ? 'We are hiring.' : 'Nothing open right now.'}
            </h2>
          </div>
          {hasRoles ? (
            <div className="roles-list">
              {ALL_ROLES.map((role) => (
                <Link key={role.slug} href={`/careers/${role.slug}`} className="role-row">
                  <div>
                    <div className="role-title">{role.title}</div>
                    <div className="role-badges">
                      <span className="role-badge role-badge-team">{role.team}</span>
                      <span className="role-badge">{TYPE_LABELS[role.type]}</span>
                      <span className="role-badge">{role.location}</span>
                      {role.closes_at && <span className="role-badge">Closes {role.closes_at}</span>}
                    </div>
                  </div>
                  <span className="role-arrow">↗</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="roles-empty">
              <div className="roles-empty-grid" />
              <div className="roles-empty-corner-tl" />
              <div className="roles-empty-corner-br" />
              <div className="roles-empty-inner">
                <div className="roles-empty-title">
                  No open roles right now.<br />Send your CV <em>anyway.</em>
                </div>
                <p className="roles-empty-desc">
                  We review speculative applications. If your skills align with where we are going, we will be in touch when something opens up.
                </p>
                <CTABox href="#open-application" label="Send an open application" variant="dark" />
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="open-app-section" id="open-application">
        <div className="container">
          <div className="open-app-grid">
            <div>
              <SectionTag label="Open application" />
              <div className="open-app-title">
                Do not see a role?<br /><em>Apply anyway.</em>
              </div>
              <p className="open-app-desc">
                We keep a file of strong candidates. If your background fits something we are building toward, we will reach out. Tell us who you are and what you do best.
              </p>
            </div>
            <CareersApplicationForm />
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
