module.exports = {
  transformIgnorePatterns: ['node_modules/(?!axios)/'],
  coveragePathIgnorePatterns: ['/node_modules/', '/jest'],
  collectCoverage: false,
  reporters: ['default'],
  setupFiles: ['./jestSetup.js'],
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^axios$': require.resolve('axios'),
  },
};
