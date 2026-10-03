/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        body: ['VT323', 'monospace'],
      },
      colors: {
        lav: { 50: '#f6f2fe', 100: '#efeaf9', 200: '#e3daf5', 300: '#cdbdec' },
        grape: { 300: '#b39ddb', 400: '#9f86d9', 500: '#8367c7', 600: '#6b5b95' },
        bubble: { 200: '#ffd6e8', 300: '#f7a8c9', 400: '#ef7fae', 500: '#e45f97' },
        mint: { 200: '#c9f3e0', 300: '#9fe6c6', 400: '#67d6a6' },
        sun: { 200: '#ffeeb0', 300: '#ffe08a', 400: '#ffcf4d' },
        night: { 500: '#6b5b95', 600: '#5a4a80', 700: '#463a66', 800: '#352b4d' },
      },
    },
  },
  plugins: [],
};
