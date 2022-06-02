module.exports = {
  clearMocks: true,
  collectCoverage: false,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/index.ts',
    '!<rootDir>/src/main/**',
  ],
  coverageDirectory: 'coverage',
  moduleNameMapper: {
    '@/tests/(.+)': '<rootDir>/tests/$1',
    '@/(.+)': '<rootDir>/src/$1',
  },
  roots: [
    '<rootDir>/src',
    '<rootDir>/tests',
  ],
  transform: {
    '\\.ts$': 'ts-jest',
  },
};
