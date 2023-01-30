module.exports = {
  preset: './jest.preset.js',
  rootDir: '../../../..',
  roots: [__dirname],
  coverageDirectory: '<rootDir>/coverage/apps/services/auth/admin-api',
  setupFiles: [`${__dirname}/test/environment.jest.ts`],
  setupFilesAfterEnv: [`${__dirname}/test/setup.ts`],
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  globals: {
    'ts-jest': { tsconfig: `${__dirname}/tsconfig.spec.json` },
  },
  displayName: 'services-auth-admin-api',
  testEnvironment: 'node',
}
