import type { Config } from 'tailwindcss'

// Palette officielle SAS Mauritian Driver
// Chinese Black  #0C1519  (12,21,25)
// Jet            #3A3534  (58,53,52)
// Coffee         #724B39  (114,75,57)
// Antique Brass  #CF9D7B  (207,157,123)

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Chinese Black — fonds principaux
        black: {
          DEFAULT:  '#0C1519',
          deep:     '#0C1519',   // bg page
          rich:     '#0D1820',   // variation sombre
          card:     '#111E24',   // cartes
          soft:     '#162029',   // surfaces légères
        },
        // Jet — bordures, surfaces intermédiaires
        anthracite: {
          DEFAULT: '#3A3534',
          light:   '#4D4847',
          muted:   '#5E5857',
        },
        // Coffee — accent chaud profond
        coffee: {
          DEFAULT: '#724B39',
          light:   '#8A5C47',
          dark:    '#5A3829',
        },
        // Antique Brass — accent lumineux (remplace l'or)
        gold: {
          DEFAULT: '#CF9D7B',
          light:   '#D9B090',
          dark:    '#B8835B',
          muted:   '#9A6E4C',
        },
        neutral: {
          850: '#161F24',
          925: '#0A1217',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Ranade', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-dark':   'linear-gradient(180deg, #0C1519 0%, #111E24 100%)',
        // Antique Brass gradient
        'gradient-gold':   'linear-gradient(135deg, #CF9D7B 0%, #D9B090 50%, #B8835B 100%)',
        // Coffee → Antique Brass (warm depth)
        'gradient-warm':   'linear-gradient(135deg, #724B39 0%, #CF9D7B 100%)',
        'gradient-hero':   'linear-gradient(to bottom, rgba(12,21,25,0.2) 0%, rgba(12,21,25,0.65) 55%, rgba(12,21,25,1) 100%)',
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease-out forwards',
        'fade-in':    'fadeIn 0.4s ease-out forwards',
        'shimmer':    'shimmer 2s linear infinite',
        'pulse-gold': 'pulseGold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
      },
      boxShadow: {
        'gold':     '0 0 20px rgba(207,157,123,0.25)',
        'gold-lg':  '0 0 40px rgba(207,157,123,0.35)',
        'coffee':   '0 0 20px rgba(114,75,57,0.3)',
        'dark':     '0 4px 30px rgba(12,21,25,0.7)',
        'dark-lg':  '0 10px 60px rgba(12,21,25,0.85)',
        'card':     '0 2px 20px rgba(12,21,25,0.5)',
      },
    },
  },
  plugins: [],
}

export default config 
