module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'airbnb',
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  globals: {
    APP_ENV_APP_PUBLIC_PATH: 'readonly',
    APP_ENV_APP_TITLE: 'readonly',
    APP_ENV_BASE_API_URL: 'readonly',
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@babel',
  ],
  rules: {
  },
};
