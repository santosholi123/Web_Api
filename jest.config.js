module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  clearMocks: true,
  verbose: true,
  testMatch: ['**/tests/**/*.test.ts', '**/tests/**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'lib/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
};
