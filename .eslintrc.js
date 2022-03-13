module.exports = {
  // parser: 'babel-eslint',
  extends: [
    'eslint:recommended',
  ],
  rules: {
    'import/prefer-default-export': 1,
  },
  env: {
    browser: true,
    node: true,
  },
  globals: {
    module: 'readonly',
  }
};
