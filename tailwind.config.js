/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      'white': '#FFFFFF',
      'dark-bg': '#0f0f13',
      'darker-bg': '#08080c',
      'card-bg': '#1a1a24',
      'accent': '#d4af37',
      'accent-soft': '#f3e5ab',
      'text-primary': '#e0e0e0',
      'text-secondary': '#a0a0a0',
      'text-muted': '#6b6b75',
      'error': '#e57373',
      'transparent': 'transparent',
      'twitter': '#1DA1F2',
    },
    extend: {
      fontFamily: {
        inter: ["'Inter'", "sans-serif"],
        gelasio: ["'Gelasio'", "serif"]
      },
      fontSize: {
        'sm': '12px',
        'base': '14px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '28px',
        '4xl': '38px',
        '5xl': '50px',
      },
    },
  },
  plugins: [],
};
