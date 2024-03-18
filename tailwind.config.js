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
        MMI: "url('./assets/MMI.png')",
        TC: "url('./assets/TC.png')",
        GCCD: "url('./assets/GCCD.png')",
      },
      colors: {
        'white-transparent': 'rgba(241, 245, 249, 0.8)',
      },
    },
  },
  plugins: [],
};
