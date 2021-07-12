const colors = require('tailwindcss/colors')

module.exports = {
  purge: [
    './src/**/*.js',
    './src/**/*.jsx',
    './src/**/*.css',
    './public/**/*.html',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      grey: colors.trueGray,
      red: colors.red,
      blue: colors.blue,
      white: colors.white,
      black: colors.black,
      primary: {
        DEFAULT: '#7BEDEB',
        textDark: '#00CCCC',
        textDarker: '#004D4D',
      },
    },
    extend: {},
  },
  variants: {
    extend: {
      borderWidth: ['last'],
    },
  },
  plugins: [],
}
