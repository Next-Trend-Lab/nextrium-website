'use client'

import { useEffect, useState } from 'react'

const DEADLINE = new Date('2026-06-08T23:59:00Z')

function useCountdown(target: Date) {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    function tick() {
      const now = new Date()
      const diff = target.getTime() - now.getTime()
      if (diff <= 0) {
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setTime({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])

  return time
}

function Pad(n: number) {
  return String(n).padStart(2, '0')
}

function NTMark({ size = 48 }: { size?: number }) {
  const s = size / 80
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4" y="4" width="16" height="72" rx="4" fill="#F5F6F8" />
      <polygon points="20,4 36,4 76,68 76,76 60,76 20,12" fill="#F5F6F8" />
      <rect x="60" y="4" width="16" height="72" rx="4" fill="#F5F6F8" />
      <rect x="4" y="4" width="72" height="18" rx="4" fill="#DB6727" />
      <rect x="32" y="4" width="16" height="36" rx="3" fill="#DB6727" />
    </svg>
  )
}

export default function Page() {
  const { days, hours, minutes, seconds } = useCountdown(DEADLINE)

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ background: '#071628' }}
    >
      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 70% 20%, rgba(219,103,39,0.08) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(10,139,139,0.06) 0%, transparent 50%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-16 text-center">

        {/* Logo */}
        <div className="flex items-center gap-4 mb-16">
          <NTMark size={56} />
          <div className="flex flex-col gap-1 text-left">
            <div
              className="leading-none"
              style={{
                fontFamily: 'var(--font-exo2), Exo 2, sans-serif',
                fontWeight: 900,
                fontSize: 'clamp(24px, 5vw, 40px)',
                letterSpacing: '-0.5px',
              }}
            >
              <span style={{ color: '#F5F6F8' }}>Nex</span>
              <span style={{ color: '#DB6727' }}>T</span>
              <span style={{ color: '#F5F6F8' }}>rium</span>
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono), Space Mono, monospace',
                fontSize: 'clamp(7px, 1.2vw, 10px)',
                letterSpacing: '0.18em',
                color: '#8A9BB0',
                textTransform: 'uppercase',
              }}
            >
              Innovation. Incubation. Impact.
            </div>
          </div>
        </div>

        {/* Headline */}
        <div
          className="mb-4"
          style={{
            fontFamily: 'var(--font-mono), Space Mono, monospace',
            fontSize: 'clamp(9px, 1.5vw, 11px)',
            letterSpacing: '0.25em',
            color: '#DB6727',
            textTransform: 'uppercase',
          }}
        >
          We are launching soon
        </div>

        <h1
          className="mb-6"
          style={{
            fontFamily: 'var(--font-exo2), Exo 2, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(32px, 7vw, 72px)',
            letterSpacing: '-1.5px',
            lineHeight: 1.05,
            color: '#FFFFFF',
            maxWidth: '800px',
          }}
        >
          Something big<br />
          <span style={{ color: '#DB6727' }}>is coming.</span>
        </h1>

        <p
          className="mb-16"
          style={{
            fontFamily: 'var(--font-dm), DM Sans, sans-serif',
            fontSize: 'clamp(14px, 2vw, 18px)',
            color: '#8A9BB0',
            maxWidth: '480px',
            lineHeight: 1.7,
          }}
        >
          NexTrium Global Innovations Ltd is building the infrastructure
          for Africa's digital future. Our website is under construction
          and will be live shortly.
        </p>

        {/* Countdown */}
        <div className="flex items-start gap-4 mb-16 flex-wrap justify-center">
          {[
            { label: 'Days', value: days },
            { label: 'Hours', value: hours },
            { label: 'Minutes', value: minutes },
            { label: 'Seconds', value: seconds },
          ].map(({ label, value }, i) => (
            <div key={label} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div
                  className="flex items-center justify-center rounded-xl mb-2"
                  style={{
                    width: 'clamp(64px, 14vw, 100px)',
                    height: 'clamp(64px, 14vw, 100px)',
                    background: '#0D233D',
                    border: '1px solid #163352',
                    fontFamily: 'var(--font-exo2), Exo 2, sans-serif',
                    fontWeight: 900,
                    fontSize: 'clamp(28px, 6vw, 48px)',
                    color: '#FFFFFF',
                    letterSpacing: '-1px',
                  }}
                >
                  {Pad(value)}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono), Space Mono, monospace',
                    fontSize: 'clamp(8px, 1.2vw, 10px)',
                    letterSpacing: '0.2em',
                    color: '#8A9BB0',
                    textTransform: 'uppercase',
                  }}
                >
                  {label}
                </div>
              </div>
              {i < 3 && (
                <div
                  style={{
                    fontFamily: 'var(--font-exo2), Exo 2, sans-serif',
                    fontWeight: 900,
                    fontSize: 'clamp(28px, 6vw, 48px)',
                    color: '#DB6727',
                    marginTop: 'clamp(10px, 2vw, 18px)',
                  }}
                >
                  :
                </div>
              )}
            </div>
          ))}
        </div>

        {/* RC badge */}
        <div
          style={{
            fontFamily: 'var(--font-mono), Space Mono, monospace',
            fontSize: '9px',
            letterSpacing: '0.2em',
            color: '#4A6FA5',
            textTransform: 'uppercase',
          }}
        >
          RC: 9506507 · Lagos, Nigeria · Est. 2026
        </div>

      </div>
    </main>
  )
}
