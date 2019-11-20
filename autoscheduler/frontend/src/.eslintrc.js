module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    'airbnb',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'import',
  ],
  globals: {
    "document": false
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true
      }
    },
    "react": {
      "version": "detect"
    }
  },
  rules: {
    "react/jsx-filename-extension": [1, {"extensions": [".jsx", ".tsx"]}],
    "import/no-extraneous-dependencies": ["error", {"devDependencies": ["**/*.test.ts", "**/*.test.tsx", "**/*.config.js"]}],
    "lines-between-class-members": ["error", "always", { exceptAfterSingleLine: true }],
    "react/prop-types": 0,
    "no-plusplus": ["error", {allowForLoopAfterthoughts: true}],
  },
  overrides: [	
    {	
      "files": ["*.d.ts"],	
      "rules": {	
        "import/prefer-default-export": 0	
      } 	
    }	
  ],
};
