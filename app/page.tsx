import Link from 'next/link'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import NTMark from '@/components/shared/NTMark'
import CTABox from '@/components/ui/CTABox'
import SectionTag from '@/components/shared/SectionTag'

// ── Types ────────────────────────────────────────────────────
interface Product {
  slug: string
  name: string
  tagline: string
  status: 'in_development' | 'beta' | 'live' | 'sunset'
  category: string[]
  bodyColor: string
}

interface Service {
  num: string
  name: string
  description: string
}

interface Post {
  slug: string
  title: string
  excerpt: string
  post_type: string
  published_at: string
  author: string
}

// ── Static data (replaced by Supabase queries in Phase 2) ────
const PRODUCTS: Product[] = [
  {
    slug: 'zivana',
    name: 'Zivana Protocol',
    tagline: "An open Layer 2 trust infrastructure protocol for Africa's informal economy, built on Cardano and Midnight.",
    status: 'in_development',
    category: ['Web3', 'Cardano', 'Trust'],
    bodyColor: '#0A8B8B',
  },
  {
    slug: 'sovela',
    name: 'Sovela',
    tagline: "A community credit and market intelligence application built on Zivana Protocol, targeting Nigeria's MSME financing gap.",
    status: 'in_development',
    category: ['Fintech', 'MSME', 'Nigeria'],
    bodyColor: '#4A6FA5',
  },
  {
    slug: 'accordiax',
    name: 'Accordiax',
    tagline: 'A trust-based platform connecting Nigerian students and educational consultants through structured, verifiable agreements.',
    status: 'in_development',
    category: ['EdTech', 'Trust', 'Nigeria'],
    bodyColor: '#D4A843',
  },
]

const SERVICES: Service[] = [
  { num: '01', name: 'Product Development',        description: 'Web, mobile, and enterprise applications built from idea to deployment.' },
  { num: '02', name: 'Research and Advisory',      description: 'Technology research, feasibility studies, and strategic consulting.' },
  { num: '03', name: 'Venture Building',            description: 'From idea to MVP. We build your startup as a service.' },
  { num: '04', name: 'Digital Talent Development', description: 'Training, mentorship, and capacity building for individuals and teams.' },
  { num: '05', name: 'AI and Data',                description: 'Data analytics, AI integration, and emerging technology consulting.' },
  { num: '06', name: 'Strategic Partnerships',     description: 'Connecting organisations to the right ecosystem, tools, and capital.' },
]

const POSTS: Post[] = [
  {
    slug: 'zivana-protocol-update',
    title: "Zivana Protocol: Trust Infrastructure for Africa's Informal Economy",
    excerpt: 'How we are building an open Layer 2 protocol that makes invisible capability visible to capital providers and institutions.',
    post_type: 'Product Update',
    published_at: 'Jun 2026',
    author: 'Abdulbasit Abdulrahman',
  },
  {
    slug: 'nextrium-incorporated',
    title: 'NexTrium is Now an Officially Registered Company in Nigeria',
    excerpt: 'We received our CAC registration certificate. RC: 9506507. Here is what it means and what comes next for the company.',
    post_type: 'Announcement',
    published_at: 'Apr 2026',
    author: 'Abdulbasit Abdulrahman',
  },
  {
    slug: 'cats-hackathon-recap',
    title: 'CATS Hackathon: What the Teams Built and What We Learned',
    excerpt: 'Three teams, three products, one hackathon. A recap of the Cardano Africa Tech Summit Hackathon organised by the Hub.',
    post_type: 'Event Recap',
    published_at: '2026',
    author: 'NexTrium Hub',
  },
]

const STATUS_LABELS: Record<Product['status'], string> = {
  in_development: 'In Development',
  beta: 'Beta',
  live: 'Live',
  sunset: 'Sunset',
}

const POST_TYPE_CLASS: Record<string, string> = {
  'Product Update': 'type-product',
  'Announcement':   'type-announcement',
  'Event Recap':    'type-event',
  'Editorial':      'type-editorial',
  'Research':       'type-research',
}

// ── Page ────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <style>{`
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding-bottom: 80px;
          padding-top: var(--nav-height);
          position: relative;
          overflow: hidden;
        }
        .hero-glow {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 60% 50% at 80% 20%, rgba(219,103,39,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 10% 80%, rgba(10,139,139,0.07) 0%, transparent 55%);
        }
        .hero-grid {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.04;
          background-image:
            linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px);
          background-size: 80px 80px;
        }
        .hero-content { position: relative; z-index: 1; }
        .hero-headline {
          font-family: var(--font-exo2);
          font-weight: 900;
          font-size: clamp(52px, 10vw, 100px);
          line-height: 0.95;
          letter-spacing: -2px;
          color: var(--white);
          margin-bottom: 32px;
        }
        .hero-headline em { font-style: normal; color: var(--orange); }
        .hero-sub {
          font-weight: 300;
          font-size: clamp(16px, 2vw, 20px);
          color: var(--grey-mid);
          line-height: 1.65;
          max-width: 520px;
          margin-bottom: 56px;
        }
        .hero-ctas { display: flex; flex-direction: column; gap: 2px; max-width: 340px; }
        .builds-section {
          background: var(--navy-deep);
          padding: var(--section-py) 0;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .section-header { margin-bottom: 48px; }
        .builds-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          margin-bottom: 40px;
        }
        .build-card {
          background: var(--navy);
          padding: 40px 32px;
          display: flex; flex-direction: column; gap: 24px;
          text-decoration: none;
          transition: background var(--transition-base);
          position: relative; overflow: hidden;
        }
        .build-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: var(--orange);
          transform: scaleX(0); transform-origin: left;
          transition: transform var(--transition-slow);
        }
        .build-card:hover { background: var(--navy-mid); }
        .build-card:hover::before { transform: scaleX(1); }
        .build-card-top { display: flex; align-items: center; justify-content: space-between; }
        .build-mark {
          width: 48px; height: 48px;
          display: flex; align-items: center; justify-content: center;
          background: var(--navy-mid); border-radius: 2px;
        }
        .build-status {
          font-family: var(--font-mono);
          font-size: 8px; letter-spacing: 0.15em; text-transform: uppercase;
          padding: 4px 8px;
        }
        .status-in_development { background: rgba(212,168,67,0.12); color: var(--gold); }
        .status-live   { background: rgba(34,193,122,0.12);  color: var(--success); }
        .status-beta   { background: rgba(10,139,139,0.12);  color: var(--teal); }
        .status-sunset { background: rgba(232,69,69,0.12);   color: var(--error); }
        .build-name {
          font-family: var(--font-exo2); font-weight: 700;
          font-size: 22px; color: var(--white); letter-spacing: -0.3px;
        }
        .build-desc { font-size: 14px; color: var(--grey-mid); line-height: 1.6; flex: 1; }
        .build-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .build-tag {
          font-family: var(--font-mono);
          font-size: 8px; letter-spacing: 0.1em; text-transform: uppercase;
          padding: 3px 8px; border: 1px solid var(--navy-mid); color: var(--grey-mid);
        }
        .build-arrow {
          font-size: 18px; color: var(--grey-dark); align-self: flex-end;
          transition: color var(--transition-base), transform var(--transition-base);
        }
        .build-card:hover .build-arrow { color: var(--orange); transform: translate(3px, -3px); }
        .services-section { background: var(--off-white); padding: var(--section-py) 0; }
        .services-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
        .services-statement {
          font-family: var(--font-exo2); font-weight: 800;
          font-size: clamp(28px, 4vw, 44px); color: var(--navy-deep);
          line-height: 1.1; letter-spacing: -0.5px; margin-bottom: 24px;
        }
        .services-statement em { font-style: normal; color: var(--orange); }
        .services-body {
          font-size: 16px; color: var(--grey-dark);
          line-height: 1.7; max-width: 420px;
        }
        .service-item {
          display: flex; align-items: flex-start; gap: 20px;
          padding: 24px 0; border-bottom: 1px solid var(--grey-light);
          text-decoration: none;
          transition: padding-left var(--transition-base);
        }
        .service-item:first-child { border-top: 1px solid var(--grey-light); }
        .service-item:hover { padding-left: 8px; }
        .service-num {
          font-family: var(--font-mono); font-size: 10px;
          color: var(--orange); letter-spacing: 0.1em;
          min-width: 28px; padding-top: 2px;
        }
        .service-name {
          font-family: var(--font-exo2); font-weight: 600;
          font-size: 18px; color: var(--navy-deep); margin-bottom: 4px;
        }
        .service-desc { font-size: 13px; color: var(--grey-dark); line-height: 1.6; }
        .service-arrow {
          margin-left: auto; font-size: 16px; color: var(--grey-mid);
          padding-top: 2px; flex-shrink: 0;
          transition: color var(--transition-base);
        }
        .service-item:hover .service-arrow { color: var(--orange); }
        .hub-section { background: var(--navy); padding: var(--section-py) 0; }
        .hub-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
        .hub-statement {
          font-family: var(--font-exo2); font-weight: 800;
          font-size: clamp(28px, 4vw, 44px); color: var(--white);
          line-height: 1.1; letter-spacing: -0.5px; margin-bottom: 20px;
        }
        .hub-statement em { font-style: normal; color: var(--orange); }
        .hub-body { font-size: 16px; color: var(--grey-mid); line-height: 1.7; margin-bottom: 40px; }
        .hub-stats { display: flex; gap: 40px; margin-bottom: 40px; }
        .hub-stat-num {
          font-family: var(--font-exo2); font-weight: 900;
          font-size: 40px; letter-spacing: -1px; color: var(--orange); line-height: 1;
        }
        .hub-stat-label {
          font-family: var(--font-mono); font-size: 9px;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--grey-mid); margin-top: 4px;
        }
        .event-card { background: var(--navy-mid); padding: 32px; position: relative; overflow: hidden; }
        .event-card::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--orange), transparent);
        }
        .event-type {
          font-family: var(--font-mono); font-size: 9px;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--orange); margin-bottom: 12px;
        }
        .event-title {
          font-family: var(--font-exo2); font-weight: 700;
          font-size: 22px; color: var(--white);
          margin-bottom: 8px; letter-spacing: -0.3px;
        }
        .event-meta { font-size: 13px; color: var(--grey-mid); margin-bottom: 16px; }
        .event-badge {
          display: inline-block; font-family: var(--font-mono);
          font-size: 8px; letter-spacing: 0.15em; text-transform: uppercase;
          padding: 4px 10px;
          background: rgba(34,193,122,0.12); color: var(--success);
          margin-bottom: 16px;
        }
        .event-desc { font-size: 13px; color: var(--grey-mid); line-height: 1.65; margin-bottom: 24px; }
        .event-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.06);
        }
        .event-location { font-size: 13px; color: var(--grey-mid); }
        .blog-section { background: var(--white); padding: var(--section-py) 0; }
        .posts-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 2px; margin-bottom: 40px;
        }
        .post-card {
          background: var(--off-white); padding: 32px;
          display: flex; flex-direction: column; gap: 16px;
          text-decoration: none;
          transition: background var(--transition-base);
        }
        .post-card:hover { background: var(--grey-light); }
        .post-header { display: flex; align-items: center; justify-content: space-between; }
        .post-type-badge {
          font-family: var(--font-mono); font-size: 8px;
          letter-spacing: 0.15em; text-transform: uppercase; padding: 3px 8px;
        }
        .type-editorial    { background: rgba(13,35,61,0.08);   color: var(--navy); }
        .type-announcement { background: rgba(219,103,39,0.10); color: var(--orange); }
        .type-product      { background: rgba(10,139,139,0.10); color: var(--teal); }
        .type-research     { background: rgba(74,111,165,0.10); color: var(--slate); }
        .type-event        { background: rgba(212,168,67,0.10); color: var(--gold); }
        .post-date {
          font-family: var(--font-mono); font-size: 8px;
          letter-spacing: 0.1em; color: var(--grey-mid);
        }
        .post-title {
          font-family: var(--font-exo2); font-weight: 700;
          font-size: 18px; color: var(--navy-deep);
          line-height: 1.25; letter-spacing: -0.2px;
        }
        .post-excerpt { font-size: 13px; color: var(--grey-dark); line-height: 1.65; flex: 1; }
        .post-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 16px; border-top: 1px solid var(--grey-light);
        }
        .post-author { font-size: 12px; color: var(--grey-mid); }
        .post-arrow { font-size: 14px; color: var(--grey-mid); transition: color var(--transition-base); }
        .post-card:hover .post-arrow { color: var(--orange); }
        .company-strip {
          background: var(--navy-deep); padding: 80px 0;
          border-top: 2px solid var(--orange);
        }
        .company-strip-inner {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 40px;
        }
        .company-statement {
          font-family: var(--font-exo2); font-weight: 800;
          font-size: clamp(28px, 4vw, 48px); letter-spacing: -1px;
          color: var(--white); line-height: 1.05;
        }
        .company-statement em { font-style: normal; color: var(--orange); }
        .company-details { display: flex; flex-direction: column; gap: 6px; text-align: right; }
        .company-detail-line {
          font-family: var(--font-mono); font-size: 9px;
          letter-spacing: 0.15em; color: var(--grey-mid); text-transform: uppercase;
        }
        @media (max-width: 900px) {
          .builds-grid   { grid-template-columns: 1fr; }
          .services-grid { grid-template-columns: 1fr; gap: 48px; }
          .hub-grid      { grid-template-columns: 1fr; gap: 48px; }
          .posts-grid    { grid-template-columns: 1fr; }
          .company-strip-inner { flex-direction: column; align-items: flex-start; }
          .company-details { text-align: left; }
        }
        @media (max-width: 600px) {
          .hero-ctas { max-width: 100%; }
          .hub-stats { gap: 24px; }
        }
      `}</style>

      <Navbar />

      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-grid" />
        <div className="container hero-content">
          <h1 className="hero-headline">
            We build<br /><em>what&apos;s</em><br />next.
          </h1>
          <p className="hero-sub">
            An innovation company designing products, infrastructure, and ventures for emerging markets and beyond.
          </p>
          <div className="hero-ctas">
            <CTABox href="/#builds"  label="See our builds" variant="dark" fullWidth />
            <CTABox href="/services" label="Our services"   variant="dark" fullWidth />
            <CTABox href="/about"    label="About us"       variant="dark" fullWidth />
          </div>
        </div>
      </section>

      <section className="builds-section" id="builds">
        <div className="container">
          <div className="section-header">
            <SectionTag label="Current builds" />
            <h2 className="section-title">What we&apos;re<br />building now.</h2>
          </div>
          <div className="builds-grid">
            {PRODUCTS.map((product) => (
              <Link key={product.slug} href={`/products/${product.slug}`} className="build-card">
                <div className="build-card-top">
                  <div className="build-mark">
                    <NTMark size={28} bodyColor={product.bodyColor} accentColor="#DB6727" />
                  </div>
                  <span className={`build-status status-${product.status}`}>
                    {STATUS_LABELS[product.status]}
                  </span>
                </div>
                <div className="build-name">{product.name}</div>
                <div className="build-desc">{product.tagline}</div>
                <div className="build-tags">
                  {product.category.map((tag) => (
                    <span key={tag} className="build-tag">{tag}</span>
                  ))}
                </div>
                <span className="build-arrow">↗</span>
              </Link>
            ))}
          </div>
          <CTABox href="/products" label="View all builds" variant="dark" />
        </div>
      </section>

      <section className="services-section" id="services">
        <div className="container">
          <div className="services-grid">
            <div>
              <SectionTag label="How we work" />
              <div className="services-statement">
                We build what<br />others can only<br /><em>describe.</em>
              </div>
              <p className="services-body">
                NexTrium delivers bespoke technology services. No fixed packages. Every engagement starts with a conversation about what you need to build.
              </p>
            </div>
            <div>
              {SERVICES.map((service) => (
                <Link key={service.num} href="/services" className="service-item">
                  <span className="service-num">{service.num}</span>
                  <div>
                    <div className="service-name">{service.name}</div>
                    <div className="service-desc">{service.description}</div>
                  </div>
                  <span className="service-arrow">→</span>
                </Link>
              ))}
            </div>
          </div>
          <div style={{ marginTop: '48px' }}>
            <CTABox href="/contact?subject=services" label="Tell us what you're building" variant="light" />
          </div>
        </div>
      </section>

      <section className="hub-section" id="hub">
        <div className="container">
          <div className="hub-grid">
            <div>
              <SectionTag label="NexTrium Hub" />
              <div className="hub-statement">
                Where builders<br />connect and<br /><em>work gets done.</em>
              </div>
              <p className="hub-body">
                The Hub is NexTrium&apos;s community and innovation programme. It has hosted hackathons, workshops, and collaborative build sprints that have produced real products from real teams.
              </p>
              <div className="hub-stats">
                <div>
                  <div className="hub-stat-num">3+</div>
                  <div className="hub-stat-label">Events hosted</div>
                </div>
                <div>
                  <div className="hub-stat-num">10+</div>
                  <div className="hub-stat-label">Community projects</div>
                </div>
                <div>
                  <div className="hub-stat-num">2026</div>
                  <div className="hub-stat-label">Est.</div>
                </div>
              </div>
            </div>
            <div>
              <div className="event-card">
                <div className="event-type">Hackathon</div>
                <div className="event-title">Cardano Africa Tech Summit Hackathon</div>
                <div className="event-meta">Lagos, Nigeria · 2026</div>
                <div className="event-badge">Completed</div>
                <p className="event-desc">
                  Teams built across agriculture, fintech, EdTech, and identity. Projects included AgriDatum, TechKR, and Medisure.
                </p>
                <div className="event-footer">
                  <span className="event-location">3 community projects shipped</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '48px' }}>
            <CTABox href="/hub" label="See all events" variant="dark" />
          </div>
        </div>
      </section>

      <section className="blog-section" id="blog">
        <div className="container">
          <div className="section-header">
            <SectionTag label="From the blog" />
            <h2 className="section-title-dark">Latest from<br />NexTrium.</h2>
          </div>
          <div className="posts-grid">
            {POSTS.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="post-card">
                <div className="post-header">
                  <span className={`post-type-badge ${POST_TYPE_CLASS[post.post_type] ?? 'type-editorial'}`}>
                    {post.post_type}
                  </span>
                  <span className="post-date">{post.published_at}</span>
                </div>
                <div className="post-title">{post.title}</div>
                <div className="post-excerpt">{post.excerpt}</div>
                <div className="post-footer">
                  <span className="post-author">{post.author}</span>
                  <span className="post-arrow">↗</span>
                </div>
              </Link>
            ))}
          </div>
          <CTABox href="/blog" label="Read more" variant="light" />
        </div>
      </section>

      <section className="company-strip">
        <div className="container">
          <div className="company-strip-inner">
            <div className="company-statement">
              Building from<br /><em>Africa,</em> for the world.
            </div>
            <div className="company-details">
              <span className="company-detail-line">NexTrium Global Innovations Ltd</span>
              <span className="company-detail-line">RC: 9506507 · Est. 2026</span>
              <span className="company-detail-line">Lagos, Nigeria</span>
              <span className="company-detail-line">nextrium.org</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
