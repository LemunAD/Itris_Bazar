/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'olive-glow':       '#3E5D1A',
        'forest-mid':       '#3B521C',
        'deep-green':       '#1C2B0C',
        'near-black-green': '#141E09',
        'near-black':       '#0D1507',
        'pale-gold':        '#FFD995',
        'gold':             '#F8C568',
        'bronze':           '#98842D',
        'ivory':            '#F4EFE2',
        'sage':             '#B7C4A6',
        'ink':              '#0A0F05',
        'ember':            '#E4572E',
      },
      fontFamily: {
        heading: ['Gafya', 'Cinzel', 'Georgia', 'serif'],
        body: ['Roboto', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-sm': '0 0 12px rgba(248, 197, 104, 0.08)',
        'gold': '0 0 24px rgba(248, 197, 104, 0.12)',
        'gold-lg': '0 0 40px rgba(248, 197, 104, 0.18)',
        'dark': '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1.25rem',
      },
      transitionDuration: {
        '400': '400ms',
      }
    },
  },
  plugins: [],
}
