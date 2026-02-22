/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: '#FFFBF5',
        ink: '#1a1a1a',
        accent: '#E85D04',
        muted: '#6B7280',
        soft: '#F3F0EB',
      },
    },
  },
  plugins: [],
}
