module.exports = {
  verbose: true,
  transform: {
    '^.+\\.ts?(x)?$': ['ts-jest', require('./ts-jest.config.js')],
  },
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/components/**/src/**/test?(s).ts?(x)',
    '<rootDir>/components/**/src/**/*.test?(s).ts?(x)',
    '<rootDir>/packages/**/src/**/test?(s).ts?(x)',
    '<rootDir>/packages/**/src/**/*.test?(s).ts?(x)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/scripts/setupTests.ts'],
  // Improved error handling for Jest v28
  errorOnDeprecated: true,
  // Configure timer mocks to ensure backward compatibility
  fakeTimers: {
    enableGlobally: true,
    legacyFakeTimers: true
  }
}
