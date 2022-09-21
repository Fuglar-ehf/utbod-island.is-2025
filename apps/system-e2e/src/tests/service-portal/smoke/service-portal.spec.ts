import { BrowserContext, expect, test } from '@playwright/test'
import { urls } from '../../../support/utils'
import { session } from '../../../support/session'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Service portal', () => {
  let context: BrowserContext
  test.beforeAll(async ({ browser }) => {
    context = await session(
      context,
      browser,
      'service-portal.json',
      `${urls.islandisBaseUrl}/minarsidur`,
      `${urls.islandisBaseUrl}/minarsidur`,
      false,
      true,
      '0103019',
    )
    // const page = await context.newPage()
    // await page.goto('/minarsidur')
    // await cognitoLogin(page)({username: creds.username, password: creds.password}, urls.islandisBaseUrl)
    // await idsLogin(page, "0103019", urls.islandisBaseUrl)
    // await page.context().storageState({path: 'service-portal.json'})
    // await page.close()
  })
  test.afterAll(async () => {
    await context.close()
  })
  test('should have clickable navigation bar', async () => {
    const page = await context.newPage()
    await page.goto('/minarsidur')
    await expect(
      await page.locator('a[href^="/minarsidur/"]:has(svg):visible').nth(4),
    ).toBeTruthy()
  })
  test('should have user ${fakeUser.name} logged in', async () => {
    const page = await context.newPage()
    await page.goto('/minarsidur')
    await expect(
      page.locator('role=heading[name="Gervimaður Afríka"]'),
    ).toBeVisible()
  })
  test('should have Pósthólf', async () => {
    const page = await context.newPage()
    await page.goto('/minarsidur')
    await expect(page.locator('text=Pósthólf')).toBeVisible()
    await page.locator('a[href="/minarsidur/postholf"]').click()
    await expect(page.locator('text=Hér getur þú fundið skjöl')).toBeVisible()
  })
})
