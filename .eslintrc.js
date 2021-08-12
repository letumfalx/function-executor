const jestRecommendedRules = require('eslint-plugin-jest').configs.recommended;

module.exports = {
  extends: 'semistandard',
  parser: '@babel/eslint-parser',
  overrides: [
    {
      ...jestRecommendedRules,
      files: [
        '**/*.test.js'
      ],
      env: {
        jest: true
      }
    }
  ],
  rules: {
    'linebreak-style': ['error', 'unix'],
    'no-console': 'error'
  }
};
