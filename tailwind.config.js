/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0f1015',
          800: '#171923',
          700: '#232736',
          600: '#2e3346',
          400: '#8e96a8',
          300: '#b4bac7',
          200: '#d7dbe2'
        },
        primary: {
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce'
        }
      }
    },
  },
  plugins: [],
};
