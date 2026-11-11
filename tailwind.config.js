/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        tnp: {
          bg: '#090812',
          card: '#12101f',
          cardHover: '#19162c',
          border: '#24203a',
          borderLight: '#373258',
          purple: {
            DEFAULT: '#8b5cf6',
            light: '#a78bfa',
            dark: '#6d28d9',
            glow: '#9333ea',
            vivid: '#a855f7',
          },
          accent: '#9d4edd',
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
          cyan: '#06b6d4',
          amber: '#d97706',
          muted: '#8680a0',
          text: '#f2f0f8',
          subtext: '#aea7cc',
        }
      },
      fontFamily: {
        sans: ['Geist', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['"Geist Mono"', 'JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.35)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.3)',
        'terminal': '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
      }
    },
  },
  plugins: [],
}
