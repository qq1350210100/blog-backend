module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    'no-unused-vars': 0,
    'no-restricted-syntax': 0,
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'import/no-absolute-path': 0,
    'prefer-const': 0,
    'consistent-return': 0,
    'no-param-reassign': 0,
    'no-throw-literal': 0
  }
}
