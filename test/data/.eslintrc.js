module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: 'airbnb-base',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "max-len": ["error", {"code": 120, "tabWidth": 4, "ignoreUrls": true}],
    "no-underscore-dangle": ["off"],
    "import/no-unresolved": ["off"],
    "no-unused-vars": ["off"],
    "no-useless-constructor": ["off"],
    "class-methods-use-this": ["off"],
    "no-empty-function": ["off"],
    "func-names": ["off"]
  },
};