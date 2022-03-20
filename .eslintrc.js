module.exports = {
  // parser: 'babel-eslint',
  extends: [
    'eslint:recommended',
    "airbnb",
    "airbnb/hooks"
  ],
  rules: {
    'import/prefer-default-export': 1,
    'linebreak-style': 0,
  },
  env: {
    browser: true,
    node: true,
  },
  globals: {
    module: 'readonly',
  }
};
