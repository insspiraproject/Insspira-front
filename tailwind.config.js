/** @type {import('tailwindcss').config} */

const colors = require('tailwindcss/colors')

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        morado: '#5419E6',
        crema: '#E0DBE5', 
        amarillo: '#F8E800',
        rosa: '#AC80C6',
      },
  },
  plugins: [],
} 
}