import React from 'react'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  color?: 'gold' | 'emerald' | 'copper' | 'grey'
  size?: 'sm' | 'md'
  className?: string
  showLabel?: boolean
}

export function ProgressBar({
  value,
  max = 100,
  color = 'gold',
  size = 'md',
  className,
  showLabel = false,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, Math.round((value / max) * 100)))
  const colors = {
    gold: 'bg-gold-gradient',
    emerald: 'bg-emerald',
    copper: 'bg-copper',
    grey: 'bg-warm-grey',
  }
  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
  }

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full bg-cream border border-border/50 rounded-full overflow-hidden', heights[size])}>
        <div className={cn('h-full rounded-full transition-all duration-500', colors[color])} style={{ width: `${pct}%` }} />
      </div>
      {showLabel && <span className="text-xs text-secondary-text mt-1 inline-block">{pct}%</span>}
    </div>
  )
}

