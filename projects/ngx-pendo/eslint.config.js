// @ts-check
const tseslint = require('typescript-eslint');
const rootConfig = require('../../eslint.config.js');

module.exports = tseslint.config(
  ...rootConfig,
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'ngx-pendo',
          style: 'kebab-case'
        }
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'ngx-pendo',
          style: 'kebab-case'
        }
      ],
      '@angular-eslint/no-input-rename': 'off',
      '@typescript-eslint/no-require-imports': 'off'
    }
  },
  {
    files: ['**/*.html'],
    rules: {}
  }
);
