module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
    'jsx-a11y',
    'import',
    'eslint-comments',
    'simple-import-sort',
  ],
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:jsx-a11y/strict',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parserOptions: {
    project: './tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    // ================== //
    // @typescript-eslint //
    // ================== //
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': true,
        'ts-nocheck': true,
        'ts-check': false,
        minimumDescriptionLength: 5,
      },
    ],
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-empty-function': [
      'error',
      { allow: ['arrowFunctions'] },
    ],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/prefer-as-const': 'error',
    '@typescript-eslint/restrict-template-expressions': [
      'error',
      {
        allowNumber: true,
        allowBoolean: true,
        allowAny: true,
        allowNullish: true,
        allowRegExp: true,
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
    ],

    // =========== //
    // eslint base //
    // =========== //
    curly: ['error', 'all'],
    'linebreak-style': ['error', 'unix'],
    'no-console': 'error',
    'no-process-exit': 'error',
    'no-fallthrough': [
      'error',
      { commentPattern: '.*intentional fallthrough.*' },
    ],
    quotes: ['error', 'single', { avoidEscape: true }],
    semi: ['error', 'always'],

    // ============================ //
    // eslint-plugin-eslint-comment //
    // ============================ //
    // Require a eslint-enable comment for every eslint-disable comment
    'eslint-comments/disable-enable-pair': [
      'error',
      {
        allowWholeFile: true,
      },
    ],
    // Disallow a eslint-enable comment for multiple eslint-disable comments
    'eslint-comments/no-aggregating-enable': 'error',
    // Disallow duplicate eslint-disable comments
    'eslint-comments/no-duplicate-disable': 'error',
    // Disallow eslint-disable comments without rule names
    'eslint-comments/no-unlimited-disable': 'error',
    // Disallow unused eslint-disable comments
    'eslint-comments/no-unused-disable': 'error',
    // Disallow unused eslint-enable comments
    'eslint-comments/no-unused-enable': 'error',
    // Disallow ESLint directive-comments
    'eslint-comments/no-use': [
      'error',
      {
        allow: [
          'eslint-disable',
          'eslint-disable-line',
          'eslint-disable-next-line',
          'eslint-enable',
        ],
      },
    ],

    // ==================== //
    // eslint-plugin-import //
    // ==================== //
    // Disallow non-import statements appearing before import statements
    'import/first': 'error',
    // Require a newline after the last import/require in a group
    'import/newline-after-import': 'error',
    // Forbid import of modules using absolute paths
    'import/no-absolute-path': 'error',
    // Disallow AMD require/define
    'import/no-amd': 'error',
    // Forbid the use of extraneous packages
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
        peerDependencies: true,
        optionalDependencies: false,
      },
    ],
    // Forbid mutable exports
    'import/no-mutable-exports': 'error',
    // Forbid a module from importing itself
    'import/no-self-import': 'error',

    // ================================ //
    // eslint-plugin-simple-import-sort //
    // ================================ //
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Packages. `react` related packages come first.
          ['^react', '^@?\\w'],
          // Internal packages.
          [
            '^(app|assets|components|constants|contexts|data|lib|reducers|routes|sections|types|utils)(/.*|$)',
          ],
          // Side effect imports.
          ['^\\u0000'],
          // Parent imports. Put `..` last.
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Other relative imports. Put same-folder imports and `.` behind, and style imports last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$', '^.+\\.s?css$'],
        ],
      },
    ],

    // ===================== //
    // react and react-hooks //
    // ===================== //
    'react/jsx-boolean-value': ['error', 'always'],
    'react/jsx-sort-props': 'error',
    // Checks effect dependencies
    'react-hooks/exhaustive-deps': 'error',
    // Checks rules of Hooks
    'react-hooks/rules-of-hooks': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
