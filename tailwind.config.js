/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  prefix: '',
  theme: {
    extend: {
      colors: {
        brand: '#546de5',
        'primary-text': 'rgb(52 52 52)',
        'secondary-text': '#929292',
        'text-link': '#1663bb',
        'text-danger': 'rgb(185, 28, 28)',
        'method-get': 'rgb(5, 150, 105)',
        'method-post': '#8e44ad',
        'method-delete': 'rgb(185, 28, 28)',
        'method-patch': 'rgb(52 52 52)',
      },
    },
  },
  plugins: [],
};
