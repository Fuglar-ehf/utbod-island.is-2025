import { test, BrowserContext, expect } from '@playwright/test'
import { icelandicAndNoPopupUrl, urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import { label } from '../../../../support/i18n'
import { m } from '@island.is/service-portal/licenses/messages'
import { disableI18n } from '../../../../support/disablers'

const homeUrl = `${urls.islandisBaseUrl}/minarsidur`
test.use({ baseURL: urls.islandisBaseUrl })

test.describe('MS - Skírteini', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-amerika.json',
      homeUrl,
      phoneNumber: '0102989',
      idsLoginOn: true,
    })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('License overview', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    await test.step('Renders the page', async () => {
      // Arrange
      await page.goto(icelandicAndNoPopupUrl('/minarsidur/skirteini'))

      // Assert
      const headline = page.getByRole('heading', { name: label(m.title) })
      await expect(headline).toBeVisible()
    })
  })

  test('should display passport in overview', async () => {
    const page = await context.newPage()
    await disableI18n(page)
    await page.goto(icelandicAndNoPopupUrl('/minarsidur/skirteini'))
    await page.waitForLoadState('networkidle')

    // Act
    const passportLink = page
      .locator('data-testid=passport-card')
      .getByRole('link', { name: label(m.seeDetails) })
    await passportLink.click()
    const title1 = page.getByText(label(m.passportName))

    // Assert
    await expect(page).toHaveURL(
      /minarsidur\/skirteini\/tjodskra\/vegabref\/.+/,
    )
    await expect(title1).toBeVisible()
  })

  test('should display child passports', async () => {
    const page = await context.newPage()
    await disableI18n(page)
    await page.goto(icelandicAndNoPopupUrl('/minarsidur/skirteini'))
    await page.waitForLoadState('networkidle')

    // Act
    const tabButton = page.getByRole('tab', {
      name: label(m.licenseTabSecondary),
    })
    await tabButton.click()

    const childPassportLink = page
      .locator(`role=button[name="${label(m.seeDetails)}"]`)
      .last()
    await childPassportLink.click()
    const title1 = page.getByText(label(m.passportName))

    // Assert
    await expect(page).toHaveURL(
      /minarsidur\/skirteini\/tjodskra\/vegabref\/.+/,
    )
    await expect(title1).toBeVisible()
  })
})

test.describe.skip('Skírteini', () => {
  for (const { testCase } of [
    { testCase: 'Skírteini fá upp QR kóða ADR' },
    { testCase: 'Skírteini fá upp QR kóða skotvopnaleyfi' },
    { testCase: 'Skírteini fá upp QR kóða vinnuvéla' },
    { testCase: 'Skírteini fá upp QR kóða ökuskírteinis' },
    { testCase: 'Skírteini sjá ADR detail' },
    { testCase: 'Skírteini sjá ADR skírteini' },
    { testCase: 'Skírteini sjá Skotvopna detail + byssueign' },
    { testCase: 'Skírteini sjá Skotvopna skírteini' },
    { testCase: 'Skírteini sjá Vinnuvéla detail' },
    { testCase: 'Skírteini sjá Vinnuvéla skírteini' },
    { testCase: 'Skírteini sjá Ökuskírteini detail' },
    { testCase: 'Skírteini sjá Ökuskírteini' },
  ]) {
    test(testCase, () => {
      return
    })
  }
})
