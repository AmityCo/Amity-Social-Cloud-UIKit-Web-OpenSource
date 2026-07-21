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

// eslint-plugin-jest doesn't type `configs`, so cast to satisfy `@ts-check`.
const jestFlatRecommended = /** @type {any} */ (jest.configs)['flat/recommended'];

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
    ...jestFlatRecommended,
    rules: {
      ...jestFlatRecommended.rules,
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
  {
    files: ['src/v4/**/*.{ts,tsx}'],
    ignores: [
      ...ignores,
      '**/*.stories.{ts,tsx}',
      'src/v4/chat/**',
      '**/icons/**',
      '**/design/illustrations/**',
    ],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'JSXAttribute[name.name=/^(fill|stroke|stopColor|floodColor|lightingColor|color)$/] Literal[value=/^(#|rgb|hsl)/i]',
          message:
            'Hardcoded color in a JSX color attribute. Use "currentColor" (controlled via CSS) or a theme token, not a color literal.',
        },
        {
          selector: 'JSXAttribute[name.name="style"] Property[value.value=/^(#|rgb|hsl)/i]',
          message:
            'Hardcoded color in an inline style. Use a CSS class with an --asc-color-* token instead.',
        },
      ],
    },
  },
  eslintPluginPrettierRecommended,
  { ignores },
];
