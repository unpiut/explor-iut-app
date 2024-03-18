/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true,
"optionalDependencies": false, "peerDependencies": false}] */
/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{html,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        MMI: "url('./src/assets/MMI.png')",
        TC: "url('./src/assets/TC.png')",
        GCCD: "url('./src/assets/GCCD.png')",
      },
    },
  },
  plugins: [],
};
