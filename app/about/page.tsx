import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import SectionTag from '@/components/shared/SectionTag'
import CTABox from '@/components/ui/CTABox'

export const metadata = {
  title: 'About',
  description:
    'NexTrium Global Innovations Ltd is an innovation company building products, infrastructure, and ventures for emerging markets and beyond.',
}

const VALUES = [
  {
    num: '01',
    title: 'Build with intention',
    description:
      'Every product we touch solves a real problem for a real person. We do not build for vanity metrics or investor decks. We build because something needs to exist.',
  },
  {
    num: '02',
    title: 'Own the work',
    description:
      'We take full responsibility for what we ship. No blame, no excuses. If something is wrong, we fix it. If something could be better, we make it better.',
  },
  {
    num: '03',
    title: 'Think in systems',
    description:
      'Individual features are not the goal. We design for how things connect, scale, and evolve. A good system outlives the team that built it.',
  },
  {
    num: '04',
    title: 'Africa is not a market, it is a starting point',
    description:
      'We build from Lagos with global ambition. The problems we solve here are real everywhere. We start local because we know this ground.',
  },
]

const AFFILIATIONS = [
  { name: 'Cardano', role: 'On-chain governance participant and community organiser' },
  { name: 'SingularityNET / ASI Alliance', role: 'Protocol Officer, DEEP Funding ecosystem' },
  { name: 'DEEP Projects', role: 'Ideation and community reviewer' },
  { name: 'Intersect MBO', role: 'Member and DRep workshop organiser' },
]

const TEAM = [
  {
    name: 'Abdulbasit Abdulrahman Adigun',
    role: 'Founder and Director',
    bio: 'Full-stack developer, Web3 builder, and community architect. Background in Mathematics Education from the University of Lagos. Building NexTrium from Lagos with a focus on economic inclusion and informal economy infrastructure.',
    social: {
      github: 'https://github.com/devbasrahtop',
      linkedin: '#',
      twitter: '#',
    },
  },
]

export default function AboutPage() {
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .about-hero {
          background: var(--navy-deep);
          padding-top: calc(var(--nav-height) + 80px);
          padding-bottom: 80px;
          position: relative; overflow: hidden;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .about-hero-glow {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 50% 60% at 85% 10%, rgba(219,103,39,0.09) 0%, transparent 55%),
            radial-gradient(ellipse 40% 50% at 5% 90%, rgba(10,139,139,0.07) 0%, transparent 50%);
        }
        .about-hero-grid {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.03;
          background-image:
            linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px);
          background-size: 72px 72px;
        }
        .about-hero-inner {
          position: relative; z-index: 1;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: end;
        }
        .about-headline { font-family: var(--font-exo2); font-weight: 900; font-size: clamp(36px, 5vw, 72px); line-height: 1.0; letter-spacing: -2px; color: var(--white); animation: fadeUp 0.7s ease both; animation-delay: 0.1s; }
        .about-headline em { font-style: normal; color: var(--orange); }
        .about-hero-right {
          animation: fadeUp 0.7s ease both; animation-delay: 0.25s;
          padding-bottom: 8px;
        }
        .about-hero-desc {
          font-weight: 300; font-size: clamp(15px, 1.6vw, 18px);
          color: var(--grey-mid); line-height: 1.75;
        }
        .story-section { background: var(--off-white); padding: var(--section-py) 0; }
        .story-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: start;
        }
        .story-title {
          font-family: var(--font-exo2); font-weight: 800;
          font-size: clamp(28px, 3.5vw, 44px); color: var(--navy-deep);
          letter-spacing: -0.5px; line-height: 1.1; margin-bottom: 32px;
        }
        .story-title em { font-style: normal; color: var(--orange); }
        .story-body { display: flex; flex-direction: column; gap: 20px; }
        .story-p { font-size: 16px; color: var(--grey-dark); line-height: 1.8; }
        .mission-section { background: var(--navy-deep); padding: var(--section-py) 0; }
        .mission-block {
          position: relative; overflow: hidden;
          background: var(--navy);
          border: 1px solid rgba(255,255,255,0.06);
          padding: 64px;
        }
        .mission-grid-bg {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.03;
          background-image:
            linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .mission-corner-tl {
          position: absolute; top: -1px; left: -1px;
          width: 20px; height: 20px;
          border-top: 2px solid var(--orange); border-left: 2px solid var(--orange);
        }
        .mission-corner-br {
          position: absolute; bottom: -1px; right: -1px;
          width: 20px; height: 20px;
          border-bottom: 2px solid var(--orange); border-right: 2px solid var(--orange);
        }
        .mission-tagline {
          font-family: var(--font-mono); font-size: 9px;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--orange); margin-bottom: 24px;
          position: relative; z-index: 1;
        }
        .mission-statement {
          font-family: var(--font-exo2); font-weight: 800;
          font-size: clamp(24px, 3vw, 40px); color: var(--white);
          line-height: 1.2; letter-spacing: -0.5px;
          max-width: 800px; position: relative; z-index: 1;
        }
        .values-section { background: var(--off-white); padding: var(--section-py) 0; }
        .values-list { display: flex; flex-direction: column; gap: 0; }
        .value-row {
          display: grid; grid-template-columns: 80px 1fr;
          gap: 48px; align-items: start;
          padding: 40px 0; border-bottom: 1px solid var(--grey-light);
        }
        .value-row:first-child { border-top: 1px solid var(--grey-light); }
        .value-num {
          font-family: var(--font-mono); font-size: 11px;
          color: var(--orange); letter-spacing: 0.15em; padding-top: 4px;
        }
        .value-title {
          font-family: var(--font-exo2); font-weight: 700;
          font-size: clamp(18px, 2.5vw, 24px); color: var(--navy-deep);
          letter-spacing: -0.3px; margin-bottom: 12px;
        }
        .value-desc { font-size: 15px; color: var(--grey-dark); line-height: 1.75; }
        .details-section { background: var(--navy-deep); padding: var(--section-py) 0; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; }
        .details-title {
          font-family: var(--font-exo2); font-weight: 700;
          font-size: 22px; color: var(--white);
          letter-spacing: -0.3px; margin-bottom: 24px;
        }
        .details-table { display: flex; flex-direction: column; gap: 0; }
        .details-row {
          display: grid; grid-template-columns: 160px 1fr;
          gap: 16px; padding: 14px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .details-row:first-child { border-top: 1px solid rgba(255,255,255,0.06); }
        .details-label {
          font-family: var(--font-mono); font-size: 9px;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--grey-mid); padding-top: 2px;
        }
        .details-value { font-size: 14px; color: var(--off-white); line-height: 1.5; }
        .affiliations-list { display: flex; flex-direction: column; gap: 0; }
        .affiliation-row {
          padding: 16px 0; border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .affiliation-row:first-child { border-top: 1px solid rgba(255,255,255,0.06); }
        .affiliation-name {
          font-family: var(--font-exo2); font-weight: 600;
          font-size: 15px; color: var(--white); margin-bottom: 4px;
        }
        .affiliation-role { font-size: 12px; color: var(--grey-mid); }
        .team-section { background: var(--navy); padding: var(--section-py) 0; }
        .team-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: rgba(255,255,255,0.06);
        }
        .team-card {
          background: var(--navy-mid); padding: 40px 32px;
          display: flex; flex-direction: column; gap: 16px;
          position: relative;
        }
        .team-card::before, .team-card::after {
          content: ''; position: absolute;
          width: 10px; height: 10px;
          border-color: rgba(219,103,39,0.3); border-style: solid;
        }
        .team-card::before { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
        .team-card::after  { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }
        .team-avatar {
          width: 64px; height: 64px; border-radius: 2px;
          background: var(--navy); border: 1px solid rgba(255,255,255,0.08);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-exo2); font-weight: 900;
          font-size: 22px; color: var(--orange);
        }
        .team-name {
          font-family: var(--font-exo2); font-weight: 700;
          font-size: 18px; color: var(--white); letter-spacing: -0.2px;
        }
        .team-role {
          font-family: var(--font-mono); font-size: 9px;
          letter-spacing: 0.15em; text-transform: uppercase; color: var(--orange);
        }
        .team-bio { font-size: 13px; color: var(--grey-mid); line-height: 1.7; flex: 1; }
        .team-social { display: flex; gap: 16px; }
        .team-social a {
          font-family: var(--font-mono); font-size: 8px;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--grey-mid); text-decoration: none;
          transition: color var(--transition-base);
        }
        .team-social a:hover { color: var(--orange); }
        .team-note { border-top: 1px solid rgba(255,255,255,0.06); padding: 40px 0; }
        .team-note-text {
          font-family: var(--font-mono); font-size: 10px;
          letter-spacing: 0.12em; text-transform: uppercase; color: var(--grey-dark);
        }
        .about-cta-section {
          background: var(--navy-deep); padding: 80px 0;
          border-top: 2px solid var(--orange);
        }
        .about-cta-inner {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: center;
        }
        .about-cta-statement {
          font-family: var(--font-exo2); font-weight: 800;
          font-size: clamp(28px, 3.5vw, 44px); color: var(--white);
          letter-spacing: -1px; line-height: 1.05;
        }
        .about-cta-statement em { font-style: normal; color: var(--orange); }
        .about-cta-right { display: flex; flex-direction: column; gap: 12px; }
        .about-cta-right a { max-width: 100% !important; width: 100% !important; }
        @media (max-width: 900px) {
          .about-hero-inner  { grid-template-columns: 1fr; gap: 32px; }
          .story-grid        { grid-template-columns: 1fr; gap: 40px; }
          .details-grid      { grid-template-columns: 1fr; gap: 48px; }
          .team-grid         { grid-template-columns: 1fr; }
          .about-cta-inner   { grid-template-columns: 1fr; gap: 40px; }
          .mission-block     { padding: 40px 32px; }
        }
        @media (max-width: 600px) {
          .value-row   { grid-template-columns: 1fr; gap: 8px; padding: 28px 0; }
          .details-row { grid-template-columns: 1fr; gap: 4px; }
        }
      `}</style>

      <Navbar />

      <section className="about-hero">
        <div className="about-hero-glow" />
        <div className="about-hero-grid" />
        <div className="container">
          <div className="about-hero-inner">
            <div>
              <SectionTag label="About NexTrium" />
              <h1 className="about-headline">
                Built in Lagos.<br /><em>Built for the world.</em>
              </h1>
            </div>
            <div className="about-hero-right">
              <p className="about-hero-desc">
                NexTrium Global Innovations Ltd is an innovation company designing products, infrastructure, and ventures for emerging markets and beyond. We are registered in Nigeria, operating globally, and building things that matter.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="story-section" id="story">
        <div className="container">
          <div className="story-grid">
            <div>
              <SectionTag label="Our story" />
              <h2 className="story-title">
                We started building<br />before we had a<br /><em>name for it.</em>
              </h2>
            </div>
            <div className="story-body">
              <p className="story-p">
                NexTrium grew out of NexTrend Hub, a community of builders, researchers, and practitioners working on technology for African markets. Over time, the community produced real products, real events, and real outcomes. We incorporated to give that work a proper home.
              </p>
              <p className="story-p">
                Today NexTrium operates across product development, venture incubation, research, and strategic partnerships. Our flagship products are in active development. Our community continues to produce work through the Hub.
              </p>
              <p className="story-p">
                We are registered with the Corporate Affairs Commission of Nigeria as NexTrium Global Innovations Ltd, RC: 9506507, incorporated April 2026 in Lagos.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mission-section">
        <div className="container">
          <div className="mission-block">
            <div className="mission-grid-bg" />
            <div className="mission-corner-tl" />
            <div className="mission-corner-br" />
            <div className="mission-tagline">Mission</div>
            <div className="mission-statement">
              Building, scaling, and supporting digital products, startups, and talent across software development, design, data, artificial intelligence, and emerging technologies. Delivering sustainable, future-ready solutions for local and global markets.
            </div>
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="container">
          <div style={{ marginBottom: '48px' }}>
            <SectionTag label="What we stand for" />
            <h2 className="section-title-dark">How we think.<br />How we work.</h2>
          </div>
          <div className="values-list">
            {VALUES.map((value) => (
              <div key={value.num} className="value-row">
                <span className="value-num">{value.num}</span>
                <div>
                  <div className="value-title">{value.title}</div>
                  <div className="value-desc">{value.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="details-section">
        <div className="container">
          <div style={{ marginBottom: '56px' }}>
            <SectionTag label="The company" />
            <h2 className="section-title">Facts and figures.</h2>
          </div>
          <div className="details-grid">
            <div>
              <div className="details-title">Company details</div>
              <div className="details-table">
                {[
                  ['Registered name', 'NexTrium Global Innovations Ltd'],
                  ['RC number', '9506507'],
                  ['Incorporated', '27 April 2026'],
                  ['Type', 'Private Company Limited by Shares'],
                  ['Regulator', 'Corporate Affairs Commission, Nigeria'],
                  ['Address', '69 Abeokuta Street, Ilaje Bariga, Lagos 100223'],
                  ['Email', 'abdulbasit@nextrium.org'],
                  ['Website', 'nextrium.org'],
                ].map(([label, value]) => (
                  <div key={label} className="details-row">
                    <span className="details-label">{label}</span>
                    <span className="details-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="details-title">Affiliations</div>
              <div className="affiliations-list">
                {AFFILIATIONS.map((a) => (
                  <div key={a.name} className="affiliation-row">
                    <div className="affiliation-name">{a.name}</div>
                    <div className="affiliation-role">{a.role}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="team-section" id="team">
        <div className="container">
          <div style={{ marginBottom: '48px' }}>
            <SectionTag label="The team" />
            <h2 className="section-title">The people<br />behind the work.</h2>
          </div>
          <div className="team-grid">
            {TEAM.map((member) => (
              <div key={member.name} className="team-card">
                <div className="team-avatar">{member.name.charAt(0)}</div>
                <div className="team-name">{member.name}</div>
                <div className="team-role">{member.role}</div>
                <div className="team-bio">{member.bio}</div>
                <div className="team-social">
                  {member.social.github && (
                    <a href={member.social.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
                  )}
                  {member.social.linkedin && member.social.linkedin !== '#' && (
                    <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
                  )}
                  {member.social.twitter && member.social.twitter !== '#' && (
                    <a href={member.social.twitter} target="_blank" rel="noopener noreferrer">Twitter ↗</a>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="team-note">
            <span className="team-note-text">
              The team grows as NexTrium grows. More members coming.
            </span>
          </div>
        </div>
      </section>

      <section className="about-cta-section">
        <div className="container">
          <div className="about-cta-inner">
            <div className="about-cta-statement">
              Ready to build<br />something <em>real?</em>
            </div>
            <div className="about-cta-right">
              <CTABox href="/contact?subject=services" label="Tell us what you're building" variant="dark" />
              <CTABox href="/products" label="See our builds" variant="dark" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
