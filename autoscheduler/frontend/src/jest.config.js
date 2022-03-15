module.exports = {
  // The root of your source code, which is the current folder in this case
  roots: ['.'],

  // Jest transformations -- this adds support for TypeScript
  // using ts-jest
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.js$': 'babel-jest',
  },

  // Runs special logic, such as cleaning up components
  // when using React Testing Library and adds special
  // extended assertions to Jest
  setupFilesAfterEnv: [
    '@testing-library/jest-dom/extend-expect',
  ],

  // Test spec file resolution pattern
  // Matches parent folder `__tests__` and filename
  // should contain `test` or `spec`.
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',

  // Module file extensions for importing
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
  },

  globals: {
    // Since running the tests won't have the variable set from the webpack config's
    // DefinePlugin usage, we have to manually set it in Jest
    STATIC_URL: '/static',
    IS_PRODUCTION: true,
  },
};
