module.exports = {
  clearMocks: true,
  collectCoverage: false,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/domain/features/*.ts',
    '!<rootDir>/src/domain/models/*.ts',
    '!<rootDir>/src/data/contracts/**/*.ts',
    '!<rootDir>/src/main/**/*.ts',
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
