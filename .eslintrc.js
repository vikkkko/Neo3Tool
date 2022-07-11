module.exports = {
  lintOnSave: false,
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  extends: 'standard',
  globals: {
    __static: true
  },
  plugins: [
    'html'
  ],
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // no console
    // 'no-console': 2,
    'no-new-object': 2,
    'quote-props': [2, 'as-needed'],
    'object-shorthand': [2, 'always'],
    'no-array-constructor': 2,
    'array-callback-return': 2,
    'prefer-template': 2,
    'template-curly-spacing': [2, 'never'],
    'no-useless-escape': 2,
    // 'func-style': [2, 'expression'],
    'wrap-iife': [2, 'outside'],
    'no-loop-func': 2,
    'prefer-rest-params': 2,
    'prefer-spread': 2,
    'no-new-func': 2,
    'no-param-reassign': [2, { 'props': true }],
    'prefer-arrow-callback': 2,
    'arrow-parens': [2, 'as-needed'],
    'arrow-body-style': [2, 'as-needed'],
    'no-confusing-arrow': [2, { 'allowParens': false }],
    'no-useless-constructor': 2,
    'no-duplicate-imports': 2,
    'dot-notation': 2,
    // 'no-plusplus': 2,
    'no-plusplus': [2, { 'allowForLoopAfterthoughts': true }],
    'no-nested-ternary': 2,
    'no-unneeded-ternary': 2,
    'newline-per-chained-call': [2, { 'ignoreChainWithDepth': 3 }],
    // not assign to const
    'no-const-assign': 2,
    // no var, use let and const
    // 'no-var': 1
  }
}
