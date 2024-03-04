/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true,
"optionalDependencies": false, "peerDependencies": false}] */

const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    tailwindcss('./tailwind.config.js'),
    autoprefixer,
  ],
};
