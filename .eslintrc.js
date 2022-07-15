module.exports = {
  env: {
    'jest/globals': true,
  },
  plugins: ['jest'],
  extends: 'airbnb-typescript-prettier',
  rules: {
    'import/prefer-default-export': 'off',
    'no-param-reassign': [
      'error',
      { props: true, ignorePropertyModificationsFor: ['draft', 'state'] },
    ], // Rule ignored for immer state
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.stories.*', '**/*.test.*', '**/*setupTests.ts'] },
    ],
    'react/no-unescaped-entities': [0], // Just plain buggy and annoying
    'react/require-default-props': [0],
    'react/jsx-props-no-spreading': [0],
    'import/extensions': [0],
    'react/jsx-filename-extension': [0],
    'react/function-component-definition': [0],
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
      },
    },
    extensions: ['.js', '.ts', '.tsx', '.jsx'],
  },
};
