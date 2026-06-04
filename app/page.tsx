import Link from 'next/link'

function NTMark({
  size = 48,
  bodyColor = '#F5F6F8',
  accentColor = '#DB6727',
}: {
  size?: number
  bodyColor?: string
  accentColor?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="4" y="4" width="16" height="72" rx="4" fill={bodyColor} />
      <polygon points="20,4 36,4 76,68 76,76 60,76 20,12" fill={bodyColor} />
      <rect x="60" y="4" width="16" height="72" rx="4" fill={bodyColor} />
      <rect x="4" y="4" width="72" height="18" rx="4" fill={accentColor} />
      <rect x="32" y="4" width="16" height="36" rx="3" fill={accentColor} />
    </svg>
  )
}

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
  { num: '01', name: 'Product Development', description: 'Web, mobile, and enterprise applications built from idea to deployment.' },
  { num: '02', name: 'Research and Advisory', description: 'Technology research, feasibility studies, and strategic consulting.' },
  { num: '03', name: 'Venture Building', description: 'From idea to MVP. We build your startup as a service.' },
  { num: '04', name: 'Digital Talent Development', description: 'Training, mentorship, and capacity building for individuals and teams.' },
  { num: '05', name: 'AI and Data', description: 'Data analytics, AI integration, and emerging technology consulting.' },
  { num: '06', name: 'Strategic Partnerships', description: 'Connecting organisations to the right ecosystem, tools, and capital.' },
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

const POST_TYPE_CLASSES: Record<string, string> = {
  'Product Update': 'type-product',
  'Announcement': 'type-announcement',
  'Event Recap': 'type-event',
  'Editorial': 'type-editorial',
  'Research': 'type-research',
}

export default function HomePage() {
  return (
    <>
      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
          --navy-deep: #071628; --navy: #0D233D; --navy-mid: #163352;
          --orange: #DB6727; --teal: #0A8B8B; --gold: #D4A843;
          --slate: #4A6FA5; --grey-dark: #2E3F54; --grey-mid: #8A9BB0;
          --grey-light: #E2E6ED; --off-white: #F5F6F8; --white: #FFFFFF;
        }
        body { font-family: var(--font-dm, 'DM Sans'), sans-serif; background: var(--navy-deep); color: var(--white); overflow-x: hidden; }
        .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 clamp(24px,5vw,80px); height: 64px; background: rgba(7,22,40,0.92); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.06); }
        .nav-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }
        .nav-wordmark { font-family: var(--font-exo2,'Exo 2'),sans-serif; font-weight: 900; font-size: 22px; letter-spacing: -0.3px; color: var(--off-white); }
        .nav-wordmark span { color: var(--orange); }
        .nav-links { display: flex; align-items: center; gap: 32px; list-style: none; }
        .nav-links a { font-size: 14px; color: var(--grey-mid); text-decoration: none; transition: color 0.2s; }
        .nav-links a:hover { color: var(--white); }
        .nav-cta { font-size: 13px; font-weight: 500; color: var(--white); text-decoration: none; padding: 8px 20px; border: 1px solid rgba(255,255,255,0.25); transition: border-color 0.2s; }
        .nav-cta:hover { border-color: var(--orange); }
        .nav-ham { display: none; flex-direction: column; gap: 5px; cursor: pointer; background: none; border: none; padding: 4px; }
        .nav-ham span { display: block; width: 22px; height: 2px; background: var(--white); }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 clamp(24px,5vw,80px); }
        .section-tag { font-family: var(--font-mono,'Space Mono'),monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--orange); display: block; margin-bottom: 16px; }
        .section-title { font-family: var(--font-exo2,'Exo 2'),sans-serif; font-weight: 800; font-size: clamp(36px,5vw,56px); letter-spacing: -1px; line-height: 1.05; color: var(--white); }
        .section-title-dark { font-family: var(--font-exo2,'Exo 2'),sans-serif; font-weight: 800; font-size: clamp(36px,5vw,56px); letter-spacing: -1px; line-height: 1.05; color: var(--navy-deep); }
        .cta-box { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 24px; border: 1px solid rgba(255,255,255,0.2); text-decoration: none; color: var(--white); font-size: 14px; transition: border-color 0.2s, background 0.2s; width: 100%; max-width: 340px; }
        .cta-box:hover { border-color: var(--orange); background: rgba(219,103,39,0.06); }
        .cta-box-light { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 24px; border: 1px solid var(--grey-light); text-decoration: none; color: var(--navy-deep); font-size: 14px; transition: border-color 0.2s; width: 100%; max-width: 340px; }
        .cta-box-light:hover { border-color: var(--navy); }
        .hero { min-height: 100vh; display: flex; flex-direction: column; justify-content: flex-end; padding-bottom: 80px; padding-top: 64px; position: relative; overflow: hidden; }
        .hero-glow { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse 60% 50% at 80% 20%, rgba(219,103,39,0.10) 0%, transparent 60%), radial-gradient(ellipse 40% 60% at 10% 80%, rgba(10,139,139,0.07) 0%, transparent 55%); }
        .hero-grid { position: absolute; inset: 0; pointer-events: none; opacity: 0.04; background-image: linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px); background-size: 80px 80px; }
        .hero-content { position: relative; z-index: 1; }
        .hero-headline { font-family: var(--font-exo2,'Exo 2'),sans-serif; font-weight: 900; font-size: clamp(52px,10vw,100px); line-height: 0.95; letter-spacing: -2px; color: var(--white); margin-bottom: 32px; }
        .hero-headline em { font-style: normal; color: var(--orange); }
        .hero-sub { font-weight: 300; font-size: clamp(16px,2vw,20px); color: var(--grey-mid); line-height: 1.65; max-width: 520px; margin-bottom: 56px; }
        .hero-ctas { display: flex; flex-direction: column; gap: 2px; max-width: 340px; }
        .builds-section { background: var(--navy-deep); padding: 120px 0; border-top: 1px solid rgba(255,255,255,0.05); }
        .section-header { margin-bottom: 48px; }
        .builds-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 2px; margin-bottom: 40px; }
        .build-card { background: var(--navy); padding: 40px 32px; display: flex; flex-direction: column; gap: 24px; text-decoration: none; transition: background 0.2s; position: relative; overflow: hidden; }
        .build-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--orange); transform: scaleX(0); transform-origin: left; transition: transform 0.3s; }
        .build-card:hover { background: var(--navy-mid); }
        .build-card:hover::before { transform: scaleX(1); }
        .build-card-top { display: flex; align-items: center; justify-content: space-between; }
        .build-mark { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: var(--navy-mid); border-radius: 2px; }
        .build-status { font-family: var(--font-mono,'Space Mono'),monospace; font-size: 8px; letter-spacing: 0.15em; text-transform: uppercase; padding: 4px 8px; }
        .status-in_development { background: rgba(212,168,67,0.12); color: var(--gold); }
        .status-live { background: rgba(34,193,122,0.12); color: #22C17A; }
        .status-beta { background: rgba(10,139,139,0.12); color: var(--teal); }
        .status-sunset { background: rgba(232,69,69,0.12); color: #E84545; }
        .build-name { font-family: var(--font-exo2,'Exo 2'),sans-serif; font-weight: 700; font-size: 22px; color: var(--white); letter-spacing: -0.3px; }
        .build-desc { font-size: 14px; color: var(--grey-mid); line-height: 1.6; flex: 1; }
        .build-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .build-tag { font-family: var(--font-mono,'Space Mono'),monospace; font-size: 8px; letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 8px; border: 1px solid var(--navy-mid); color: var(--grey-mid); }
        .build-arrow { font-size: 18px; color: var(--grey-dark); transition: color 0.2s, transform 0.2s; align-self: flex-end; }
        .build-card:hover .build-arrow { color: var(--orange); transform: translate(3px,-3px); }
        .services-section { background: var(--off-white); padding: 120px 0; }
        .services-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
        .services-statement { font-family: var(--font-exo2,'Exo 2'),sans-serif; font-weight: 800; font-size: clamp(28px,4vw,44px); color: var(--navy-deep); line-height: 1.1; letter-spacing: -0.5px; margin-bottom: 24px; }
        .services-statement em { font-style: normal; color: var(--orange); }
        .services-body { font-size: 16px; color: var(--grey-dark); line-height: 1.7; margin-bottom: 40px; max-width: 420px; }
        .service-item { display: flex; align-items: flex-start; gap: 20px; padding: 24px 0; border-bottom: 1px solid var(--grey-light); text-decoration: none; transition: padding-left 0.2s; }
        .service-item:first-child { border-top: 1px solid var(--grey-light); }
        .service-item:hover { padding-left: 8px; }
        .service-num { font-family: var(--font-mono,'Space Mono'),monospace; font-size: 10px; color: var(--orange); letter-spacing: 0.1em; min-width: 28px; padding-top: 2px; }
        .service-name { font-family: var(--font-exo2,'Exo 2'),sans-serif; font-weight: 600; font-size: 18px; color: var(--navy-deep); margin-bottom: 4px; }
        .service-desc { font-size: 13px; color: var(--grey-dark); line-height: 1.6; }
        .service-arrow { margin-left: auto; font-size: 16px; color: var(--grey-mid); padding-top: 2px; transition: color 0.2s; flex-shrink: 0; }
        .service-item:hover .service-arrow { color: var(--orange); }
        .hub-section { background: var(--navy); padding: 120px 0; }
        .hub-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
        .hub-statement { font-family: var(--font-exo2,'Exo 2'),sans-serif; font-weight: 800; font-size: clamp(28px,4vw,44px); color: var(--white); line-height: 1.1; letter-spacing: -0.5px; margin-bottom: 20px; }
        .hub-statement em { font-style: normal; color: var(--orange); }
        .hub-body { font-size: 16px; color: var(--grey-mid); line-height: 1.7; margin-bottom: 40px; }
        .hub-stats { display: flex; gap: 40px; margin-bottom: 40px; }
        .hub-stat-num { font-family: var(--font-exo2,'Exo 2'),sans-serif; font-weight: 900; font-size: 40px; letter-spacing: -1px; color: var(--orange); line-height: 1; }
        .hub-stat-label { font-family: var(--font-mono,'Space Mono'),monospace; font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--grey-mid); margin-top: 4px; }
        .event-card { background: var(--navy-mid); padding: 32px; position: relative; overflow: hidden; }
        .event-card::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--orange), transparent); }
        .event-type { font-family: var(--font-mono,'Space Mono'),monospace; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--orange); margin-bottom: 12px; }
        .event-title { font-family: var(--font-exo2,'Exo 2'),sans-serif; font-weight: 700; font-size: 22px; color: var(--white); margin-bottom: 8px; letter-spacing: -0.3px; }
        .event-meta { font-size: 13px; color: var(--grey-mid); margin-bottom: 16px; }
        .event-badge { display: inline-block; font-family: var(--font-mono,'Space Mono'),monospace; font-size: 8px; letter-spacing: 0.15em; text-transform: uppercase; padding: 4px 10px; background: rgba(34,193,122,0.12); color: #22C17A; margin-bottom: 16px; }
        .event-desc { font-size: 13px; color: var(--grey-mid); line-height: 1.65; margin-bottom: 24px; }
        .event-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.06); }
        .event-location { font-size: 13px; color: var(--grey-mid); }
        .blog-section { background: var(--white); padding: 120px 0; }
        .posts-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 2px; margin-bottom: 40px; }
        .post-card { background: var(--off-white); padding: 32px; display: flex; flex-direction: column; gap: 16px; text-decoration: none; transition: background 0.2s; }
        .post-card:hover { background: var(--grey-light); }
        .post-header { display: flex; align-items: center; justify-content: space-between; }
        .post-type-badge { font-family: var(--font-mono,'Space Mono'),monospace; font-size: 8px; letter-spacing: 0.15em; text-transform: uppercase; padding: 3px 8px; }
        .type-editorial { background: rgba(13,35,61,0.08); color: var(--navy); }
        .type-announcement { background: rgba(219,103,39,0.10); color: var(--orange); }
        .type-product { background: rgba(10,139,139,0.10); color: var(--teal); }
        .type-research { background: rgba(74,111,165,0.10); color: var(--slate); }
        .type-event { background: rgba(212,168,67,0.10); color: var(--gold); }
        .post-date { font-family: var(--font-mono,'Space Mono'),monospace; font-size: 8px; letter-spacing: 0.1em; color: var(--grey-mid); }
        .post-title { font-family: var(--font-exo2,'Exo 2'),sans-serif; font-weight: 700; font-size: 18px; color: var(--navy-deep); line-height: 1.25; letter-spacing: -0.2px; }
        .post-excerpt { font-size: 13px; color: var(--grey-dark); line-height: 1.65; flex: 1; }
        .post-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 16px; border-top: 1px solid var(--grey-light); }
        .post-author { font-size: 12px; color: var(--grey-mid); }
        .post-arrow { font-size: 14px; color: var(--grey-mid); transition: color 0.2s; }
        .post-card:hover .post-arrow { color: var(--orange); }
        .company-strip { background: var(--navy-deep); padding: 80px 0; border-top: 2px solid var(--orange); }
        .company-strip-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 40px; }
        .company-statement { font-family: var(--font-exo2,'Exo 2'),sans-serif; font-weight: 800; font-size: clamp(28px,4vw,48px); letter-spacing: -1px; color: var(--white); line-height: 1.05; }
        .company-statement em { font-style: normal; color: var(--orange); }
        .company-details { display: flex; flex-direction: column; gap: 6px; text-align: right; }
        .company-detail-line { font-family: var(--font-mono,'Space Mono'),monospace; font-size: 9px; letter-spacing: 0.15em; color: var(--grey-mid); text-transform: uppercase; }
        .footer { background: var(--navy-deep); padding: 60px 0 32px; border-top: 1px solid rgba(255,255,255,0.05); }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 48px; }
        .footer-wordmark { font-family: var(--font-exo2,'Exo 2'),sans-serif; font-weight: 900; font-size: 18px; letter-spacing: -0.3px; color: var(--off-white); text-decoration: none; display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
        .footer-wordmark span { color: var(--orange); }
        .footer-tagline { font-family: var(--font-mono,'Space Mono'),monospace; font-size: 8px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--grey-dark); margin-bottom: 20px; }
        .footer-rc { font-family: var(--font-mono,'Space Mono'),monospace; font-size: 8px; letter-spacing: 0.1em; color: var(--grey-dark); line-height: 1.8; }
        .footer-col-title { font-size: 11px; font-weight: 500; color: var(--grey-mid); letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 16px; }
        .footer-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .footer-links a { font-size: 14px; color: var(--grey-dark); text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: var(--white); }
        .footer-bottom { display: flex; align-items: center; justify-content: space-between; padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.05); flex-wrap: wrap; gap: 16px; }
        .footer-copy { font-family: var(--font-mono,'Space Mono'),monospace; font-size: 8px; letter-spacing: 0.1em; color: var(--grey-dark); }
        .footer-social { display: flex; gap: 16px; }
        .footer-social a { font-family: var(--font-mono,'Space Mono'),monospace; font-size: 8px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--grey-dark); text-decoration: none; transition: color 0.2s; }
        .footer-social a:hover { color: var(--orange); }
        @media (max-width: 900px) {
          .nav-links { display: none; }
          .nav-ham { display: flex; }
          .builds-grid { grid-template-columns: 1fr; }
          .services-grid { grid-template-columns: 1fr; gap: 48px; }
          .hub-grid { grid-template-columns: 1fr; gap: 48px; }
          .posts-grid { grid-template-columns: 1fr; }
          .footer-grid { grid-template-columns: 1fr 1fr; }
          .company-strip-inner { flex-direction: column; align-items: flex-start; }
          .company-details { text-align: left; }
        }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr; }
          .hero-ctas { max-width: 100%; }
          .cta-box, .cta-box-light { max-width: 100%; }
          .hub-stats { gap: 24px; }
        }
      `}</style>

      <nav className="nav">
        <Link href="/" className="nav-logo">
          <NTMark size={36} />
          <div className="nav-wordmark">Nex<span>T</span>rium</div>
        </Link>
        <ul className="nav-links">
          <li><Link href="#builds">What we build</Link></li>
          <li><Link href="#services">Services</Link></li>
          <li><Link href="#hub">Hub</Link></li>
          <li><Link href="#blog">Blog</Link></li>
          <li><Link href="/about">About</Link></li>
        </ul>
        <Link href="/contact" className="nav-cta">Contact →</Link>
        <button className="nav-ham" aria-label="Open menu">
          <span /><span /><span />
        </button>
      </nav>

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
            <Link href="#builds" className="cta-box">See our builds <span>→</span></Link>
            <Link href="#services" className="cta-box">Our services <span>→</span></Link>
            <Link href="/about" className="cta-box">About us <span>→</span></Link>
          </div>
        </div>
      </section>

      <section className="builds-section" id="builds">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Current builds</span>
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
          <Link href="/products" className="cta-box">View all builds <span>→</span></Link>
        </div>
      </section>

      <section className="services-section" id="services">
        <div className="container">
          <div className="services-grid">
            <div>
              <span className="section-tag">How we work</span>
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
            <Link href="/contact?subject=services" className="cta-box-light">
              Tell us what you&apos;re building <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="hub-section" id="hub">
        <div className="container">
          <div className="hub-grid">
            <div>
              <span className="section-tag">NexTrium Hub</span>
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
            <Link href="/hub" className="cta-box">See all events <span>→</span></Link>
          </div>
        </div>
      </section>

      <section className="blog-section" id="blog">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">From the blog</span>
            <h2 className="section-title-dark">Latest from<br />NexTrium.</h2>
          </div>
          <div className="posts-grid">
            {POSTS.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="post-card">
                <div className="post-header">
                  <span className={`post-type-badge ${POST_TYPE_CLASSES[post.post_type] ?? 'type-editorial'}`}>
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
          <Link href="/blog" className="cta-box-light">Read more <span>→</span></Link>
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

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <Link href="/" className="footer-wordmark">
                <NTMark size={24} />
                Nex<span>T</span>rium
              </Link>
              <div className="footer-tagline">Innovation. Incubation. Impact.</div>
              <div className="footer-rc">
                NexTrium Global Innovations Ltd<br />
                RC: 9506507<br />
                69 Abeokuta Street, Ilaje Bariga<br />
                Lagos, Nigeria — 100223
              </div>
            </div>
            <div>
              <div className="footer-col-title">Company</div>
              <ul className="footer-links">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/about#team">Team</Link></li>
                <li><Link href="/hub">The Hub</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <div className="footer-col-title">Products</div>
              <ul className="footer-links">
                <li><Link href="/products">All builds</Link></li>
                <li><Link href="/products/zivana">Zivana</Link></li>
                <li><Link href="/products/sovela">Sovela</Link></li>
                <li><Link href="/products/accordiax">Accordiax</Link></li>
              </ul>
            </div>
            <div>
              <div className="footer-col-title">Resources</div>
              <ul className="footer-links">
                <li><Link href="/services">Services</Link></li>
                <li><Link href="/events">Events</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/careers">Careers</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">© 2026 NexTrium Global Innovations Ltd. All rights reserved.</span>
            <div className="footer-social">
              <a href="#" rel="noopener noreferrer">Twitter</a>
              <a href="#" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://github.com/NexTrium" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
