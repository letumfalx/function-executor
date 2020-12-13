module.exports = {
  env: {
    browser: true,
    es6: true,
    commonjs: true,
    node: true
  },
  extends: [
    'semistandard'
  ],
  rules: {
    'no-console': 'error'
  },
  parser: 'babel-eslint',
  overrides: [
    Object.assign(
      {
        files: [
          '**/*.test.js'
        ],
        env: {
          jest: true
        }
      },
      require('eslint-plugin-jest').configs.recommended
    )
  ]
};
