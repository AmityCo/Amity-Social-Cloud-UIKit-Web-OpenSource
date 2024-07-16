// @ts-check

import jest from 'eslint-plugin-jest';

import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const ignores = [
  '**/node_modules',
  '**/storybook-build',
  '**/build',
  '**/dist',
  '**/jest.config.js',
  // Ignore build artifacts
  '**/build',
  '**/coverage',
  '**/node_modules',
];

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      '@typescript-eslint/no-empty-function': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
  {
    files: ['**/*.{test,spec}.{ts,tsx}'],
    ignores,
    ...jest.configs['flat/recommended'],
    rules: {
      ...jest.configs['flat/recommended'].rules,
      'jest/prefer-expect-assertions': 'off',
    },
  },
  {
    files: ['src/v4/**/*.{ts,tsx}'],
    ignores,
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../'],
              message: 'Relative imports are not allowed.',
            },
            {
              group: ['**/*/index'],
              message: 'index imports are not allowed.',
            },
          ],
        },
      ],
    },
  },
  eslintPluginPrettierRecommended,
  { ignores },
];
