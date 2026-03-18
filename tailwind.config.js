/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#050508',
        'darker-bg': '#020204',
        'card-bg': 'rgba(20, 20, 28, 0.7)',
        'accent': '#d4af37',
        'accent-light': '#f3e5ab',
        'text-primary': '#f8f8f8',
        'text-secondary': '#a0a0a8',
        'text-muted': '#4a4a55',
        'error': '#ff5f5f',
        'success': '#00d084',
        'glass': 'rgba(255, 255, 255, 0.03)',
        'glass-border': 'rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        'sans': ["'Inter'", "sans-serif"],
        'serif': ["'Playfair Display'", "serif"],
        'mono': ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'accent-glow': '0 0 20px rgba(212, 175, 55, 0.15)',
      },
      backgroundImage: {
        'noise': "url('/assets/images/noise.png')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
};
