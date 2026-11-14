import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'gold' | 'emerald' | 'copper' | 'grey' | 'demo'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-cream border border-border text-secondary-text',
    gold: 'bg-royal-gold/15 border border-royal-gold/30 text-deep-gold font-medium',
    emerald: 'bg-emerald/15 border border-emerald/30 text-emerald font-medium',
    copper: 'bg-copper/15 border border-copper/30 text-copper font-medium',
    grey: 'bg-warm-grey/30 border border-warm-grey text-secondary-text',
    demo: 'bg-bright-gold/20 border border-royal-gold/50 text-deep-gold font-semibold tracking-wide',
  }
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs', variants[variant], className)}>
      {children}
    </span>
  )
}

