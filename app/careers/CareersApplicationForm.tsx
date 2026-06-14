'use client'

import { useState } from 'react'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

interface ProjectLink {
  url: string
  description: string
}

export default function CareersApplicationForm({
  roleId,
  roleTeam,
}: {
  roleId?: string
  roleTeam?: string
}) {
  const [formState, setFormState] = useState<FormState>('idle')
  const [projectLinks, setProjectLinks] = useState<ProjectLink[]>([{ url: '', description: '' }])

  const isEngineering     = roleTeam === 'Engineering'
  const isDesign          = roleTeam === 'Product and Design'
  const isResearch        = roleTeam === 'Research and Strategy'
  const isCommunity       = roleTeam === 'Community and Hub'
  const showProjectLinks  = isEngineering || isDesign || isResearch || isCommunity || !roleTeam

  function addProjectLink() {
    if (projectLinks.length < 3) {
      setProjectLinks([...projectLinks, { url: '', description: '' }])
    }
  }

  function updateProjectLink(index: number, field: 'url' | 'description', value: string) {
    const updated = [...projectLinks]
    updated[index][field] = value
    setProjectLinks(updated)
  }

  function removeProjectLink(index: number) {
    setProjectLinks(projectLinks.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormState('submitting')

    const form     = e.currentTarget
    const formData = new FormData(form)

    const validLinks = projectLinks.filter((l) => l.url.trim())
    validLinks.forEach((link, i) => {
      formData.append(`project_link_${i + 1}_url`, link.url)
      formData.append(`project_link_${i + 1}_desc`, link.description)
    })

    try {
      const res  = await fetch('/api/applications', { method: 'POST', body: formData })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Something went wrong.')
      setFormState('success')
    } catch (err) {
      setFormState('error')
      console.error(err)
    }
  }

  return (
    <>
      <style>{`
        .app-form { display: flex; flex-direction: column; gap: 20px; }
        .form-section-title { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--orange); padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.06); margin-bottom: 4px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-label { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--grey-mid); }
        .form-label-optional { font-family: var(--font-mono); font-size: 8px; letter-spacing: 0.12em; color: var(--grey-dark); margin-left: 8px; }
        .form-input { background: var(--navy-mid); border: 1px solid rgba(255,255,255,0.08); color: var(--white); font-family: var(--font-dm); font-size: 14px; padding: 12px 16px; outline: none; transition: border-color 0.15s ease; width: 100%; }
        .form-input:focus { border-color: var(--orange); }
        .form-input::placeholder { color: var(--grey-dark); }
        .form-textarea { resize: vertical; min-height: 100px; }
        .form-submit { font-family: var(--font-dm); font-size: 14px; color: var(--white); background: var(--orange); border: 1px solid var(--orange); padding: 16px 24px; cursor: pointer; transition: background 0.15s ease; display: flex; align-items: center; justify-content: space-between; gap: 16px; width: 100%; }
        .form-submit:hover:not(:disabled) { background: var(--orange-f, #C4521A); }
        .form-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .app-error { padding: 10px 14px; font-size: 12px; background: rgba(232,69,69,0.08); border: 1px solid rgba(232,69,69,0.3); color: var(--error); }
        .project-link-item { display: flex; flex-direction: column; gap: 8px; padding: 16px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); }
        .project-link-header { display: flex; align-items: center; justify-content: space-between; }
        .project-link-label { font-family: var(--font-mono); font-size: 8px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--grey-mid); }
        .project-link-remove { font-family: var(--font-mono); font-size: 8px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--error); background: none; border: none; cursor: pointer; padding: 0; }
        .add-link-btn { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--orange); background: none; border: 1px solid rgba(219,103,39,0.3); padding: 8px 16px; cursor: pointer; transition: all 0.15s ease; align-self: flex-start; }
        .add-link-btn:hover { background: rgba(219,103,39,0.08); border-color: var(--orange); }
        .add-link-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .app-success-overlay { position: fixed; inset: 0; z-index: 200; background: rgba(7,22,40,0.92); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 24px; }
        .app-success-modal { background: var(--navy); border: 1px solid rgba(255,255,255,0.08); padding: 56px 48px; max-width: 480px; width: 100%; position: relative; overflow: hidden; }
        .app-success-corner-tl { position: absolute; top: -1px; left: -1px; width: 20px; height: 20px; border-top: 2px solid var(--orange); border-left: 2px solid var(--orange); }
        .app-success-corner-br { position: absolute; bottom: -1px; right: -1px; width: 20px; height: 20px; border-bottom: 2px solid var(--orange); border-right: 2px solid var(--orange); }
        .app-success-icon { width: 56px; height: 56px; background: rgba(34,193,122,0.1); border: 1px solid rgba(34,193,122,0.2); display: flex; align-items: center; justify-content: center; font-size: 24px; color: var(--success); margin-bottom: 24px; }
        .app-success-title { font-family: var(--font-exo2); font-weight: 800; font-size: 32px; color: var(--white); letter-spacing: -1px; line-height: 1.05; margin-bottom: 16px; }
        .app-success-desc { font-size: 15px; color: var(--grey-mid); line-height: 1.75; margin-bottom: 32px; }
        .app-success-close { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; padding: 12px 24px; background: var(--orange); border: 1px solid var(--orange); color: var(--white); cursor: pointer; transition: background 0.15s ease; display: inline-flex; align-items: center; gap: 8px; }
        .app-success-close:hover { background: var(--orange-f, #C4521A); }
        @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }
      `}</style>

      {formState === 'success' && (
        <div className="app-success-overlay" onClick={() => setFormState('idle')}>
          <div className="app-success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="app-success-corner-tl" />
            <div className="app-success-corner-br" />
            <div className="app-success-icon">✓</div>
            <div className="app-success-title">Application received.</div>
            <p className="app-success-desc">
              We read every application and respond to everyone within two weeks. We will be in touch.
            </p>
            <button type="button" className="app-success-close" onClick={() => setFormState('idle')}>
              <span>Close</span><span>→</span>
            </button>
          </div>
        </div>
      )}

      <form className="app-form" onSubmit={handleSubmit} noValidate>
        {roleId && <input type="hidden" name="role_id" value={roleId} />}

        {formState === 'error' && (
          <div className="app-error">Something went wrong. Please try again.</div>
        )}

        {/* Section 1 -- About you */}
        <div className="form-section-title">About you</div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full name</label>
            <input className="form-input" id="name" name="name" type="text" placeholder="Your full name" required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email address</label>
            <input className="form-input" id="email" name="email" type="email" placeholder="your@email.com" required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="phone">Phone number <span className="form-label-optional">optional</span></label>
            <input className="form-input" id="phone" name="phone" type="tel" placeholder="+234 800 000 0000" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="location">Location</label>
            <input className="form-input" id="location" name="location" type="text" placeholder="City, Country" required />
          </div>
        </div>

        {!roleId && (
          <div className="form-group">
            <label className="form-label" htmlFor="role_title">What you do</label>
            <input className="form-input" id="role_title" name="role_title" type="text" placeholder="e.g. Full-stack developer, Product designer" required />
          </div>
        )}

        {/* Section 2 -- Your work */}
        <div className="form-section-title" style={{ marginTop: '8px' }}>Your work</div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="linkedin_url">LinkedIn <span className="form-label-optional">optional</span></label>
            <input className="form-input" id="linkedin_url" name="linkedin_url" type="url" placeholder="https://linkedin.com/in/..." />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="portfolio_url">Portfolio or website <span className="form-label-optional">optional</span></label>
            <input className="form-input" id="portfolio_url" name="portfolio_url" type="url" placeholder="https://yoursite.com" />
          </div>
        </div>

        {isEngineering && (
          <div className="form-group">
            <label className="form-label" htmlFor="github_url">GitHub profile <span className="form-label-optional">optional</span></label>
            <input className="form-input" id="github_url" name="github_url" type="url" placeholder="https://github.com/yourusername" />
          </div>
        )}

        {isDesign && (
          <div className="form-group">
            <label className="form-label" htmlFor="design_url">Behance, Dribbble, or Figma community <span className="form-label-optional">optional</span></label>
            <input className="form-input" id="design_url" name="design_url" type="url" placeholder="https://behance.net/..." />
          </div>
        )}

        {isResearch && (
          <div className="form-group">
            <label className="form-label" htmlFor="published_work_url">Link to published work <span className="form-label-optional">optional</span></label>
            <input className="form-input" id="published_work_url" name="published_work_url" type="url" placeholder="Article, report, paper, or blog post" />
          </div>
        )}

        {showProjectLinks && (
          <div className="form-group">
            <label className="form-label">Relevant project links <span className="form-label-optional">up to 3, optional</span></label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {projectLinks.map((link, i) => (
                <div key={i} className="project-link-item">
                  <div className="project-link-header">
                    <span className="project-link-label">Project {i + 1}</span>
                    {projectLinks.length > 1 && (
                      <button type="button" className="project-link-remove" onClick={() => removeProjectLink(i)}>Remove</button>
                    )}
                  </div>
                  <input
                    className="form-input"
                    type="url"
                    placeholder="https://github.com/... or https://project.com"
                    value={link.url}
                    onChange={(e) => updateProjectLink(i, 'url', e.target.value)}
                  />
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Brief description of what this is and your role in it"
                    value={link.description}
                    onChange={(e) => updateProjectLink(i, 'description', e.target.value)}
                  />
                </div>
              ))}
              {projectLinks.length < 3 && (
                <button type="button" className="add-link-btn" onClick={addProjectLink}>
                  + Add another project
                </button>
              )}
            </div>
          </div>
        )}

        {/* Section 3 -- Your application */}
        <div className="form-section-title" style={{ marginTop: '8px' }}>Your application</div>

        <div className="form-group">
          <label className="form-label" htmlFor="cover_note">Why NexTrium</label>
          <textarea
            className="form-input form-textarea"
            id="cover_note"
            name="cover_note"
            placeholder="Tell us what draws you to NexTrium and why this role fits where you are going."
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="currently_building">What you are currently learning or building</label>
          <textarea
            className="form-input form-textarea"
            id="currently_building"
            name="currently_building"
            placeholder="This can be a personal project, a course, a community you are part of, or anything that shows where your energy is going right now."
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cv">CV or resume <span className="form-label-optional">optional</span></label>
          <input
            className="form-input"
            id="cv"
            name="cv"
            type="file"
            accept=".pdf,.doc,.docx"
            style={{ padding: '10px 16px', cursor: 'pointer', color: 'var(--grey-mid)' }}
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="pledge_consent"
              required
              style={{ marginTop: '3px', accentColor: 'var(--orange)', width: '16px', height: '16px', flexShrink: 0, cursor: 'pointer' }}
            />
            <span style={{ fontSize: '13px', color: 'var(--grey-mid)', lineHeight: 1.6 }}>
              I have read the NexTrium Contributor Pledge and confirm all six points above. I understand this is a Founding Team Contributor role with deferred compensation and no co-founder status.
            </span>
          </label>
        </div>

        <button type="submit" className="form-submit" disabled={formState === 'submitting'}>
          <span>{formState === 'submitting' ? 'Sending...' : 'Send application'}</span>
          <span>{formState === 'submitting' ? '...' : '→'}</span>
        </button>
      </form>
    </>
  )
}