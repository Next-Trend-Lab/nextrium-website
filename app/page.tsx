import Link from 'next/link'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import NTMark from '@/components/shared/NTMark'
import CTABox from '@/components/ui/CTABox'
import SectionTag from '@/components/shared/SectionTag'

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

const PRODUCTS: Product[] = [
  {
    slug: 'zivana',
    name: 'Zivana Protocol',
    tagline: "Open Layer 2 trust infrastructure for Africa's informal economy.",
    status: 'in_development',
    category: ['Web3', 'Cardano', 'Trust'],
    bodyColor: '#0A8B8B',
  },
  {
    slug: 'sovela',
    name: 'Sovela',
    tagline: "Community credit and market intelligence built on Zivana Protocol.",
    status: 'in_development',
    category: ['Fintech', 'MSME', 'Nigeria'],
    bodyColor: '#4A6FA5',
  },
  {
    slug: 'accordiax',
    name: 'Accordiax',
    tagline: 'Trust-based student-consultant agreement platform for Nigeria.',
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
    excerpt: 'How we are building an open Layer 2 protocol that makes invisible capability visible to capital providers.',
    post_type: 'Product Update',
    published_at: '06.2026',
    author: 'Abdulbasit Abdulrahman',
  },
  {
    slug: 'nextrium-incorporated',
    title: 'NexTrium is Now an Officially Registered Company in Nigeria',
    excerpt: 'We received our CAC registration certificate. RC: 9506507. Here is what it means and what comes next.',
    post_type: 'Announcement',
    published_at: '04.2026',
    author: 'Abdulbasit Abdulrahman',
  },
  {
    slug: 'cats-hackathon-recap',
    title: 'CATS Hackathon: What the Teams Built and What We Learned',
    excerpt: 'Three teams, three products, one hackathon. A recap of the Cardano Africa Tech Summit Hackathon.',
    post_type: 'Event Recap',
    published_at: '03.2026',
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

export default function HomePage() {
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes countUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero {
          min-height: 100vh;
          display: flex; flex-direction: column; justify-content: flex-end;
          padding-bottom: 72px; padding-top: var(--nav-height);
          position: relative; overflow: hidden; background: var(--navy-deep);
        }
        .hero-glow {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 55% 45% at 85% 15%, rgba(219,103,39,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 35% 55% at 8% 85%, rgba(10,139,139,0.08) 0%, transparent 55%),
            radial-gradient(ellipse 40% 40% at 50% 50%, rgba(13,35,61,0.4) 0%, transparent 70%);
        }
        .hero-grid {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.035;
          background-image:
            linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px);
          background-size: 72px 72px;
        }
        .hero-content { position: relative; z-index: 1; }
        .hero-headline {
          font-family: var(--font-exo2); font-weight: 900;
          font-size: clamp(56px, 11vw, 108px);
          line-height: 0.93; letter-spacing: -3px;
          color: var(--white); margin-bottom: 28px;
          animation: fadeUp 0.8s ease both; animation-delay: 0.1s;
        }
        .hero-headline em { font-style: normal; color: var(--orange); }
        .hero-sub {
          font-weight: 300; font-size: clamp(15px, 1.6vw, 18px);
          color: var(--grey-mid); line-height: 1.7;
          max-width: 480px; margin-bottom: 52px;
          animation: fadeUp 0.8s ease both; animation-delay: 0.25s;
        }
        .hero-ctas {
          display: flex; flex-direction: row; gap: 0;
          width: 100%; max-width: 640px;
          animation: fadeUp 0.8s ease both; animation-delay: 0.4s;
        }
        .hero-cta-item {
          flex: 1; display: flex; align-items: center;
          justify-content: space-between; gap: 12px;
          padding: 16px 20px;
          border: 1px solid rgba(255,255,255,0.18); border-right: none;
          text-decoration: none; color: var(--white);
          font-size: 13px; font-family: var(--font-dm); font-weight: 400;
          transition: border-color var(--transition-base), background var(--transition-base);
          white-space: nowrap;
        }
        .hero-cta-item:last-child { border-right: 1px solid rgba(255,255,255,0.18); }
        .hero-cta-item:hover { border-color: var(--orange); background: rgba(219,103,39,0.07); z-index: 1; }
        .split-header {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 48px; align-items: end; margin-bottom: 56px;
        }
        .split-header-desc { font-size: 15px; color: var(--grey-mid); line-height: 1.75; padding-bottom: 6px; }
        .split-header-desc-dark { font-size: 15px; color: var(--grey-dark); line-height: 1.75; padding-bottom: 6px; }
        .builds-section {
          background: var(--navy-deep); padding: var(--section-py) 0;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .builds-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: rgba(255,255,255,0.06);
        }
        .build-card {
          background: var(--navy); padding: 40px 32px 32px;
          display: flex; flex-direction: column; gap: 20px;
          text-decoration: none; transition: background var(--transition-base);
          position: relative;
        }
        .build-card::before, .build-card::after {
          content: ''; position: absolute;
          width: 12px; height: 12px;
          border-color: rgba(219,103,39,0); border-style: solid;
          transition: border-color var(--transition-slow);
        }
        .build-card::before { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
        .build-card::after  { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }
        .build-card:hover { background: var(--navy-mid); }
        .build-card:hover::before, .build-card:hover::after { border-color: var(--orange); }
        .build-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
        .build-mark-wrap {
          width: 56px; height: 56px; display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 2px; flex-shrink: 0;
        }
        .build-status {
          font-family: var(--font-mono); font-size: 7.5px;
          letter-spacing: 0.15em; text-transform: uppercase; padding: 4px 8px;
        }
        .status-in_development { background: rgba(212,168,67,0.1);  color: var(--gold);    border: 1px solid rgba(212,168,67,0.2); }
        .status-live            { background: rgba(34,193,122,0.1);  color: var(--success); border: 1px solid rgba(34,193,122,0.2); }
        .status-beta            { background: rgba(10,139,139,0.1);  color: var(--teal);    border: 1px solid rgba(10,139,139,0.2); }
        .status-sunset          { background: rgba(232,69,69,0.1);   color: var(--error);   border: 1px solid rgba(232,69,69,0.2); }
        .build-name {
          font-family: var(--font-exo2); font-weight: 700;
          font-size: 20px; color: var(--white); letter-spacing: -0.3px; line-height: 1.2;
        }
        .build-desc { font-size: 13px; color: var(--grey-mid); line-height: 1.65; flex: 1; }
        .build-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .build-tag {
          font-family: var(--font-mono); font-size: 7.5px;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 3px 8px; border: 1px solid rgba(255,255,255,0.08); color: var(--grey-mid);
        }
        .build-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.06);
        }
        .build-arrow {
          font-size: 16px; color: var(--grey-dark);
          transition: color var(--transition-base), transform var(--transition-base);
        }
        .build-card:hover .build-arrow { color: var(--orange); transform: translate(3px, -3px); }
        .builds-cta-row { display: flex; border-top: 1px solid rgba(255,255,255,0.06); }
        .builds-cta-row a { max-width: 100% !important; width: 100% !important; }
        .services-section { background: var(--off-white); padding: var(--section-py) 0; }
        .services-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .service-item {
          display: flex; align-items: flex-start; gap: 20px;
          padding: 20px 0; border-bottom: 1px solid var(--grey-light);
          text-decoration: none; transition: padding-left var(--transition-base);
        }
        .service-item:first-child { border-top: 1px solid var(--grey-light); }
        .service-item:hover { padding-left: 8px; }
        .service-num {
          font-family: var(--font-mono); font-size: 9px;
          color: var(--orange); letter-spacing: 0.12em;
          min-width: 28px; padding-top: 3px; flex-shrink: 0;
        }
        .service-name {
          font-family: var(--font-exo2); font-weight: 600;
          font-size: 16px; color: var(--navy-deep); margin-bottom: 3px;
        }
        .service-desc { font-size: 12px; color: var(--grey-dark); line-height: 1.6; }
        .service-arrow {
          margin-left: auto; font-size: 14px; color: var(--grey-mid);
          padding-top: 3px; flex-shrink: 0; transition: color var(--transition-base);
        }
        .service-item:hover .service-arrow { color: var(--orange); }
        .service-quote-wrap {
          position: relative; overflow: hidden;
          background: var(--navy-deep);
          border: 1px solid var(--grey-light);
          padding: 40px;
        }
        .service-quote-grid {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.04;
          background-image:
            linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .service-quote-corner-tl {
          position: absolute; top: -1px; left: -1px;
          width: 16px; height: 16px;
          border-top: 2px solid var(--orange); border-left: 2px solid var(--orange);
        }
        .service-quote-corner-br {
          position: absolute; bottom: -1px; right: -1px;
          width: 16px; height: 16px;
          border-bottom: 2px solid var(--orange); border-right: 2px solid var(--orange);
        }
        .service-quote-text {
          position: relative; z-index: 1;
          font-family: var(--font-exo2); font-weight: 700;
          font-size: 22px; color: var(--white); line-height: 1.3;
          letter-spacing: -0.3px; margin-bottom: 16px;
        }
        .service-quote-sub {
          position: relative; z-index: 1;
          font-size: 13px; color: var(--grey-mid); line-height: 1.7;
        }
        .services-cta { margin-top: 40px; }
        .services-cta a { max-width: 100% !important; width: 100% !important; }
        .hub-section { background: var(--navy); padding: var(--section-py) 0; }
        .hub-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
        .hub-stats { display: flex; gap: 40px; margin-bottom: 48px; }
        .hub-stat { animation: countUp 0.7s ease both; }
        .hub-stat:nth-child(1) { animation-delay: 0.1s; }
        .hub-stat:nth-child(2) { animation-delay: 0.25s; }
        .hub-stat:nth-child(3) { animation-delay: 0.4s; }
        .hub-stat-num {
          font-family: var(--font-exo2); font-weight: 900;
          font-size: 44px; letter-spacing: -2px; color: var(--orange); line-height: 1;
        }
        .hub-stat-label {
          font-family: var(--font-mono); font-size: 8.5px;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--grey-mid); margin-top: 6px;
        }
        .event-card {
          background: var(--navy-mid); padding: 32px;
          position: relative; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.06);
          animation: slideRight 0.8s ease both; animation-delay: 0.2s;
        }
        .event-card::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--orange), transparent);
        }
        .event-card-corner-tl, .event-card-corner-br {
          position: absolute; width: 14px; height: 14px;
          border-color: rgba(219,103,39,0.4); border-style: solid;
        }
        .event-card-corner-tl { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
        .event-card-corner-br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }
        .event-type {
          font-family: var(--font-mono); font-size: 8.5px;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--orange); margin-bottom: 12px;
        }
        .event-title {
          font-family: var(--font-exo2); font-weight: 700;
          font-size: 20px; color: var(--white); margin-bottom: 8px;
          letter-spacing: -0.3px; line-height: 1.25;
        }
        .event-meta { font-size: 12px; color: var(--grey-mid); margin-bottom: 14px; }
        .event-badge {
          display: inline-block; font-family: var(--font-mono);
          font-size: 7.5px; letter-spacing: 0.15em; text-transform: uppercase;
          padding: 4px 10px;
          background: rgba(34,193,122,0.1); color: var(--success);
          border: 1px solid rgba(34,193,122,0.2); margin-bottom: 16px;
        }
        .event-desc { font-size: 13px; color: var(--grey-mid); line-height: 1.65; margin-bottom: 24px; }
        .event-footer-row {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.06);
        }
        .event-location { font-size: 12px; color: var(--grey-mid); }
        .hub-cta { margin-top: 40px; }
        .blog-section { background: var(--navy-deep); padding: var(--section-py) 0; }
        .blog-list { margin-bottom: 0; }
        .blog-list-item {
          display: grid; grid-template-columns: 160px 1fr auto;
          align-items: center; gap: 32px; padding: 24px 0;
          border-bottom: 1px dashed rgba(255,255,255,0.08);
          text-decoration: none;
          transition: background var(--transition-base), padding-left var(--transition-base);
        }
        .blog-list-item:first-child { border-top: 1px dashed rgba(255,255,255,0.08); }
        .blog-list-item:hover { background: rgba(255,255,255,0.02); padding-left: 8px; }
        .blog-date {
          font-family: var(--font-mono); font-size: 15px; font-weight: 700;
          color: var(--orange); letter-spacing: 0.02em; white-space: nowrap;
        }
        .blog-post-title {
          font-family: var(--font-exo2); font-weight: 600;
          font-size: 16px; color: var(--white); line-height: 1.3;
          margin-bottom: 4px; letter-spacing: -0.2px;
        }
        .blog-post-meta { font-size: 12px; color: var(--grey-mid); }
        .blog-post-type {
          font-family: var(--font-mono); font-size: 8px;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 2px 7px; margin-right: 8px;
        }
        .blog-arrow {
          font-size: 18px; color: var(--grey-dark);
          transition: color var(--transition-base), transform var(--transition-base);
        }
        .blog-list-item:hover .blog-arrow { color: var(--orange); transform: translate(3px, -3px); }
        .blog-cta { margin-top: 40px; }
        .blog-cta a { max-width: 100% !important; width: 100% !important; }
        .type-editorial    { background: rgba(13,35,61,0.4);    color: var(--grey-mid); }
        .type-announcement { background: rgba(219,103,39,0.12); color: var(--orange); }
        .type-product      { background: rgba(10,139,139,0.12); color: var(--teal); }
        .type-research     { background: rgba(74,111,165,0.12); color: var(--slate); }
        .type-event        { background: rgba(212,168,67,0.12); color: var(--gold); }
        .company-strip {
          background: var(--navy-deep); padding: 80px 0;
          border-top: 2px solid var(--orange);
          position: relative; overflow: hidden;
        }
        .company-strip-bg {
          position: absolute; right: 0; top: 0; bottom: 0; width: 45%; opacity: 0.04;
          background-image:
            linear-gradient(rgba(219,103,39,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(219,103,39,0.8) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .company-strip-inner {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 40px; position: relative; z-index: 1;
        }
        .company-statement {
          font-family: var(--font-exo2); font-weight: 800;
          font-size: clamp(32px, 4.5vw, 60px); letter-spacing: -2px;
          color: var(--white); line-height: 1.05;
        }
        .company-statement em { font-style: normal; color: var(--orange); }
        .company-details { display: flex; flex-direction: column; gap: 8px; text-align: right; }
        .company-detail-line {
          font-family: var(--font-mono); font-size: 9px;
          letter-spacing: 0.18em; color: var(--grey-mid); text-transform: uppercase;
        }
        @media (max-width: 900px) {
          .hero-ctas { flex-direction: column; max-width: 100%; }
          .hero-cta-item { border-right: 1px solid rgba(255,255,255,0.18); border-bottom: none; }
          .hero-cta-item:last-child { border-bottom: 1px solid rgba(255,255,255,0.18); }
          .split-header    { grid-template-columns: 1fr; gap: 16px; }
          .builds-grid     { grid-template-columns: 1fr; }
          .services-layout { grid-template-columns: 1fr; gap: 40px; }
          .hub-layout      { grid-template-columns: 1fr; gap: 48px; }
          .blog-list-item  { grid-template-columns: 100px 1fr auto; gap: 16px; }
          .company-strip-inner { flex-direction: column; align-items: flex-start; }
          .company-details { text-align: left; }
          .company-strip-bg { width: 100%; opacity: 0.02; }
        }
        @media (max-width: 640px) {
          .hero-headline { letter-spacing: -2px; }
          .blog-list-item { grid-template-columns: 1fr auto; }
          .blog-date { display: none; }
          .hub-stats { gap: 24px; }
          .hub-stat-num { font-size: 36px; }
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
            <Link href="/#builds"  className="hero-cta-item"><span>See our builds</span><span aria-hidden="true">→</span></Link>
            <Link href="/services" className="hero-cta-item"><span>Our services</span><span aria-hidden="true">→</span></Link>
            <Link href="/about"    className="hero-cta-item"><span>About us</span><span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <section className="builds-section" id="builds">
        <div className="container">
          <div className="split-header">
            <div>
              <SectionTag label="Current builds" />
              <h2 className="section-title">What we&apos;re<br />building now.</h2>
            </div>
            <p className="split-header-desc">
              Three products in active development. Each one addresses a trust gap in an underserved market. The list will grow.
            </p>
          </div>
          <div className="builds-grid">
            {PRODUCTS.map((product) => (
              <Link key={product.slug} href={`/products/${product.slug}`} className="build-card">
                <div className="build-card-top">
                  <div className="build-mark-wrap">
                    <NTMark size={32} bodyColor={product.bodyColor} accentColor="#DB6727" />
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
                <div className="build-footer">
                  <span style={{ fontSize: '11px', color: 'var(--grey-dark)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>LEARN MORE</span>
                  <span className="build-arrow">↗</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="builds-cta-row">
            <CTABox href="/products" label="View all builds" variant="dark" fullWidth />
          </div>
        </div>
      </section>

      <section className="services-section" id="services">
        <div className="container">
          <div className="split-header">
            <div>
              <SectionTag label="How we work" />
              <h2 className="section-title-dark">
                We build what<br />others can only<br />
                <em style={{ fontStyle: 'normal', color: 'var(--orange)' }}>describe.</em>
              </h2>
            </div>
            <p className="split-header-desc-dark">
              NexTrium delivers bespoke technology services. No fixed packages. Every engagement starts with a conversation about what you need to build.
            </p>
          </div>
          <div className="services-layout">
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
            <div>
              <div className="service-quote-wrap">
                <div className="service-quote-grid" />
                <div className="service-quote-corner-tl" />
                <div className="service-quote-corner-br" />
                <p className="service-quote-text">
                  Every engagement starts with a conversation, not a contract.
                </p>
                <p className="service-quote-sub">
                  We listen first. Then we scope, propose, and build. No retainers unless they make sense. No overhead you did not ask for.
                </p>
              </div>
            </div>
          </div>
          <div className="services-cta">
            <CTABox href="/contact?subject=services" label="Tell us what you're building" variant="light" />
          </div>
        </div>
      </section>

      <section className="hub-section" id="hub">
        <div className="container">
          <div className="split-header">
            <div>
              <SectionTag label="NexTrium Hub" />
              <h2 className="section-title">
                Where builders<br />connect and<br />
                <em style={{ fontStyle: 'normal', color: 'var(--orange)' }}>work gets done.</em>
              </h2>
            </div>
            <p className="split-header-desc">
              The Hub is NexTrium&apos;s community and innovation programme. It has hosted hackathons, workshops, and build sprints that have produced real products from real teams.
            </p>
          </div>
          <div className="hub-layout">
            <div>
              <div className="hub-stats">
                <div className="hub-stat">
                  <div className="hub-stat-num">3+</div>
                  <div className="hub-stat-label">Events hosted</div>
                </div>
                <div className="hub-stat">
                  <div className="hub-stat-num">10+</div>
                  <div className="hub-stat-label">Community projects</div>
                </div>
                <div className="hub-stat">
                  <div className="hub-stat-num">2026</div>
                  <div className="hub-stat-label">Est.</div>
                </div>
              </div>
              <div className="hub-cta">
                <CTABox href="/events" label="See all events" variant="dark" />
              </div>
            </div>
            <div>
              <div className="event-card">
                <div className="event-card-corner-tl" />
                <div className="event-card-corner-br" />
                <div className="event-type">Hackathon</div>
                <div className="event-title">Cardano Africa Tech Summit Hackathon</div>
                <div className="event-meta">Lagos, Nigeria · 2026</div>
                <div className="event-badge">Completed</div>
                <p className="event-desc">
                  Teams built across agriculture, fintech, EdTech, and identity. Projects included AgriDatum, TechKR, and Medisure.
                </p>
                <div className="event-footer-row">
                  <span className="event-location">3 community projects shipped</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="blog-section" id="blog">
        <div className="container">
          <div className="split-header">
            <div>
              <SectionTag label="From the blog" />
              <h2 className="section-title">Latest from<br />NexTrium.</h2>
            </div>
            <p className="split-header-desc">
              Product updates, announcements, event recaps, and research notes from the NexTrium team.
            </p>
          </div>
          <div className="blog-list">
            {POSTS.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-list-item">
                <span className="blog-date">{post.published_at}</span>
                <div>
                  <div className="blog-post-title">{post.title}</div>
                  <div className="blog-post-meta">
                    <span className={`blog-post-type ${POST_TYPE_CLASS[post.post_type] ?? 'type-editorial'}`}>
                      {post.post_type}
                    </span>
                    {post.author}
                  </div>
                </div>
                <span className="blog-arrow">↗</span>
              </Link>
            ))}
          </div>
          <div className="blog-cta">
            <CTABox href="/blog" label="Read more" variant="dark" />
          </div>
        </div>
      </section>

      <section className="company-strip">
        <div className="company-strip-bg" />
        <div className="container">
          <div className="company-strip-inner">
            <div className="company-statement">
              Building from <em>Africa,</em><br />for the world.
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