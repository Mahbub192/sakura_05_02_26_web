/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        sakura: {
          light: '#FFB7C5',
          DEFAULT: '#FF69B4',
          dark: '#FF1493',
        },
        // ENT / Landing page palette
        'ent-primary': '#EA2E00',
        'accent-green': '#9DBD68',
        'dark-green': '#325A46',
        'sand': '#F0E7D6',
        'beige': '#EAD9C9',
        'soft-gray': '#DCE1E6',
        'background-light': '#F0E7D6',
        'background-dark': '#1a2210',
        'heading-green': '#325A46',
        'map-tone': '#DCE1E6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        bengali: ['Kalpurush', 'SolaimanLipi', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


