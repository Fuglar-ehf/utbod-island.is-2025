import { test } from '@playwright/test'

import { DataCollectionPage } from './data-collection.page'
import { IncomePage } from './income.page'
import { LoginPage } from './login-page'

test('can approve data collection', async ({ page }) => {
  // Arrange
  const loginPage = new LoginPage(page)
  const dataCollectionPage = new DataCollectionPage(page)
  const incomePage = new IncomePage(page)

  // Act
  await dataCollectionPage.goto()
  await loginPage.waitForLoaded()

  await loginPage.login(process.env.TEST_USER_PHONE_NUMBER ?? '')

  await dataCollectionPage.waitForLoaded()

  await dataCollectionPage.approve()

  await dataCollectionPage.continue()

  // Assert
  await incomePage.waitForLoaded()
})
