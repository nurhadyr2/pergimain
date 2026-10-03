/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fredoka', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Hitam (latar & permukaan)
        ink: {
          950: '#0a0708',
          900: '#141011',
          800: '#1e1719',
          700: '#2b2124',
          600: '#3d3034',
        },
        // Teks terang hangat
        cream: {
          100: '#fbf4ea',
          200: '#efe2d2',
          300: '#cbb9a6',
          400: '#9c8b7c',
        },
        // Emas (aksen utama)
        gold: {
          200: '#f5e5b8',
          300: '#e9cf83',
          400: '#d4af37',
          500: '#b8932a',
          600: '#8a6d1d',
        },
        // Merah maroon
        maroon: {
          400: '#a8263d',
          500: '#800020',
          600: '#6b0f1a',
          700: '#4a0a12',
          800: '#2e060b',
        },
        // Pink
        blush: {
          200: '#fbd3e0',
          300: '#f4a6c1',
          400: '#ec7fa4',
          500: '#dc5a89',
        },
      },
    },
  },
  plugins: [],
};
