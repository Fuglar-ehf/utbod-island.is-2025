import { defineConfig } from 'cypress'
const appName = 'air-discount-scheme'
const serviceName = 'web'

export default defineConfig({
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  video: false,
  videosFolder: `../../dist/cypress/apps/${appName}/${serviceName}-e2e/videos`,
  screenshotsFolder: `../../dist/cypress/apps/${appName}/${serviceName}-e2e/screenshots`,
  chromeWebSecurity: false,
  pageLoadTimeout: 240000,
  responseTimeout: 120000,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  e2e: {
    specPattern: './src/integration/**/*.ts',
    supportFile: './src/support/index.ts',
  },
})
// ci-cache-bust-01
