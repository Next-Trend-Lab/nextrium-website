'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Application, AgentScreeningResult } from '@/lib/types/database'
import { deleteApplication, screenCandidateAction } from './actions'

interface EmailSender {
  id: string
  name: string
  email: string
  is_default: boolean
}

interface ApplicationsClientProps {
  applications: Application[]
  senders: EmailSender[]
  initialScreeningResults?: Record<string, AgentScreeningResult>
}

const STATUS_OPTIONS: Application['status'][] = ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted']

const STATUS_STYLES: Record<Application['status'], { bg: string; color: string }> = {
  pending:     { bg: 'rgba(219,103,39,0.1)',  color: 'var(--orange)'  },
  reviewed:    { bg: 'rgba(74,111,165,0.1)',  color: 'var(--slate)'   },
  shortlisted: { bg: 'rgba(212,168,67,0.1)',  color: 'var(--gold)'    },
  rejected:    { bg: 'rgba(232,69,69,0.1)',   color: 'var(--error)'   },
  accepted:    { bg: 'rgba(34,193,122,0.1)',  color: 'var(--success)' },
}

function getScoreColor(score: number): { color: string; bg: string; border: string } {
  if (score >= 85) return { color: '#22c17a', bg: 'rgba(34,193,122,0.1)', border: 'rgba(34,193,122,0.3)' }
  if (score >= 70) return { color: '#d4a843', bg: 'rgba(212,168,67,0.1)', border: 'rgba(212,168,67,0.3)' }
  if (score >= 50) return { color: '#4a6fa5', bg: 'rgba(74,111,165,0.1)', border: 'rgba(74,111,165,0.3)' }
  return { color: '#e84545', bg: 'rgba(232,69,69,0.1)', border: 'rgba(232,69,69,0.3)' }
}

export default function ApplicationsClient({
  applications: initial,
  senders,
  initialScreeningResults = {},
}: ApplicationsClientProps) {
  const [applications, setApplications] = useState(initial)
  const [selected,     setSelected]     = useState<Application | null>(null)
  const [updating,     setUpdating]     = useState(false)
  const [deleting,      setDeleting]      = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  // AI Screening state
  const [screeningResults, setScreeningResults] = useState<Record<string, AgentScreeningResult>>(initialScreeningResults)
  const [screeningId,      setScreeningId]      = useState<string | null>(null)
  const [batchScreening,   setBatchScreening]   = useState(false)
  const [batchProgress,    setBatchProgress]    = useState<{ current: number; total: number } | null>(null)
  const [screeningError,   setScreeningError]   = useState<string | null>(null)
  const [copiedQuestion,   setCopiedQuestion]   = useState<number | null>(null)
  const [showQuestions,    setShowQuestions]    = useState(false)

  const defaultSender = senders.find((s) => s.is_default) ?? senders[0]

  const [emailOpen,          setEmailOpen]          = useState(false)
  const [emailSenderId,      setEmailSenderId]      = useState(defaultSender?.id ?? '')
  const [emailSubject,       setEmailSubject]       = useState('')
  const [emailMessage,       setEmailMessage]       = useState('')
  const [emailSending,       setEmailSending]       = useState(false)
  const [emailResult,        setEmailResult]        = useState<'success' | 'error' | null>(null)
  const [emailAttachFiles,   setEmailAttachFiles]   = useState<{ name: string; content: string }[]>([])

  async function updateStatus(id: string, status: Application['status']) {
    setUpdating(true)
    const supabase = createClient()
    const { error } = await (supabase.from('applications') as any)
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (!error) {
      setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status } : a))
      if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : null)
    }
    setUpdating(false)
  }

  async function handleDelete(id: string) {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    setDeleting(true)
    const { error } = await deleteApplication(id)
    if (!error) {
      setApplications((prev) => prev.filter((a) => a.id !== id))
      setSelected(null)
      setConfirmDelete(false)
    }
    setDeleting(false)
  }

  async function handleEmailFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const encoded = await Promise.all(
      files.map((file) => new Promise<{ name: string; content: string }>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1]
          resolve({ name: file.name, content: base64 })
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      }))
    )
    setEmailAttachFiles((prev) => [...prev, ...encoded])
  }

  function removeEmailFile(index: number) {
    setEmailAttachFiles((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleScreenCandidate(appId: string, force: boolean = false) {
    setScreeningId(appId)
    setScreeningError(null)
    try {
      const res = await screenCandidateAction(appId, force)
      if (res.error) {
        setScreeningError(res.error)
      } else if (res.screeningRecord) {
        setScreeningResults((prev) => ({ ...prev, [appId]: res.screeningRecord! }))
        const targetStatus = res.screeningRecord.composite_score >= 85 ? 'shortlisted' : 'reviewed'
        setApplications((prev) =>
          prev.map((a) => (a.id === appId ? { ...a, status: targetStatus as any } : a))
        )
        if (selected?.id === appId) {
          setSelected((prev) => (prev ? { ...prev, status: targetStatus as any } : null))
        }
      }
    } catch (err: any) {
      setScreeningError(err.message || 'Screening failed')
    } finally {
      setScreeningId(null)
    }
  }

  async function handleBatchScreen() {
    const unscanned = applications.filter((a) => !screeningResults[a.id])
    if (unscanned.length === 0) return

    setBatchScreening(true)
    setBatchProgress({ current: 0, total: unscanned.length })

    for (let i = 0; i < unscanned.length; i++) {
      const app = unscanned[i]
      setBatchProgress({ current: i + 1, total: unscanned.length })
      await handleScreenCandidate(app.id, false)
    }

    setBatchScreening(false)
    setBatchProgress(null)
  }

  function handleLoadFeedbackToEmail(screening: AgentScreeningResult) {
    if (!selected) return
    const consensus = (screening.full_result as any)?.consensus || screening.full_result
    const letter = consensus?.applicantFeedbackLetter
    if (!letter) return

    setEmailSubject(letter.subject || `Update regarding your application for ${selected.role_title || 'Role'} at Nextrium`)

    const strengthsText = Array.isArray(letter.verifiedStrengthsHighlighted) && letter.verifiedStrengthsHighlighted.length > 0
      ? `\n\nVerified Strengths Highlighted:\n${letter.verifiedStrengthsHighlighted.map((s: string) => `• ${s}`).join('\n')}`
      : ''

    const growthText = Array.isArray(letter.growthOpportunitiesAndGaps) && letter.growthOpportunitiesAndGaps.length > 0
      ? `\n\nAreas for Development & Next Steps:\n${letter.growthOpportunitiesAndGaps.map((g: string) => `• ${g}`).join('\n')}`
      : ''

    const formattedMessage = `${letter.greeting || `Hi ${selected.name.split(' ')[0]},`}\n\n${letter.executiveFeedback || ''}${strengthsText}${growthText}\n\n${letter.closingNote || 'Best regards,\nNextrium Talent Team'}`

    setEmailMessage(formattedMessage)
    setEmailOpen(true)
    setEmailResult(null)
  }

  function handleCopyQuestion(text: string, index: number) {
    navigator.clipboard.writeText(text)
    setCopiedQuestion(index)
    setTimeout(() => setCopiedQuestion(null), 2000)
  }

  async function handleSendEmail() {
    if (!selected) return
    setEmailSending(true)
    setEmailResult(null)

    try {
      const res  = await fetch('/api/email', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          subject:         emailSubject,
          message:         emailMessage,
          recipients:      [{ name: selected.name, email: selected.email, role: selected.role_title ?? '' }],
          sender_id:       emailSenderId,
          fileAttachments: emailAttachFiles,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to send.')
      setEmailResult('success')
      setEmailSubject('')
      setEmailMessage('')
      setEmailAttachFiles([])
    } catch {
      setEmailResult('error')
    } finally {
      setEmailSending(false)
    }
  }

  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = applications.filter((a) => a.status === s).length
    return acc
  }, {} as Record<Application['status'], number>)

  const unscannedCount = applications.filter((a) => !screeningResults[a.id]).length
  const selectedScreening = selected ? screeningResults[selected.id] : null
  const selectedConsensus = selectedScreening ? ((selectedScreening.full_result as any)?.consensus || selectedScreening.full_result) : null

  return (
    <>
      <style>{`
        .apps-layout { display: grid; grid-template-columns: 1fr 480px; gap: 24px; align-items: start; }
        .apps-panel { background: var(--navy); border: 1px solid rgba(255,255,255,0.06); }
        .apps-count-row { display: flex; gap: 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .apps-count-item { flex: 1; padding: 12px 8px; text-align: center; border-right: 1px solid rgba(255,255,255,0.04); }
        .apps-count-item:last-child { border-right: none; }
        .apps-count-num { font-family: var(--font-exo2); font-weight: 800; font-size: 20px; color: var(--white); line-height: 1; }
        .apps-count-label { font-family: var(--font-mono); font-size: 7px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--grey-dark); margin-top: 4px; }
        
        .ai-banner-bar { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; background: rgba(34,193,122,0.04); border-bottom: 1px solid rgba(255,255,255,0.06); }
        .ai-banner-text { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; color: #22c17a; display: flex; align-items: center; gap: 6px; }
        .ai-batch-btn { padding: 5px 10px; font-family: var(--font-mono); font-size: 8px; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; border: 1px solid rgba(34,193,122,0.3); background: rgba(34,193,122,0.08); color: #22c17a; transition: all 0.15s ease; }
        .ai-batch-btn:hover:not(:disabled) { background: #22c17a; color: var(--navy); }
        .ai-batch-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .app-row { padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.04); cursor: pointer; transition: background 0.15s ease; }
        .app-row:last-child { border-bottom: none; }
        .app-row:hover { background: rgba(255,255,255,0.03); }
        .app-row.selected { background: rgba(219,103,39,0.06); border-left: 2px solid var(--orange); }
        .app-row-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 4px; }
        .app-name { font-size: 14px; color: var(--white); font-weight: 500; }
        .app-role { font-size: 11px; color: var(--grey-mid); margin-bottom: 4px; }
        .app-date { font-size: 10px; color: var(--grey-dark); font-family: var(--font-mono); }
        .dash-badge { font-family: var(--font-mono); font-size: 7.5px; letter-spacing: 0.12em; text-transform: uppercase; padding: 3px 8px; display: inline-block; white-space: nowrap; }
        .ai-score-badge { font-family: var(--font-mono); font-size: 7.5px; letter-spacing: 0.12em; text-transform: uppercase; padding: 3px 8px; display: inline-block; white-space: nowrap; margin-left: 6px; }

        .detail-panel { background: var(--navy); border: 1px solid rgba(255,255,255,0.06); position: sticky; top: 24px; max-height: calc(100vh - 48px); overflow-y: auto; }
        .detail-header { padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .detail-name { font-family: var(--font-exo2); font-weight: 700; font-size: 18px; color: var(--white); letter-spacing: -0.3px; margin-bottom: 4px; }
        .detail-email { font-size: 13px; color: var(--orange); }
        .detail-body { padding: 20px; display: flex; flex-direction: column; gap: 20px; }
        .detail-section-title { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--grey-mid); margin-bottom: 8px; }
        .detail-text { font-size: 13px; color: var(--off-white); line-height: 1.7; }
        .detail-status-row { display: flex; flex-direction: column; gap: 6px; }
        .status-select-btn { padding: 9px 14px; font-family: var(--font-mono); font-size: 8px; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); background: none; color: var(--grey-mid); transition: all 0.15s ease; text-align: left; display: flex; align-items: center; justify-content: space-between; }
        .status-select-btn:hover { color: var(--white); border-color: rgba(255,255,255,0.2); }
        .status-select-btn.active { border-color: var(--orange); color: var(--white); background: rgba(219,103,39,0.08); }
        .status-select-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .detail-empty { padding: 48px 24px; text-align: center; font-size: 13px; color: var(--grey-dark); }
        .apps-empty-state { padding: 64px 32px; text-align: center; background: var(--navy); border: 1px solid rgba(255,255,255,0.06); }
        .apps-empty-title { font-family: var(--font-exo2); font-weight: 700; font-size: 20px; color: var(--white); margin-bottom: 8px; }
        .apps-empty-desc { font-size: 14px; color: var(--grey-mid); }

        /* AI Scorecard Styles */
        .ai-box { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); padding: 16px; display: flex; flex-direction: column; gap: 14px; }
        .ai-box-header { display: flex; align-items: center; justify-content: space-between; }
        .ai-box-title { font-family: var(--font-mono); font-size: 9.5px; letter-spacing: 0.15em; text-transform: uppercase; color: #22c17a; display: flex; align-items: center; gap: 6px; }
        .ai-score-bar-bg { width: 100%; height: 6px; background: rgba(255,255,255,0.06); overflow: hidden; margin: 6px 0; }
        .ai-score-bar-fill { height: 100%; transition: width 0.4s ease; }
        .ai-quote-box { padding: 12px 14px; background: rgba(255,255,255,0.02); border-left: 2px solid #22c17a; font-size: 12.5px; color: var(--off-white); line-height: 1.6; }
        .rubric-row { display: flex; align-items: center; justify-content: space-between; font-size: 11.5px; margin-bottom: 4px; }
        .rubric-label { color: var(--grey-mid); }
        .rubric-val { font-family: var(--font-mono); font-size: 10.5px; color: var(--white); }
        .q-card { padding: 10px 12px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); }
        
        @media (max-width: 1200px) { .apps-layout { grid-template-columns: 1fr; } .detail-panel { position: static; max-height: none; } }
      `}</style>

      {applications.length === 0 ? (
        <div className="apps-empty-state">
          <div className="apps-empty-title">No applications yet.</div>
          <div className="apps-empty-desc">Applications submitted through the careers page will appear here.</div>
        </div>
      ) : (
        <div className="apps-layout">
          <div className="apps-panel">
            <div className="apps-count-row">
              {STATUS_OPTIONS.map((s) => {
                const ss = STATUS_STYLES[s]
                return (
                  <div key={s} className="apps-count-item">
                    <div className="apps-count-num" style={{ color: ss.color }}>{counts[s]}</div>
                    <div className="apps-count-label">{s}</div>
                  </div>
                )
              })}
            </div>

            <div className="ai-banner-bar">
              <div className="ai-banner-text">
                <span>⚡ AI Talent Screening Engine</span>
                {batchScreening && batchProgress && (
                  <span style={{ color: 'var(--white)', fontSize: '9px' }}>
                    ({batchProgress.current}/{batchProgress.total} evaluated)
                  </span>
                )}
              </div>
              {unscannedCount > 0 ? (
                <button
                  type="button"
                  onClick={handleBatchScreen}
                  disabled={batchScreening || screeningId !== null}
                  className="ai-batch-btn"
                >
                  {batchScreening ? 'Screening in progress...' : `⚡ Auto-Screen All (${unscannedCount})`}
                </button>
              ) : (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: '#22c17a', letterSpacing: '0.1em' }}>
                  ✓ All Screened
                </span>
              )}
            </div>

            {applications.map((app) => {
              const ss = STATUS_STYLES[app.status]
              const screening = screeningResults[app.id]
              const scoreConfig = screening ? getScoreColor(screening.composite_score) : null

              return (
                <div
                  key={app.id}
                  className={`app-row ${selected?.id === app.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelected(app)
                    setConfirmDelete(false)
                    setEmailOpen(false)
                    setEmailResult(null)
                    setEmailAttachFiles([])
                    setScreeningError(null)
                  }}
                >
                  <div className="app-row-top">
                    <span className="app-name">{app.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span className="dash-badge" style={{ background: ss.bg, color: ss.color, border: `1px solid ${ss.color}33` }}>
                        {app.status}
                      </span>
                      {screening ? (
                        <span
                          className="ai-score-badge"
                          style={{
                            background: scoreConfig?.bg,
                            color: scoreConfig?.color,
                            border: `1px solid ${scoreConfig?.border}`,
                          }}
                        >
                          ⚡ {screening.composite_score}%
                        </span>
                      ) : (
                        <span
                          className="ai-score-badge"
                          style={{
                            background: 'rgba(255,255,255,0.03)',
                            color: 'var(--grey-dark)',
                            border: '1px solid rgba(255,255,255,0.06)',
                          }}
                        >
                          Unscreened
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="app-role">{app.role_title ?? 'Open application'}</div>
                  <div className="app-date">{new Date(app.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </div>
              )
            })}
          </div>

          <div className="detail-panel">
            {selected ? (
              <>
                <div className="detail-header">
                  <div className="detail-name">{selected.name}</div>
                  <div className="detail-email">{selected.email}</div>
                </div>
                <div className="detail-body">

                  {/* AI AGENT SCREENING SECTION */}
                  <div className="ai-box">
                    <div className="ai-box-header">
                      <div className="ai-box-title">
                        <span>⚡ AI Consensus Evaluation</span>
                      </div>
                      {selectedScreening && (
                        <button
                          type="button"
                          onClick={() => handleScreenCandidate(selected.id, true)}
                          disabled={screeningId === selected.id}
                          style={{
                            background: 'none',
                            border: 'none',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '8px',
                            color: 'var(--grey-mid)',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                          }}
                        >
                          {screeningId === selected.id ? 'Rescanning...' : '🔄 Rescan'}
                        </button>
                      )}
                    </div>

                    {screeningError && (
                      <div style={{ padding: '8px 12px', background: 'rgba(232,69,69,0.1)', border: '1px solid rgba(232,69,69,0.3)', color: 'var(--error)', fontSize: '11px' }}>
                        {screeningError}
                      </div>
                    )}

                    {screeningId === selected.id ? (
                      <div style={{ padding: '24px 12px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ fontSize: '13px', color: '#22c17a', fontWeight: 600 }}>
                          Evaluating candidate...
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--grey-mid)' }}>
                          Running dual-layer consensus (Gemini 2.0 Flash + Live Artifact Verifier)
                        </div>
                      </div>
                    ) : selectedScreening && selectedConsensus ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {/* Score Bar & Tier */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                              <span style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-exo2)', color: getScoreColor(selectedScreening.composite_score).color }}>
                                {selectedScreening.composite_score}%
                              </span>
                              <span style={{ fontSize: '11px', color: 'var(--grey-mid)' }}>Match Score</span>
                            </div>
                            <span
                              style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '8px',
                                textTransform: 'uppercase',
                                padding: '3px 8px',
                                background: getScoreColor(selectedScreening.composite_score).bg,
                                color: getScoreColor(selectedScreening.composite_score).color,
                                border: `1px solid ${getScoreColor(selectedScreening.composite_score).border}`,
                              }}
                            >
                              {selectedScreening.recommendation}
                            </span>
                          </div>

                          <div className="ai-score-bar-bg">
                            <div
                              className="ai-score-bar-fill"
                              style={{
                                width: `${selectedScreening.composite_score}%`,
                                background: getScoreColor(selectedScreening.composite_score).color,
                              }}
                            />
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--grey-mid)', marginTop: '4px' }}>
                            Tier: <strong style={{ color: 'var(--white)' }}>{selectedScreening.consensus_tier}</strong>
                          </div>
                        </div>

                        {/* Executive Summary */}
                        {selectedConsensus.recruiterConsensusSummary && (
                          <div className="ai-quote-box">
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', textTransform: 'uppercase', color: '#22c17a', marginBottom: '4px', letterSpacing: '0.1em' }}>
                              Recruiter Briefing
                            </div>
                            {selectedConsensus.recruiterConsensusSummary}
                          </div>
                        )}

                        {/* Rubric Breakdown */}
                        {selectedConsensus.layer1ResumeScorecard?.rubricBreakdown && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '10px 12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)' }}>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', textTransform: 'uppercase', color: 'var(--grey-mid)', marginBottom: '4px', letterSpacing: '0.1em' }}>
                              Rubric Assessment Matrix
                            </div>
                            {Object.entries(selectedConsensus.layer1ResumeScorecard.rubricBreakdown).map(([key, item]: [string, any]) => (
                              <div key={key}>
                                <div className="rubric-row">
                                  <span className="rubric-label">{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</span>
                                  <span className="rubric-val">{item.score}/{item.weight}</span>
                                </div>
                                <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.04)', overflow: 'hidden' }}>
                                  <div style={{ width: `${(item.score / item.weight) * 100}%`, height: '100%', background: '#22c17a' }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Core Strengths & Red Flags */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                          {Array.isArray(selectedConsensus.layer1ResumeScorecard?.coreStrengths) && selectedConsensus.layer1ResumeScorecard.coreStrengths.length > 0 && (
                            <div style={{ padding: '10px 12px', background: 'rgba(34,193,122,0.04)', border: '1px solid rgba(34,193,122,0.15)' }}>
                              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', textTransform: 'uppercase', color: '#22c17a', marginBottom: '6px', letterSpacing: '0.1em' }}>
                                ✓ Verified Strengths
                              </div>
                              <ul style={{ margin: 0, paddingLeft: '14px', fontSize: '11.5px', color: 'var(--off-white)', lineHeight: '1.6' }}>
                                {selectedConsensus.layer1ResumeScorecard.coreStrengths.map((s: string, idx: number) => (
                                  <li key={idx}>{s}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {Array.isArray(selectedConsensus.layer1ResumeScorecard?.gapsAndRedFlags) && selectedConsensus.layer1ResumeScorecard.gapsAndRedFlags.length > 0 && (
                            <div style={{ padding: '10px 12px', background: 'rgba(232,69,69,0.04)', border: '1px solid rgba(232,69,69,0.2)' }}>
                              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', textTransform: 'uppercase', color: 'var(--error)', marginBottom: '6px', letterSpacing: '0.1em' }}>
                                ⚠ Gaps / Considerations
                              </div>
                              <ul style={{ margin: 0, paddingLeft: '14px', fontSize: '11.5px', color: 'var(--off-white)', lineHeight: '1.6' }}>
                                {selectedConsensus.layer1ResumeScorecard.gapsAndRedFlags.map((g: string, idx: number) => (
                                  <li key={idx}>{g}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Tailored Interview Questions */}
                        {Array.isArray(selectedConsensus.combinedInterviewQuestions) && selectedConsensus.combinedInterviewQuestions.length > 0 && (
                          <div>
                            <button
                              type="button"
                              onClick={() => setShowQuestions(!showQuestions)}
                              style={{
                                width: '100%',
                                padding: '8px 10px',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                color: 'var(--white)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '8px',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}
                            >
                              <span>Tailored Interview Questions ({selectedConsensus.combinedInterviewQuestions.length})</span>
                              <span>{showQuestions ? '▲ Hide' : '▼ View'}</span>
                            </button>

                            {showQuestions && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                                {selectedConsensus.combinedInterviewQuestions.map((q: any, qIdx: number) => (
                                  <div key={qIdx} className="q-card">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7.5px', textTransform: 'uppercase', color: 'var(--orange)' }}>
                                        {q.category}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleCopyQuestion(q.question, qIdx)}
                                        style={{ background: 'none', border: 'none', color: copiedQuestion === qIdx ? '#22c17a' : 'var(--grey-mid)', fontSize: '10px', cursor: 'pointer' }}
                                      >
                                        {copiedQuestion === qIdx ? '✓ Copied' : 'Copy'}
                                      </button>
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--white)', marginBottom: '4px' }}>
                                      {q.question}
                                    </div>
                                    {q.idealAnswerCriteria && (
                                      <div style={{ fontSize: '10.5px', color: 'var(--grey-dark)', fontStyle: 'italic' }}>
                                        Criteria: {q.idealAnswerCriteria}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Quick AI Action: Load AI Feedback into Email */}
                        {selectedConsensus.applicantFeedbackLetter && (
                          <button
                            type="button"
                            onClick={() => handleLoadFeedbackToEmail(selectedScreening)}
                            style={{
                              padding: '9px 12px',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '8px',
                              letterSpacing: '0.12em',
                              textTransform: 'uppercase',
                              cursor: 'pointer',
                              border: '1px solid rgba(34,193,122,0.4)',
                              background: 'rgba(34,193,122,0.08)',
                              color: '#22c17a',
                              transition: 'all 0.15s ease',
                              textAlign: 'center',
                            }}
                          >
                            📋 Load AI Feedback into Email Composer
                          </button>
                        )}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--grey-mid)', lineHeight: '1.5' }}>
                          This applicant has not been screened yet. Run automated dual-layer evaluation to generate scorecards, rubric matrices, and tailored interview questions.
                        </div>
                        <button
                          type="button"
                          onClick={() => handleScreenCandidate(selected.id, false)}
                          style={{
                            padding: '10px 14px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '8px',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            border: '1px solid #22c17a',
                            background: '#22c17a',
                            color: 'var(--navy)',
                            fontWeight: 700,
                            transition: 'all 0.15s ease',
                          }}
                        >
                          ⚡ Run AI Consensus Screening
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="detail-section-title">Applied for</div>
                    <div className="detail-text">{selected.role_title ?? 'Open application'}</div>
                  </div>

                  {((selected as any).phone || (selected as any).location) && (
                    <div>
                      <div className="detail-section-title">Contact</div>
                      {(selected as any).phone && <div className="detail-text">{(selected as any).phone}</div>}
                      {(selected as any).location && <div className="detail-text" style={{ color: 'var(--grey-mid)', fontSize: '12px' }}>{(selected as any).location}</div>}
                    </div>
                  )}

                  {((selected as any).linkedin_url || (selected as any).portfolio_url || (selected as any).github_url || (selected as any).design_url || (selected as any).published_work_url) && (
                    <div>
                      <div className="detail-section-title">Links</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {(selected as any).linkedin_url && (
                          <a href={(selected as any).linkedin_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: 'var(--orange)' }}>LinkedIn ↗</a>
                        )}
                        {(selected as any).portfolio_url && (
                          <a href={(selected as any).portfolio_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: 'var(--orange)' }}>Portfolio ↗</a>
                        )}
                        {(selected as any).github_url && (
                          <a href={(selected as any).github_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: 'var(--orange)' }}>GitHub ↗</a>
                        )}
                        {(selected as any).design_url && (
                          <a href={(selected as any).design_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: 'var(--orange)' }}>Design portfolio ↗</a>
                        )}
                        {(selected as any).published_work_url && (
                          <a href={(selected as any).published_work_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: 'var(--orange)' }}>Published work ↗</a>
                        )}
                      </div>
                    </div>
                  )}

                  {(selected as any).project_links && Array.isArray((selected as any).project_links) && (selected as any).project_links.length > 0 && (
                    <div>
                      <div className="detail-section-title">Project links</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {((selected as any).project_links as { url: string; description: string }[]).map((link, i) => (
                          <div key={i} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: 'var(--orange)', display: 'block', marginBottom: '4px' }}>{link.url} ↗</a>
                            {link.description && <div style={{ fontSize: '12px', color: 'var(--grey-mid)' }}>{link.description}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(selected as any).currently_building && (
                    <div>
                      <div className="detail-section-title">Currently building</div>
                      <div className="detail-text">{(selected as any).currently_building}</div>
                    </div>
                  )}

                  {selected.cover_note && (
                    <div>
                      <div className="detail-section-title">Cover note</div>
                      <div className="detail-text">{selected.cover_note}</div>
                    </div>
                  )}

                  {selected.cv_url && (
                    <div>
                      <div className="detail-section-title">CV / Resume</div>
                      <a
                        href={`/api/cv-download?path=${encodeURIComponent(selected.cv_url)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '13px', color: 'var(--orange)', textDecoration: 'underline' }}
                      >
                        Download CV ↗
                      </a>
                    </div>
                  )}

                  <div>
                    <div className="detail-section-title">Update status</div>
                    <div className="detail-status-row">
                      {STATUS_OPTIONS.map((s) => {
                        const ss = STATUS_STYLES[s]
                        return (
                          <button key={s} type="button"
                            className={`status-select-btn ${selected.status === s ? 'active' : ''}`}
                            onClick={() => updateStatus(selected.id, s)}
                            disabled={updating || selected.status === s}
                          >
                            <span>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
                            {selected.status === s && <span style={{ color: ss.color }}>✓</span>}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--grey-dark)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                    Received {new Date(selected.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
                    {!emailOpen ? (
                      <button
                        type="button"
                        onClick={() => { setEmailOpen(true); setEmailResult(null) }}
                        style={{ width: '100%', padding: '9px 14px', fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', border: '1px solid rgba(219,103,39,0.3)', background: 'none', color: 'var(--orange)', transition: 'all 0.15s ease', textAlign: 'left' }}
                      >
                        Send email to applicant
                      </button>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--grey-mid)' }}>
                            Email to {selected.name.split(' ')[0]}
                          </div>
                          <button
                            type="button"
                            onClick={() => { setEmailOpen(false); setEmailResult(null) }}
                            style={{ background: 'none', border: 'none', color: 'var(--grey-dark)', cursor: 'pointer', fontSize: '14px' }}
                          >
                            ✕
                          </button>
                        </div>

                        {emailResult === 'success' && (
                          <div style={{ padding: '10px 14px', fontSize: '12px', background: 'rgba(34,193,122,0.08)', border: '1px solid rgba(34,193,122,0.2)', color: 'var(--success)' }}>
                            Email sent successfully to {selected.email}
                          </div>
                        )}

                        {emailResult === 'error' && (
                          <div style={{ padding: '10px 14px', fontSize: '12px', background: 'rgba(232,69,69,0.08)', border: '1px solid rgba(232,69,69,0.3)', color: 'var(--error)' }}>
                            Failed to send. Please try again.
                          </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--grey-mid)' }}>Send as</div>
                          <select
                            value={emailSenderId}
                            onChange={(e) => setEmailSenderId(e.target.value)}
                            style={{ background: 'var(--navy-mid)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--white)', fontFamily: 'var(--font-dm)', fontSize: '13px', padding: '9px 12px', outline: 'none', width: '100%' }}
                          >
                            {senders.map((s) => (
                              <option key={s.id} value={s.id}>{s.name} &lt;{s.email}&gt;</option>
                            ))}
                          </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--grey-mid)' }}>Subject</div>
                          <input
                            type="text"
                            value={emailSubject}
                            onChange={(e) => setEmailSubject(e.target.value)}
                            placeholder="Email subject"
                            style={{ background: 'var(--navy-mid)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--white)', fontFamily: 'var(--font-dm)', fontSize: '13px', padding: '9px 12px', outline: 'none', width: '100%' }}
                          />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--grey-mid)' }}>Message</div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--grey-dark)' }}>Variables: {'{{name}}'} · {'{{role}}'} · {'{{email}}'}</div>
                          </div>
                          <textarea
                            value={emailMessage}
                            onChange={(e) => setEmailMessage(e.target.value)}
                            placeholder={`Hi {{name}},\n\nWrite your message here...`}
                            rows={7}
                            style={{ background: 'var(--navy-mid)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--white)', fontFamily: 'var(--font-dm)', fontSize: '13px', padding: '9px 12px', outline: 'none', width: '100%', resize: 'vertical' }}
                          />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '4px' }}>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--grey-dark)' }}>File uploads</div>
                          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', alignSelf: 'flex-start', background: 'none', border: '1px solid rgba(219,103,39,0.3)', color: 'var(--orange)', padding: '5px 10px', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '7px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            + Attach files
                            <input
                              type="file"
                              multiple
                              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                              onChange={handleEmailFileChange}
                              style={{ display: 'none' }}
                            />
                          </label>
                          {emailAttachFiles.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                              {emailAttachFiles.map((f, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                  <span style={{ fontSize: '11px', color: 'var(--off-white)' }}>{f.name}</span>
                                  <button type="button" onClick={() => removeEmailFile(i)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: '11px', padding: '0 4px' }}>✕</button>
                                </div>
                              ))}
                              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', alignSelf: 'flex-start', background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--grey-mid)', padding: '4px 8px', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '7px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                + Add more files
                                <input
                                  type="file"
                                  multiple
                                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                                  onChange={handleEmailFileChange}
                                  style={{ display: 'none' }}
                                />
                              </label>
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={handleSendEmail}
                          disabled={emailSending || !emailSubject.trim() || !emailMessage.trim()}
                          style={{ padding: '10px 16px', fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', border: '1px solid var(--orange)', background: 'var(--orange)', color: 'var(--white)', transition: 'all 0.15s ease', opacity: emailSending || !emailSubject.trim() || !emailMessage.trim() ? 0.5 : 1 }}
                        >
                          {emailSending ? 'Sending...' : `Send to ${selected.email}`}
                        </button>
                      </div>
                    )}
                  </div>

                  <div style={{ borderTop: '1px solid rgba(232,69,69,0.15)', paddingTop: '16px' }}>
                    {!confirmDelete ? (
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(true)}
                        style={{ width: '100%', padding: '9px 14px', fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', border: '1px solid rgba(232,69,69,0.3)', background: 'none', color: 'var(--error)', transition: 'all 0.15s ease', textAlign: 'left' }}
                      >
                        Delete application
                      </button>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--error)', lineHeight: '1.5' }}>
                          This cannot be undone. The applicant will not be notified.
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => setConfirmDelete(false)}
                            disabled={deleting}
                            style={{ flex: 1, padding: '9px 14px', fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.15)', background: 'none', color: 'var(--grey-mid)', transition: 'all 0.15s ease' }}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(selected.id)}
                            disabled={deleting}
                            style={{ flex: 1, padding: '9px 14px', fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', border: '1px solid var(--error)', background: 'rgba(232,69,69,0.1)', color: 'var(--error)', transition: 'all 0.15s ease' }}
                          >
                            {deleting ? 'Deleting...' : 'Confirm delete'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="detail-empty">Select an application to view details.</div>
            )}
          </div>
        </div>
      )}
    </>
  )
}