/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'system-ui', 'sans-serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        dark: {
          bg: '#0a0a0b',
          surface: '#18181b',
          card: '#27272a',
          border: '#3f3f46',
          muted: '#71717a',
        },
        accent: {
          DEFAULT: '#10b981',
          hover: '#059669',
          light: '#34d399',
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
        'hero-glow': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(16, 185, 129, 0.15), transparent)',
        'gradient-accent': 'linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #10b981 100%)',
        'gradient-accent-subtle': 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(20, 184, 166, 0.1) 50%, rgba(16, 185, 129, 0.15) 100%)',
        'gradient-section': 'linear-gradient(180deg, rgba(24, 24, 27, 0.5) 0%, rgba(9, 9, 11, 0.8) 100%)',
        'gradient-card-border': 'linear-gradient(135deg, rgba(16, 185, 129, 0.4), rgba(20, 184, 166, 0.3), rgba(16, 185, 129, 0.2))',
        'gradient-footer-border': 'linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.3), rgba(20, 184, 166, 0.2), transparent)',
      },
      backgroundSize: {
        'grid': '48px 48px',
      },
    },
  },
  plugins: [],
}
