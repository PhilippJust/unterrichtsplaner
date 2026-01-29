const eslint = require('@eslint/js')
const tseslint = require('typescript-eslint')

module.exports = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['node_modules/', 'src/sdk/', '*.js'],
  },
  {
    plugins: { 'unused-imports': require('eslint-plugin-unused-imports') },
    languageOptions: {
      globals: {
        module: 'readonly',
        require: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_.*$', varsIgnorePattern: '^_.*$' },
      ],
      '@typescript-eslint/no-require-imports': 'error',
      'unused-imports/no-unused-imports': 'error',
    },
  }
)
