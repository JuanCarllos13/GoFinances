module.exports = {
  preset: 'jest-expo',
  automock: false,
  resetMocks: false,
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.tsx",
    "!src/**/*spec.tsx"
  ],
  coverageReporters: [
    "lcov"
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  setupFiles: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['/node_modules/', '/android', '/ios'],
}