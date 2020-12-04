const colors = require('tailwindcss/colors')

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {

      transparent: 'transparent',
      current: 'currentColor',

      primary: '#00B4D8',
      secondary: '#EBFAFF',
      lightsecondary: '#B3E7F8',

      black: colors.black,
      white: colors.white,
      gray: colors.coolGray,
      red: colors.red,
      yellow: colors.amber,
      green: colors.emerald,
      blue: colors.blue,
      indigo: colors.indigo,
      purple: colors.violet,
      pink: colors.pink,
      teal: colors.teal
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
