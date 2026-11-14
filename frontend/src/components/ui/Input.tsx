import React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  dark?: boolean
}

export function Input({ label, error, dark, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className={cn('block text-sm font-medium mb-1.5', dark ? 'text-champagne' : 'text-primary-text')}>
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-4 py-2.5 rounded-[12px] border text-sm transition-all focus:outline-none focus:ring-2',
          dark
            ? 'bg-royal-night border-royal-gold/20 text-ivory placeholder:text-secondary-text focus:ring-royal-gold/40 focus:border-royal-gold/50'
            : 'bg-white border-border text-primary-text placeholder:text-secondary-text focus:ring-royal-gold/30 focus:border-royal-gold/50',
          error && 'border-red-400 focus:ring-red-300',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

