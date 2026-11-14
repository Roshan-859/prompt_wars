import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FFFDF7',
        cream: '#FAF6EB',
        'royal-night': '#14110D',
        'dark-surface': '#1E1913',
        'primary-text': '#2A2118',
        'secondary-text': '#6B6254',
        'royal-gold': '#C9A227',
        'deep-gold': '#A67C00',
        'bright-gold': '#E8C968',
        champagne: '#F7E7B4',
        border: '#E8E1D0',
        emerald: '#2E7D5B',
        copper: '#B87333',
        'warm-grey': '#D9D2C3',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '12px',
        lg: '16px',
        xl: '20px',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #E8C968, #C9A227, #A67C00)',
      },
      boxShadow: {
        warm: '0 4px 24px rgba(42, 33, 24, 0.08)',
        'warm-lg': '0 8px 40px rgba(42, 33, 24, 0.12)',
        gold: '0 4px 24px rgba(201, 162, 39, 0.25)',
      },
    },
  },
  plugins: [],
} satisfies Config

