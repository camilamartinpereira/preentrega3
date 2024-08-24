/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js}',
    './index.html',
    './pages/**/*.html',
    './js/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        'pastel-pink': '#fbcfe8',
        'pastel-blue': '#bfdbfe',
        'pastel-green': '#bbf7d0',
        'pastel-yellow': '#fef9c3',
      },
    },
  },
  plugins: [],
}
