/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
      "./src/**/*.{ts,tsx,js,jsx}", // ✅ This now matches all TS/TSX files under /src
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };