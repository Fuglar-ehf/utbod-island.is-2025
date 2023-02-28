module.exports = {
  displayName: 'services-auth-personal-representative-public',
  preset: './jest.preset.js',
  rootDir: '../../../..',
  roots: [__dirname],
  globals: {
    'ts-jest': {
      diagnostics: false,
      tsconfig: `${__dirname}/tsconfig.spec.json`,
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  coverageDirectory:
    '<rootDir>/coverage/apps/services/auth/personal-representative-public',
  setupFiles: [`${__dirname}/test/environment.jest.ts`],
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.css.*',
    '!**/*.config.*',
    '!**/infra/*',
    '!**/seeders/*',
    '!**/migration/*',
    '!**/main.ts',
    '!**/buildOpenApi.ts',
    '!**/openApi.ts',
  ],
  testEnvironment: 'node',
}
