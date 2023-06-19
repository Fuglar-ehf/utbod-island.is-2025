import { BrowserContext, expect, test } from '@playwright/test'
import { icelandicAndNoPopupUrl, urls } from '../../../../support/urls'
import { session } from '../../../../support/session'

const homeUrl = `${urls.islandisBaseUrl}/stjornbord`
test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Admin portal (Endorsements)', () => {
  let contextGranter: BrowserContext

  test.beforeAll(async ({ browser }) => {
    contextGranter = await session({
      browser: browser,
      storageState: 'service-portal-faereyjar.json',
      homeUrl,
      phoneNumber: '0102399',
      delegation: '65° ARTIC ehf.',
    })
  })

  test.beforeEach(async ({ context, page }) => {
    context.addCookies(await contextGranter.cookies())
    await page.goto(icelandicAndNoPopupUrl(homeUrl + '/listar'))
  })

  test.afterAll(async () => {
    await contextGranter.close()
  })

  test('Open old endorsement list and go back', async ({ page }) => {
    await page.goto(icelandicAndNoPopupUrl(homeUrl))
    await page.getByTestId('active-module-name').click()
    await page.getByRole('link', { name: 'Undirskriftalistar' }).click()

    await page.getByRole('tab', { name: 'Liðnir listar' }).click()
    await page.getByText('Skoða lista').first().click()
    await expect(page.getByLabel('Heiti lista')).toBeVisible()
    await expect(page.getByText('Yfirlit undirskrifta')).toBeVisible()
    await page.getByRole('button', { name: 'Til baka' }).click()
    await expect(page.getByRole('tab', { name: 'Liðnir listar' })).toBeVisible()
  })

  test('Update old endorsement list', async ({ page }) => {
    await page.getByRole('tab', { name: 'Liðnir listar' }).click()
    await page.getByText('Skoða lista').first().click()
    await page.getByRole('button', { name: 'Uppfæra lista' }).click()
    await expect(
      page.getByRole('alert').filter({ hasText: 'Tókst að uppfæra lista' }),
    ).toBeVisible()
  })

  test.skip('See locked lists are present and locked', async ({ page }) => {
    await page.getByRole('tab', { name: 'Læstir listar' }).click()
    const lockedLists = page.getByRole('button', { name: 'Skoða lista' })
    await expect(lockedLists).toHaveCountGreaterThan(1)
    await lockedLists.first().click()
    await expect(
      page.getByRole('alert', { name: 'Listi er læstur' }),
    ).toBeVisible()
  })

  test('Go back to overview', async ({ page }) => {
    await page.getByTestId('active-module-name').click()
    await page
      .getByRole('menu', { name: 'Stjórnborðs valmynd' })
      .getByRole('link', { name: 'Yfirlit' })
      .click()
    await expect(
      page.getByRole('heading', { name: 'Stjórnborð Ísland.is' }),
    ).toBeVisible()
  })

  test('Access and edit a list', async ({ page }) => {
    // Setup
    await page.getByRole('tab', { name: 'Liðnir listar' }).click()

    // Act
    await page.getByRole('button', { name: 'Skoða lista' }).first().click()
    const currentEndDate = await page.getByLabel('Tímabil til').inputValue()
    const exampleDateInThePast = '13.05.2023'
    await page.getByLabel('Tímabil til').fill(exampleDateInThePast)
    await page.keyboard.press('Enter')
    await page.getByRole('button', { name: 'Uppfæra lista' }).click()

    // Assert
    let dateValue = await page.getByLabel('Tímabil til').last().inputValue()
    await expect(dateValue).toBe(exampleDateInThePast)

    // And lets end by setting the date back to what it was
    await page.getByLabel('Tímabil til').last().fill(currentEndDate)
    await page.keyboard.press('Enter')
    await page.getByRole('button', { name: 'Uppfæra lista' }).click()

    // Assert
    dateValue = await page.getByLabel('Tímabil til').last().inputValue()
    await expect(dateValue).toBe(currentEndDate)
  })
})
