// @ts-check
import eslint from '@eslint/js';
import sheriff from '@softarc/eslint-plugin-sheriff';
import angular from 'angular-eslint';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import storybook from 'eslint-plugin-storybook';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist', 'coverage', '.angular', 'storybook-static']),
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
      prettierRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      // Angular
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'ui',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: ['element', 'attribute'],
          prefix: 'ui',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/prefer-signals': 'warn',
      '@angular-eslint/prefer-standalone': 'warn',
      // TypeScript
      '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
      '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      // General
      'max-lines': ['error', 400],
      complexity: ['error', 20],
      eqeqeq: 'error',
      'no-console': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
  {
    // Module boundaries (component isolation) defined in sheriff.config.ts.
    files: ['**/*.ts'],
    extends: [sheriff.configs.all],
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/prefer-control-flow': 'error',
      '@angular-eslint/template/eqeqeq': 'error',
    },
  },
  ...storybook.configs['flat/recommended'],
]);
