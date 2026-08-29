'use client'

import { useEffect, useRef, useState } from 'react'
import Drawer from './Drawer'
import Badge from './Badge'
import { useDashboard } from './DashboardContext'
import { sendCopilotChat, getCopilotHistory, type CopilotHistoryMessage } from '@/app/dashboard/copilotActions'

/**
 * Mounted once at DashboardShell level (see DashboardShell.tsx) so any page
 * can open it via useDashboard().openCopilot(...) without embedding chat UI
 * per-page. Keeps the Applications detail panel from growing further, and
 * is ready to reuse for other domainTypes (venture_audit, code_review) the
 * backend already supports.
 */
export default function CopilotDrawer() {
  const { copilotTarget, closeCopilot } = useDashboard()
  const [history, setHistory] = useState<CopilotHistoryMessage[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [pastedText, setPastedText] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bodyEndRef = useRef<HTMLDivElement>(null)

  const open = !!copilotTarget

  useEffect(() => {
    if (!copilotTarget) return
    setHistory([])
    setError(null)
    setPrompt(copilotTarget.initialPrompt || '')
    setLoadingHistory(true)
    getCopilotHistory(copilotTarget.domainType, copilotTarget.resourceId)
      .then(({ history, error }) => {
        setHistory(history)
        if (error) setError(error)
      })
      .finally(() => setLoadingHistory(false))
  }, [copilotTarget?.domainType, copilotTarget?.resourceId])

  useEffect(() => {
    bodyEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, sending])

  async function handleSend() {
    if (!copilotTarget || (!prompt.trim() && !pastedText.trim())) return
    setSending(true)
    setError(null)

    const manualUrls = urlInput.split(',').map((u) => u.trim()).filter(Boolean)

    const result = await sendCopilotChat({
      domainType: copilotTarget.domainType,
      resourceId: copilotTarget.resourceId,
      reportId: copilotTarget.reportId,
      prompt: prompt.trim() || 'Please review the attached evidence.',
      pastedText: pastedText.trim() || undefined,
      manualUrls: manualUrls.length > 0 ? manualUrls : undefined,
    })

    setSending(false)

    if (result.error) {
      setError(result.error)
      return
    }

    setHistory((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        sender: 'recruiter',
        message_type: 'chat',
        content: prompt.trim(),
        created_at: new Date().toISOString(),
      },
      {
        id: `local-reply-${Date.now()}`,
        sender: 'copilot_agent',
        message_type: result.delta ? 'rescreen_trigger' : 'chat',
        content: result.reply || '',
        resulting_delta: result.delta as any,
        created_at: new Date().toISOString(),
      },
    ])
    setPrompt('')
    setPastedText('')
    setUrlInput('')
  }

  return (
    <Drawer
      open={open}
      onClose={closeCopilot}
      title={copilotTarget?.candidateName ? `Co-Pilot · ${copilotTarget.candidateName}` : 'Recruiter Co-Pilot'}
    >
      <style>{`
        .copilot-msg { padding: 10px 12px; margin-bottom: 10px; font-size: 12.5px; line-height: 1.5; }
        .copilot-msg.recruiter { background: rgba(219,103,39,0.08); border: 1px solid rgba(219,103,39,0.2); color: var(--white); }
        .copilot-msg.copilot_agent { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: var(--grey-light); }
        .copilot-msg-sender { font-family: var(--font-mono); font-size: 8.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--grey-mid); margin-bottom: 4px; display: block; }
        .copilot-delta-pill { margin-top: 8px; }
        .copilot-field-label { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--grey-mid); margin-bottom: 6px; display: block; }
        .copilot-input, .copilot-textarea {
          width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
          color: var(--white); padding: 8px 10px; font-size: 12.5px; font-family: var(--font-dm);
        }
        .copilot-textarea { resize: vertical; min-height: 60px; }
        .copilot-send-btn {
          background: var(--orange); color: var(--white); border: none; padding: 9px 16px;
          font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;
          cursor: pointer; transition: background 0.15s ease; width: 100%; margin-top: 10px;
        }
        .copilot-send-btn:hover:not(:disabled) { background: var(--orange-w); }
        .copilot-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .copilot-error { color: var(--error); font-size: 11.5px; margin-top: 8px; }
      `}</style>

      {!copilotTarget ? null : (
        <>
          <div style={{ marginBottom: '16px' }}>
            {loadingHistory ? (
              <div style={{ fontSize: '12px', color: 'var(--grey-mid)' }}>Loading conversation…</div>
            ) : history.length === 0 ? (
              <div style={{ fontSize: '12px', color: 'var(--grey-mid)' }}>
                No conversation yet. Paste blocked evidence, a verified link, or ask a question below to get started.
              </div>
            ) : (
              history.map((msg) => (
                <div key={msg.id} className={`copilot-msg ${msg.sender}`}>
                  <span className="copilot-msg-sender">{msg.sender.replace('_', ' ')}</span>
                  {msg.content}
                  {msg.resulting_delta && typeof (msg.resulting_delta as any).scoreDelta === 'number' && (
                    <div className="copilot-delta-pill">
                      <Badge variant={(msg.resulting_delta as any).scoreDelta >= 0 ? 'success' : 'error'}>
                        {(msg.resulting_delta as any).scoreDelta >= 0 ? '+' : ''}
                        {(msg.resulting_delta as any).scoreDelta} pts
                        {(msg.resulting_delta as any).newRecommendation ? ` · ${(msg.resulting_delta as any).newRecommendation}` : ''}
                      </Badge>
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={bodyEndRef} />
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>
            <label className="copilot-field-label">Paste blocked LinkedIn text, resume snippet, or candidate email</label>
            <textarea
              className="copilot-textarea"
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste text here…"
            />

            <label className="copilot-field-label" style={{ marginTop: '10px' }}>Verified links (comma-separated)</label>
            <input
              className="copilot-input"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://github.com/..., https://..."
            />

            <label className="copilot-field-label" style={{ marginTop: '10px' }}>Message to Co-Pilot</label>
            <textarea
              className="copilot-textarea"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Explain what you're providing and why…"
            />

            {error && <div className="copilot-error">{error}</div>}

            <button className="copilot-send-btn" onClick={handleSend} disabled={sending || (!prompt.trim() && !pastedText.trim())}>
              {sending ? 'Sending…' : 'Send to Co-Pilot'}
            </button>
          </div>
        </>
      )}
    </Drawer>
  )
}
