/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cr: {
          red: '#EE3224',
          darkRed: '#D32F2F',
        },
        executive: {
          dark: '#1e293b',
          light: '#f8fafc',
        }
      }
    },
  },
  plugins: [],
}
