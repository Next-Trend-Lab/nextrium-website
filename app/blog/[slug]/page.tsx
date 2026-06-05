import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import SectionTag from '@/components/shared/SectionTag'
import CTABox from '@/components/ui/CTABox'
import { ALL_POSTS } from '../page'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = ALL_POSTS.find((p) => p.slug === slug)
  if (!post) return { title: 'Post not found' }
  return { title: post.title, description: post.excerpt }
}

export async function generateStaticParams() {
  return ALL_POSTS.map((p) => ({ slug: p.slug }))
}

const TYPE_LABELS: Record<string, string> = {
  editorial:      'Editorial',
  announcement:   'Announcement',
  product_update: 'Product Update',
  event_recap:    'Event Recap',
  research:       'Research',
  recruitment:    'Recruitment',
}

const TYPE_STYLES: Record<string, { bg: string; color: string }> = {
  editorial:      { bg: 'rgba(13,35,61,0.4)',    color: 'var(--grey-mid)' },
  announcement:   { bg: 'rgba(219,103,39,0.12)', color: 'var(--orange)'   },
  product_update: { bg: 'rgba(10,139,139,0.12)', color: 'var(--teal)'     },
  event_recap:    { bg: 'rgba(212,168,67,0.12)', color: 'var(--gold)'     },
  research:       { bg: 'rgba(74,111,165,0.12)', color: 'var(--slate)'    },
  recruitment:    { bg: 'rgba(34,193,122,0.12)', color: 'var(--success)'  },
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = ALL_POSTS.find((p) => p.slug === slug)
  if (!post) notFound()

  const ts = TYPE_STYLES[post.post_type]
  const related = ALL_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2)

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .post-hero {
          background: var(--navy-deep);
          padding-top: calc(var(--nav-height) + 80px);
          padding-bottom: 80px;
          position: relative; overflow: hidden;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .post-hero-glow {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 50% 60% at 90% 10%, rgba(219,103,39,0.09) 0%, transparent 55%),
            radial-gradient(ellipse 40% 50% at 5% 90%, rgba(74,111,165,0.07) 0%, transparent 50%);
        }
        .post-hero-grid {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.03;
          background-image:
            linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px);
          background-size: 72px 72px;
        }
        .post-hero-content { position: relative; z-index: 1; max-width: 800px; }
        .post-hero-meta {
          display: flex; align-items: center; gap: 12px;
          flex-wrap: wrap; margin-bottom: 24px;
          animation: fadeUp 0.6s ease both;
        }
        .post-type-badge {
          font-family: var(--font-mono); font-size: 8px;
          letter-spacing: 0.15em; text-transform: uppercase; padding: 4px 10px;
        }
        .post-date-meta {
          font-family: var(--font-mono); font-size: 9px;
          letter-spacing: 0.12em; color: var(--grey-mid);
        }
        .post-author-meta {
          font-family: var(--font-mono); font-size: 9px;
          letter-spacing: 0.12em; color: var(--grey-mid);
        }
        .post-title {
          font-family: var(--font-exo2); font-weight: 900;
          font-size: clamp(32px, 5vw, 64px);
          line-height: 1.0; letter-spacing: -2px;
          color: var(--white); margin-bottom: 24px;
          animation: fadeUp 0.7s ease both; animation-delay: 0.1s;
        }
        .post-excerpt {
          font-size: clamp(16px, 1.8vw, 20px); font-weight: 300;
          color: var(--grey-mid); line-height: 1.7;
          animation: fadeUp 0.7s ease both; animation-delay: 0.2s;
        }
        .post-content-section { background: var(--off-white); padding: var(--section-py) 0; }
        .post-content-grid {
          display: grid; grid-template-columns: 200px 1fr;
          gap: 80px; align-items: start;
        }
        .post-sidebar { position: sticky; top: calc(var(--nav-height) + 32px); }
        .post-sidebar-label {
          font-family: var(--font-mono); font-size: 9px;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--grey-mid); margin-bottom: 16px;
        }
        .post-tags { display: flex; flex-direction: column; gap: 8px; }
        .post-tag {
          font-family: var(--font-mono); font-size: 8.5px;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 5px 10px; border: 1px solid var(--grey-light);
          color: var(--grey-dark); display: inline-block;
        }
        .post-body { font-size: 17px; color: var(--grey-dark); line-height: 1.85; }
        .post-body p { margin-bottom: 24px; }
        .related-section { background: var(--navy-deep); padding: var(--section-py) 0; }
        .related-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 1px; background: rgba(255,255,255,0.06);
        }
        .related-card {
          background: var(--navy); padding: 32px;
          display: flex; flex-direction: column; gap: 14px;
          text-decoration: none; transition: background var(--transition-base);
          position: relative;
        }
        .related-card::before, .related-card::after {
          content: ''; position: absolute; width: 10px; height: 10px;
          border-color: rgba(219,103,39,0); border-style: solid;
          transition: border-color var(--transition-slow);
        }
        .related-card::before { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
        .related-card::after  { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }
        .related-card:hover { background: var(--navy-mid); }
        .related-card:hover::before,
        .related-card:hover::after { border-color: var(--orange); }
        .related-type {
          font-family: var(--font-mono); font-size: 8px;
          letter-spacing: 0.15em; text-transform: uppercase;
          padding: 3px 8px; display: inline-block; width: fit-content;
        }
        .related-title {
          font-family: var(--font-exo2); font-weight: 700;
          font-size: 18px; color: var(--white);
          letter-spacing: -0.2px; line-height: 1.3; flex: 1;
        }
        .related-meta { font-size: 12px; color: var(--grey-mid); }
        .related-arrow {
          font-size: 16px; color: var(--grey-dark); align-self: flex-end;
          transition: color var(--transition-base), transform var(--transition-base);
        }
        .related-card:hover .related-arrow { color: var(--orange); transform: translate(3px, -3px); }
        .back-link {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--font-mono); font-size: 9px;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--grey-mid); text-decoration: none;
          transition: color var(--transition-base); margin-bottom: 40px;
        }
        .back-link:hover { color: var(--orange); }
        .related-cta-row { border-top: 1px solid rgba(255,255,255,0.06); }
        .related-cta-row a { max-width: 100% !important; width: 100% !important; }
        @media (max-width: 900px) {
          .post-content-grid { grid-template-columns: 1fr; gap: 40px; }
          .post-sidebar { position: static; }
          .post-tags { flex-direction: row; flex-wrap: wrap; }
          .related-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <Navbar />

      <section className="post-hero">
        <div className="post-hero-glow" />
        <div className="post-hero-grid" />
        <div className="container">
          <Link href="/blog" className="back-link">← Back to blog</Link>
          <div className="post-hero-content">
            <div className="post-hero-meta">
              <span className="post-type-badge" style={{ background: ts.bg, color: ts.color }}>
                {TYPE_LABELS[post.post_type]}
              </span>
              <span className="post-date-meta">{post.published_at}</span>
              <span className="post-author-meta">{post.author}</span>
            </div>
            <h1 className="post-title">{post.title}</h1>
            <p className="post-excerpt">{post.excerpt}</p>
          </div>
        </div>
      </section>

      <section className="post-content-section">
        <div className="container">
          <div className="post-content-grid">
            <div className="post-sidebar">
              <div className="post-sidebar-label">Tags</div>
              <div className="post-tags">
                {post.tags.map((tag) => (
                  <span key={tag} className="post-tag">{tag}</span>
                ))}
              </div>
            </div>
            <div className="post-body">
              {post.content.split('\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="related-section">
          <div className="container">
            <div style={{ marginBottom: '40px' }}>
              <SectionTag label="More from the blog" />
              <h2 className="section-title">Keep reading.</h2>
            </div>
            <div className="related-grid">
              {related.map((p) => {
                const rs = TYPE_STYLES[p.post_type]
                return (
                  <Link key={p.slug} href={`/blog/${p.slug}`} className="related-card">
                    <span className="related-type" style={{ background: rs.bg, color: rs.color }}>
                      {TYPE_LABELS[p.post_type]}
                    </span>
                    <div className="related-title">{p.title}</div>
                    <div className="related-meta">{p.published_at} · {p.author}</div>
                    <span className="related-arrow">↗</span>
                  </Link>
                )
              })}
            </div>
            <div className="related-cta-row">
              <CTABox href="/blog" label="View all posts" variant="dark" fullWidth />
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  )
}
