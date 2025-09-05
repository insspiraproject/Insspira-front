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
      animation: {
         'star-movement-bottom': 'star-movement-bottom linear infinite alternate',
         'star-movement-top': 'star-movement-top linear infinite alternate',       },
      keyframes: {         'star-movement-bottom': {           '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
           '100%': { transform: 'translate(-100%, 0%)', opacity: '0' },         },         'star-movement-top': {
          '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
           '100%': { transform: 'translate(100%, 0%)', opacity: '0' },
         },
    },
  },
  plugins: [],
} 
}