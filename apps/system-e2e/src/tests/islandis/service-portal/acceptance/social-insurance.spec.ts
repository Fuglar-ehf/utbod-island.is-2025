import { test, BrowserContext, expect } from '@playwright/test'
import { icelandicAndNoPopupUrl, urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import { disableI18n } from '../../../../support/disablers'

const homeUrl = `${urls.islandisBaseUrl}/minarsidur`
test.use({ baseURL: urls.islandisBaseUrl })

test.describe('MS - Social Insurance', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-faereyjar.json',
      homeUrl,
      phoneNumber: '0102399',
      idsLoginOn: true,
    })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('payment plan', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    await test.step('should display data when switching years', async () => {
      // Arrange
      await page.goto(
        icelandicAndNoPopupUrl('minarsidur/framfaersla/greidsluaetlun'),
      )

      const title = page.getByRole('heading', {
        name: 'Framfærsla',
      })
      await expect(title).toBeVisible()

      await expect(
        page.getByText('Skattskyldar greiðslutegundir nema arið 2024'),
      ).toBeVisible()

      const select = page.getByTestId('select-payment-plan-date-picker')
      await select.click()
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('Enter')

      await expect(
        page.getByText('Skattskyldar greiðslutegundir'),
      ).toBeVisible()
    })
  })
})
