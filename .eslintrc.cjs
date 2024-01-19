module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import', 'jest'],
  root: true,
  rules: {
    '@typescript-eslint/no-empty-function': 'off',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
  },
  ignorePatterns: [
    // Ignore build artifacts
    '**/build',
    '**/coverage',
    '**/.webpackCache',
    '**/node_modules',
    '**/images',

    // Ignore generated files
    '**/__generated__',
    '**/generated',
    '*.graphql',
  ],
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
  env: {
    node: true,
    browser: true,
    jest: true,
  },
};
