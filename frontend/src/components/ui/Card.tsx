import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  dark?: boolean
  goldBorder?: boolean
}

export function Card({ dark, goldBorder, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[16px] p-6 transition-all',
        dark
          ? 'bg-dark-surface border border-royal-gold/20 text-ivory'
          : 'bg-white border border-border shadow-warm text-primary-text',
        goldBorder && 'border-royal-gold/40',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

