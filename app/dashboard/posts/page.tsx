import { createClient } from '@/lib/supabase/server'
import Header from '@/components/dashboard/Header'
import Link from 'next/link'
import type { Post } from '@/lib/types/database'

export const metadata = { title: 'Posts' }

const TYPE_LABELS: Record<Post['post_type'], string> = {
  editorial:      'Editorial',
  announcement:   'Announcement',
  product_update: 'Product Update',
  event_recap:    'Event Recap',
  research:       'Research',
  recruitment:    'Recruitment',
}

const TYPE_STYLES: Record<Post['post_type'], { bg: string; color: string }> = {
  editorial:      { bg: 'rgba(138,155,176,0.1)', color: 'var(--grey-mid)' },
  announcement:   { bg: 'rgba(219,103,39,0.1)',  color: 'var(--orange)'   },
  product_update: { bg: 'rgba(10,139,139,0.1)',  color: 'var(--teal)'     },
  event_recap:    { bg: 'rgba(212,168,67,0.1)',  color: 'var(--gold)'     },
  research:       { bg: 'rgba(74,111,165,0.1)',  color: 'var(--slate)'    },
  recruitment:    { bg: 'rgba(34,193,122,0.1)',  color: 'var(--success)'  },
}

async function getPosts(): Promise<Post[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('posts')
    .select('*')
    .order('updated_at', { ascending: false })
  return data ?? []
}

export default async function PostsPage() {
  const posts = await getPosts()

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
        .post-title-cell { font-weight: 500; color: var(--white); max-width: 320px; }
        .post-title-cell a { text-decoration: none; color: inherit; transition: color 0.15s ease; }
        .post-title-cell a:hover { color: var(--orange); }
        .post-excerpt-cell { color: var(--grey-mid); font-size: 12px; max-width: 240px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .dash-badge { font-family: var(--font-mono); font-size: 7.5px; letter-spacing: 0.12em; text-transform: uppercase; padding: 3px 8px; display: inline-block; white-space: nowrap; }
        .badge-published { background: rgba(34,193,122,0.1); color: var(--success); border: 1px solid rgba(34,193,122,0.2); }
        .badge-draft     { background: rgba(138,155,176,0.1); color: var(--grey-mid); border: 1px solid rgba(138,155,176,0.2); }
        .dash-edit-link { font-family: var(--font-mono); font-size: 8px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--grey-mid); text-decoration: none; padding: 5px 10px; border: 1px solid rgba(255,255,255,0.08); transition: all 0.15s ease; display: inline-block; }
        .dash-edit-link:hover { color: var(--white); border-color: rgba(255,255,255,0.2); }
        .dash-empty-state { padding: 64px 32px; text-align: center; background: var(--navy); border: 1px solid rgba(255,255,255,0.06); }
        .dash-empty-title { font-family: var(--font-exo2); font-weight: 700; font-size: 20px; color: var(--white); margin-bottom: 8px; }
        .dash-empty-desc { font-size: 14px; color: var(--grey-mid); margin-bottom: 24px; }
      `}</style>

      <Header
        title="Posts"
        description="Manage blog posts, announcements and updates"
        action={
          <Link href="/dashboard/posts/new" className="dash-new-btn">+ New post</Link>
        }
      />

      <div className="dash-content">
        {posts.length === 0 ? (
          <div className="dash-empty-state">
            <div className="dash-empty-title">No posts yet.</div>
            <div className="dash-empty-desc">Create your first post to get started.</div>
            <Link href="/dashboard/posts/new" className="dash-new-btn">+ New post</Link>
          </div>
        ) : (
          <>
            <div className="dash-list-header">
              <span className="dash-list-count">{posts.length} post{posts.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Author</th>
                    <th>Status</th>
                    <th>Published</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => {
                    const ts = TYPE_STYLES[post.post_type]
                    return (
                      <tr key={post.slug}>
                        <td className="post-title-cell">
                          <Link href={`/dashboard/posts/${post.slug}`}>{post.title}</Link>
                          <div className="post-excerpt-cell">{post.excerpt}</div>
                        </td>
                        <td>
                          <span
                            className="dash-badge"
                            style={{ background: ts.bg, color: ts.color, border: `1px solid ${ts.color}33` }}
                          >
                            {TYPE_LABELS[post.post_type]}
                          </span>
                        </td>
                        <td style={{ color: 'var(--grey-mid)', fontSize: '12px' }}>{post.author}</td>
                        <td>
                          <span className={`dash-badge ${post.is_published ? 'badge-published' : 'badge-draft'}`}>
                            {post.is_published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td style={{ color: 'var(--grey-mid)', fontSize: '12px' }}>
                          {post.published_at
                            ? new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                            : '—'}
                        </td>
                        <td>
                          <Link href={`/dashboard/posts/${post.slug}`} className="dash-edit-link">Edit →</Link>
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