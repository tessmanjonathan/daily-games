/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',  // Added this line for dark mode support
  theme: {
    extend: {},
  },
  plugins: [],
}