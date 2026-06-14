'use client'

import { useState } from 'react'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function CareersApplicationForm({ roleId }: { roleId?: string }) {
  const [formState, setFormState] = useState<FormState>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormState('submitting')

    const form     = e.currentTarget
    const formData = new FormData(form)

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
        .app-form { display: flex; flex-direction: column; gap: 16px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-label { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--grey-mid); }
        .form-input { background: var(--navy-mid); border: 1px solid rgba(255,255,255,0.08); color: var(--white); font-family: var(--font-dm); font-size: 14px; padding: 12px 16px; outline: none; transition: border-color 0.15s ease; width: 100%; }
        .form-input:focus { border-color: var(--orange); }
        .form-input::placeholder { color: var(--grey-dark); }
        .form-textarea { resize: vertical; min-height: 100px; }
        .form-submit { font-family: var(--font-dm); font-size: 14px; color: var(--white); background: var(--orange); border: 1px solid var(--orange); padding: 16px 24px; cursor: pointer; transition: background 0.15s ease; display: flex; align-items: center; justify-content: space-between; gap: 16px; width: 100%; }
        .form-submit:hover:not(:disabled) { background: var(--orange-f, #C4521A); }
        .form-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .app-error { padding: 10px 14px; font-size: 12px; background: rgba(232,69,69,0.08); border: 1px solid rgba(232,69,69,0.3); color: var(--error); }
        .app-success-overlay { position: fixed; inset: 0; z-index: 200; background: rgba(7,22,40,0.92); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 24px; }
        .app-success-modal { background: var(--navy); border: 1px solid rgba(255,255,255,0.08); padding: 56px 48px; max-width: 480px; width: 100%; position: relative; overflow: hidden; }
        .app-success-corner-tl { position: absolute; top: -1px; left: -1px; width: 20px; height: 20px; border-top: 2px solid var(--orange); border-left: 2px solid var(--orange); }
        .app-success-corner-br { position: absolute; bottom: -1px; right: -1px; width: 20px; height: 20px; border-bottom: 2px solid var(--orange); border-right: 2px solid var(--orange); }
        .app-success-icon { width: 56px; height: 56px; background: rgba(34,193,122,0.1); border: 1px solid rgba(34,193,122,0.2); display: flex; align-items: center; justify-content: center; font-size: 24px; color: var(--success); margin-bottom: 24px; }
        .app-success-title { font-family: var(--font-exo2); font-weight: 800; font-size: 32px; color: var(--white); letter-spacing: -1px; line-height: 1.05; margin-bottom: 16px; }
        .app-success-desc { font-size: 15px; color: var(--grey-mid); line-height: 1.75; margin-bottom: 32px; }
        .app-success-close { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; padding: 12px 24px; background: var(--orange); border: 1px solid var(--orange); color: var(--white); cursor: pointer; transition: background 0.15s ease; display: inline-flex; align-items: center; gap: 8px; }
        .app-success-close:hover { background: var(--orange-f, #C4521A); }
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
              <span>Close</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      <form className="app-form" onSubmit={handleSubmit} noValidate>
        {roleId && <input type="hidden" name="role_id" value={roleId} />}
        {formState === 'error' && (
          <div className="app-error">Something went wrong. Please try again.</div>
        )}
        <div className="form-group">
          <label className="form-label" htmlFor="name">Full name</label>
          <input className="form-input" id="name" name="name" type="text" placeholder="Your full name" required />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email address</label>
          <input className="form-input" id="email" name="email" type="email" placeholder="your@email.com" required />
        </div>
        {!roleId && (
          <div className="form-group">
            <label className="form-label" htmlFor="role_title">What you do</label>
            <input className="form-input" id="role_title" name="role_title" type="text" placeholder="e.g. Full-stack developer, Product designer" required />
          </div>
        )}
        <div className="form-group">
          <label className="form-label" htmlFor="cover_note">Why NexTrium</label>
          <textarea className="form-input form-textarea" id="cover_note" name="cover_note" placeholder="Tell us what you are working on and why you want to build with us." required />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="cv">CV / Resume (optional)</label>
          <input className="form-input" id="cv" name="cv" type="file" accept=".pdf,.doc,.docx"
            style={{ padding: '10px 16px', cursor: 'pointer', color: 'var(--grey-mid)' }} />
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