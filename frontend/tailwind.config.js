/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060a12',
          900: '#0b0f19', // main deep background
          850: '#0e1526', // secondary dark surface
          800: '#141d33', // card surface
          750: '#1a2642', // hover surface
          700: '#223254', // border high-contrast
          600: '#334155',
          500: '#64748b',
          400: '#94a3b8',
        },
        cyan: {
          DEFAULT: '#00F0FF',
          glow: '#00F0FF',
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
        },
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(0, 240, 255, 0.35)',
        'glow-cyan-sm': '0 0 10px -2px rgba(0, 240, 255, 0.4)',
        'glow-card': '0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(0, 240, 255, 0.1)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
