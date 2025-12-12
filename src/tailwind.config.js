/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'poke-red': '#E3350D',
        'poke-blue': '#1E90FF',
        'poke-yellow': '#FFCB05',
        'poke-dark': '#1a1a2e',
        'poke-darker': '#0f0f1a',
      },
      fontFamily: {
        'display': ['Bowlby One', 'cursive'],
        'body': ['Quicksand', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
