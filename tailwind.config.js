/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#2A0A0E',
          ivory: '#FAF5EB',
          card: '#FFFBF5',
          border: '#EADCC6',
          maroon: '#6C020E',
          'maroon-dark': '#3A0212',
          vermilion: '#820A14',
          'vermilion-hover': '#6C020E',
          'vermilion-light': '#FBECEC',
          gold: '#E8AE45',
          'gold-light': '#FBD596',
          crimson: '#820A14',
          ink: '#1E1412',
          paper: '#F6EEDF',
          muted: '#6E5A55',
        }
      },
      fontFamily: {
        sans: ['Inter', '"Hind Siliguri"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
        bengali: ['"Hind Siliguri"', 'sans-serif'],
        'bengali-serif': ['"Tiro Bangla"', '"Hind Siliguri"', 'serif'],
      },
      // One type scale for the whole site. Headings are fluid: the same class
      // reads well on a 360px phone and on a wide desktop, no sm:/lg: steps needed.
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
        xs: ['0.75rem', { lineHeight: '1.125rem' }],
        sm: ['0.875rem', { lineHeight: '1.4rem' }],
        base: ['1rem', { lineHeight: '1.65rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        eyebrow: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.14em', fontWeight: '600' }],
        lead: ['clamp(1rem, 0.95rem + 0.25vw, 1.125rem)', { lineHeight: '1.65' }],
        h3: ['clamp(1.125rem, 1.07rem + 0.25vw, 1.25rem)', { lineHeight: '1.35', letterSpacing: '-0.01em' }],
        h2: ['clamp(1.625rem, 1.38rem + 1.05vw, 2.25rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        h1: ['clamp(2rem, 1.6rem + 1.75vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        display: ['clamp(2.375rem, 1.6rem + 3.4vw, 4.25rem)', { lineHeight: '1.04', letterSpacing: '-0.025em' }],
      },
      // Vertical rhythm: gap between page sections, and between a heading and its content
      spacing: {
        section: 'clamp(3rem, 2.5rem + 2.2vw, 4.5rem)',
        content: 'clamp(1.25rem, 1rem + 1vw, 2rem)',
      },
      screens: {
        'xs': '420px',
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'songi': '0 2px 8px -2px rgba(58, 2, 18, 0.06), 0 1px 4px -1px rgba(58, 2, 18, 0.04)',
        'songi-lg': '0 16px 36px -6px rgba(58, 2, 18, 0.1), 0 4px 12px -2px rgba(58, 2, 18, 0.05)',
        'vermilion-glow': '0 8px 20px -4px rgba(130, 10, 20, 0.35)',
      }
    },
  },
  plugins: [],
}
