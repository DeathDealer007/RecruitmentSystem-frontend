/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#818cf8',
          DEFAULT: '#6366f1',
          dark: '#4f46e5',
        },
        dark: {
          bg: '#0a0a1a',
          surface: '#111127',
          card: 'rgba(25, 25, 60, 0.6)',
        }
      },
    },
  },
  plugins: [],
}
