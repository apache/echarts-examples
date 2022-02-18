module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: ['prettier', 'prettier/vue'],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    'space-before-function-paren': 0
  }
};
