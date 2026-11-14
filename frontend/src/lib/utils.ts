import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSkillStatusBadge(status: string) {
  switch (status) {
    case 'strong':
      return 'bg-emerald/15 text-emerald border-emerald/30'
    case 'intermediate':
      return 'bg-royal-gold/15 text-deep-gold border-royal-gold/30'
    case 'beginner':
      return 'bg-copper/15 text-copper border-copper/30'
    case 'missing':
    default:
      return 'bg-warm-grey/30 text-secondary-text border-warm-grey'
  }
}

