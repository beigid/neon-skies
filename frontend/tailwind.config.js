/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sky: {
          950: "#080c14",
          900: "#0f172a",
          850: "#131c31",
          800: "#1e293b",
          700: "#334155",
        },
        neon: {
          cyan: "#00f2fe",
          blue: "#4facfe",
          indigo: "#6366f1",
          purple: "#a855f7",
          amber: "#fbbf24",
          emerald: "#10b981",
          rose: "#f43f5e",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 20px -3px rgba(0, 242, 254, 0.35)',
        'neon-indigo': '0 0 20px -3px rgba(99, 102, 241, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at 50% 0%, rgba(79, 172, 254, 0.15) 0%, rgba(15, 23, 42, 0) 70%)',
        'grid-pattern': 'linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
      }
    },
  },
  plugins: [],
}
