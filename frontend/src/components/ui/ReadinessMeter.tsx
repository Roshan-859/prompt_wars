import React from 'react'

interface ReadinessMeterProps {
  score: number
  size?: number
}

export function ReadinessMeter({ score, size = 160 }: ReadinessMeterProps) {
  const r = size / 2 - 16
  const circumference = 2 * Math.PI * r
  const pct = Math.min(100, Math.max(0, score))
  const offset = circumference - (pct / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="meterGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E8C968" />
            <stop offset="50%" stopColor="#C9A227" />
            <stop offset="100%" stopColor="#A67C00" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E8E1D0" strokeWidth="10" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#meterGoldGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold font-display text-gold-gradient">{pct}%</span>
        <span className="text-xs text-secondary-text uppercase tracking-wider font-medium">Readiness</span>
      </div>
    </div>
  )
}

