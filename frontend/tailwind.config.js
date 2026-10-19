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
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        omega: {
          green: '#086358',
          darkgreen: '#04423b',
          gold: '#eab308',
          amber: '#f59e0b',
          bg: '#f8fafc',
          card: '#ffffff'
        }
      },
      fontFamily: {
        arabic: ['Cairo', 'Tajawal', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
