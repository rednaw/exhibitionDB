module.exports = {
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  env: {
    es6: true,
    browser: true,
    node: true
  },
  extends: [
    'eslint:recommended'
  ],
  plugins: [
    'svelte3'
  ],
  ignorePatterns: [
    'build/'
  ],
  overrides: [
    {
      files: ['**/*.svelte'],
      processor: 'svelte3/svelte3'
    },
    {
      files: ['**/*.spec.js'],
      env: {
        jest: true
      }
    }
  ],
  rules: {
    // semi: ['error', 'never'] // uncomment if you want to remove ;
  },
  settings: {
    // ...
  }
}
