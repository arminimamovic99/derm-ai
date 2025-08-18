/** @type {import('tailwindcss').Config} */
const { generatePalette } = require('tailwindcss/colors')

module.exports = {
    darkMode: ["class"],
    content: [
      "./src/app/**/*.{ts,tsx,js,jsx}", // ✅ This now matches all TS/TSX files under /src
    ],
    theme: {
      extend: {
        animation: {
          'slow-pulse': 'pulse 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
        colors: {
          'primary': '#839dd1', // ← default color
          'polo-blue': {
            '50': '#f2f7fb',
            '100': '#e7f0f8',
            '200': '#d4e3f1',
            '300': '#b9cfe8',
            '400': '#94b0da',
            '500': '#839dd1',
            '600': '#6a80c1',
            '700': '#596ca9',
            '800': '#4a5989',
            '900': '#414d6e',
            '950': '#262c40',
          }
        }
      },
    },
    plugins: [],
  };