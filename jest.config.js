// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^next-auth/react$': '<rootDir>/__mocks__/next-auth/react.ts',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(next-auth|@auth|lucide-react)/)'
  ],
}

module.exports = createJestConfig(customJestConfig)
