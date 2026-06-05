'use client'

import { useState } from 'react'
import Link from 'next/link'
import SectionTag from '@/components/shared/SectionTag'
import type { BlogPost } from './page'

type FilterType = 'all' | BlogPost['post_type']

const FILTERS: { value: FilterType; label: string }[] = [
  { value: 'all',            label: 'All'            },
  { value: 'editorial',      label: 'Editorial'      },
  { value: 'announcement',   label: 'Announcement'   },
  { value: 'product_update', label: 'Product Update' },
  { value: 'event_recap',    label: 'Event Recap'    },
  { value: 'research',       label: 'Research'       },
  { value: 'recruitment',    label: 'Recruitment'    },
]

const TYPE_LABELS: Record<BlogPost['post_type'], string> = {
  editorial:      'Editorial',
  announcement:   'Announcement',
  product_update: 'Product Update',
  event_recap:    'Event Recap',
  research:       'Research',
  recruitment:    'Recruitment',
}

const TYPE_STYLES: Record<BlogPost['post_type'], { bg: string; color: string }> = {
  editorial:      { bg: 'rgba(13,35,61,0.4)',    color: 'var(--grey-mid)' },
  announcement:   { bg: 'rgba(219,103,39,0.12)', color: 'var(--orange)'   },
  product_update: { bg: 'rgba(10,139,139,0.12)', color: 'var(--teal)'     },
  event_recap:    { bg: 'rgba(212,168,67,0.12)', color: 'var(--gold)'     },
  research:       { bg: 'rgba(74,111,165,0.12)', color: 'var(--slate)'    },
  recruitment:    { bg: 'rgba(34,193,122,0.12)', color: 'var(--success)'  },
}

interface BlogClientProps {
  posts: BlogPost[]
}

export default function BlogClient({ posts }: BlogClientProps) {
  const [active, setActive] = useState<FilterType>('all')

  const filtered = active === 'all'
    ? posts
    : posts.filter((p) => p.post_type === active)

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .blog-hero {
          background: var(--navy-deep);
          padding-top: calc(var(--nav-height) + 80px);
          padding-bottom: 80px;
          position: relative; overflow: hidden;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .blog-hero-glow {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 50% 60% at 90% 10%, rgba(219,103,39,0.09) 0%, transparent 55%),
            radial-gradient(ellipse 40% 50% at 5% 90%, rgba(74,111,165,0.07) 0%, transparent 50%);
        }
        .blog-hero-grid {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.03;
          background-image:
            linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px);
          background-size: 72px 72px;
        }
        .blog-hero-inner {
          position: relative; z-index: 1;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: end;
        }
        .blog-headline {
          font-family: var(--font-exo2); font-weight: 900;
          font-size: clamp(48px, 8vw, 88px);
          line-height: 0.95; letter-spacing: -2.5px;
          color: var(--white); margin-bottom: 0;
          animation: fadeUp 0.7s ease both; animation-delay: 0.1s;
        }
        .blog-headline em { font-style: normal; color: var(--orange); }
        .blog-hero-desc {
          font-weight: 300; font-size: clamp(15px, 1.6vw, 18px);
          color: var(--grey-mid); line-height: 1.75;
          animation: fadeUp 0.7s ease both; animation-delay: 0.25s;
          padding-bottom: 8px;
        }
        .blog-section { background: var(--navy-deep); padding: 80px 0; }
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
        .posts-list { display: flex; flex-direction: column; gap: 0; }
        .post-row {
          display: grid; grid-template-columns: 140px 1fr auto;
          align-items: center; gap: 40px; padding: 28px 0;
          border-bottom: 1px dashed rgba(255,255,255,0.08);
          text-decoration: none;
          transition: background var(--transition-base), padding-left var(--transition-base);
        }
        .post-row:first-child { border-top: 1px dashed rgba(255,255,255,0.08); }
        .post-row:hover { background: rgba(255,255,255,0.02); padding-left: 12px; }
        .post-date {
          font-family: var(--font-mono); font-size: 14px; font-weight: 700;
          color: var(--orange); letter-spacing: 0.02em; white-space: nowrap;
        }
        .post-title {
          font-family: var(--font-exo2); font-weight: 600;
          font-size: clamp(15px, 1.8vw, 18px); color: var(--white);
          line-height: 1.3; margin-bottom: 6px; letter-spacing: -0.2px;
        }
        .post-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .post-type-tag {
          font-family: var(--font-mono); font-size: 8px;
          letter-spacing: 0.12em; text-transform: uppercase; padding: 2px 7px;
        }
        .post-author { font-size: 12px; color: var(--grey-mid); }
        .post-arrow {
          font-size: 20px; color: var(--grey-dark); flex-shrink: 0;
          transition: color var(--transition-base), transform var(--transition-base);
        }
        .post-row:hover .post-arrow { color: var(--orange); transform: translate(3px, -3px); }
        .blog-empty { padding: 80px 0; text-align: center; }
        .blog-empty-title {
          font-family: var(--font-exo2); font-weight: 700;
          font-size: 22px; color: var(--white); margin-bottom: 12px;
        }
        .blog-empty-sub { font-size: 14px; color: var(--grey-mid); }
        @media (max-width: 900px) {
          .blog-hero-inner { grid-template-columns: 1fr; gap: 32px; }
          .post-row { grid-template-columns: 100px 1fr auto; gap: 20px; }
        }
        @media (max-width: 600px) {
          .post-row { grid-template-columns: 1fr auto; gap: 16px; }
          .post-date { display: none; }
          .filter-btn { padding: 8px 12px; font-size: 8px; }
        }
      `}</style>

      <section className="blog-hero">
        <div className="blog-hero-glow" />
        <div className="blog-hero-grid" />
        <div className="container">
          <div className="blog-hero-inner">
            <div>
              <SectionTag label="From the blog" />
              <h1 className="blog-headline">
                What we&apos;re<br /><em>thinking.</em>
              </h1>
            </div>
            <p className="blog-hero-desc">
              Product updates, announcements, event recaps, and research notes from the NexTrium team. Written by builders, for builders.
            </p>
          </div>
        </div>
      </section>

      <section className="blog-section">
        <div className="container">
          <div className="filter-bar" role="group" aria-label="Filter posts by type">
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
            <div className="blog-empty">
              <div className="blog-empty-title">No posts in this category yet.</div>
              <div className="blog-empty-sub">Check back soon or view all posts.</div>
            </div>
          ) : (
            <div className="posts-list">
              {filtered.map((post) => {
                const ts = TYPE_STYLES[post.post_type]
                return (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="post-row">
                    <span className="post-date">{post.published_at}</span>
                    <div>
                      <div className="post-title">{post.title}</div>
                      <div className="post-meta">
                        <span className="post-type-tag" style={{ background: ts.bg, color: ts.color }}>
                          {TYPE_LABELS[post.post_type]}
                        </span>
                        <span className="post-author">{post.author}</span>
                      </div>
                    </div>
                    <span className="post-arrow">↗</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
