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
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
        bengali: ['"Hind Siliguri"', 'sans-serif'],
        'bengali-serif': ['"Tiro Bangla"', '"Hind Siliguri"', 'serif'],
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
