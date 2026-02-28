/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/unit/**/*.test.js',
    '<rootDir>/integration/**/*.test.js',
    '<rootDir>/edge-cases/**/*.test.js',
    '<rootDir>/regression/**/*.test.js',
  ],
  coverageDirectory: './coverage',
  coverageReporters: ['text', 'text-summary', 'json-summary', 'lcov'],
  collectCoverageFrom: [
    '../../src/**/*.{js,ts}',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  randomize: false,
  restoreMocks: true,
  clearMocks: true,
  resetModules: true,
  maxWorkers: '50%',
  testTimeout: 5000,
  bail: process.env.CI ? 1 : 0,
  verbose: true,
};
