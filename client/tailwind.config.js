/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#00A8E8',
          dark: '#007EA7',
        },
      },
    },
  },
  plugins: [],
};