/** @type {import('jest').Config} */
const config = {
  verbose: true,
  rootDir: '',
  coverageDirectory: 'coverage',
  testPathIgnorePatterns: ['/node_modules/'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  testEnvironment: 'node',
};

module.exports = config;
