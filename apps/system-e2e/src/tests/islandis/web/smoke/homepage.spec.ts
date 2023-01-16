import { BrowserContext, expect, test } from '@playwright/test'
import { urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import {
  DefaultStub,
  HttpMethod,
  Imposter,
  Mountebank,
  Proxy,
  ProxyMode,
} from '@anev/ts-mountebank'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Front page', () => {
  let context: BrowserContext
  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'homepage.json',
      homeUrl: `${urls.islandisBaseUrl}/`,
      phoneNumber: '0103019',
      idsLoginOn: false,
    })
  })
  test.afterAll(async () => {
    await context.close()
  })
  test('has expected sections @lang:is', async () => {
    const page = await context.newPage()
    await page.goto('/')
    await expect(
      page.locator('text=Öll opinber þjónusta á einum stað'),
    ).toBeVisible()
    await expect(page.locator('data-testid=home-banner')).toBeVisible()
    await expect(page.locator('data-testid=home-heading')).toBeVisible()
    await expect(page.locator('data-testid=home-news')).toBeVisible()
  })

  for (const { lang, home } of [
    { lang: 'is', home: '/' },
    { lang: 'en', home: '/en' },
  ]) {
    test(`should have life event @lang:${lang}`, async () => {
      test.slow()
      const page = await context.newPage()
      await page.goto(home)
      const lifeEventsCards = page.locator('[data-testid="lifeevent-card"]')

      await expect(lifeEventsCards).toHaveCountGreaterThan(3)
      const lifeEventHandles = await lifeEventsCards.elementHandles()
      const lifeEventUrls = await Promise.all(
        lifeEventHandles.map((item) => item.getAttribute('href')),
      )
      for (const url of lifeEventUrls) {
        const page = await context.newPage()
        const result = await page.goto(url!, { waitUntil: 'networkidle' })
        expect(result!.status()).toBe(200)
        await page.close()
      }
    })
    test(`should navigate to featured link @lang:${lang}`, async () => {
      test.slow()
      const page = await context.newPage()
      await page.goto(home)
      const featuredLinks = page.locator('[data-testid="featured-link"]')
      await expect(featuredLinks).toHaveCountGreaterThan(3)
      const featuredLinksHandles = await featuredLinks.elementHandles()
      const featuresLinksUrls = await Promise.all(
        featuredLinksHandles.map((item) => item.getAttribute('href')),
      )
      for (const url of featuresLinksUrls) {
        const page = await context.newPage()
        const result = await page.goto(url!, {
          waitUntil: 'networkidle',
        })
        expect(result!.status()).toBe(200)
        await page.close()
      }
    })

    test(`should have link on life events pages to navigate back to the main page @lang:${lang}`, async () => {
      test.slow()
      const page = await context.newPage()
      await page.goto(home)
      const lifeEventsCards = page.locator('[data-testid="lifeevent-card"]')
      const lifeEventHandles = await lifeEventsCards.elementHandles()
      const lifeEventUrls = await Promise.all(
        lifeEventHandles.map((item) => item.getAttribute('href')),
      )
      for (const url of lifeEventUrls) {
        const page = await context.newPage()
        const result = await page.goto(url!)
        expect(result?.url()).not.toBe(home)
        await page.locator('[data-testid="link-back-home"]').click()
        await page.waitForLoadState('networkidle')
        await expect(page).toHaveURL(home)
        await page.close()
      }
    })
  }

  test('should change welcome message on language toggle @lang:is', async () => {
    const page = await context.newPage()
    await page.goto('/')
    const homeHeading = page.locator('h1[data-testid="home-heading"]')
    const icelandicHeading = await homeHeading.textContent()
    await page.locator('button[data-testid="language-toggler"]:visible').click()
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL('/en')
    await expect(homeHeading).not.toHaveText(icelandicHeading!)
  })

  test('should toggle mega-menu @lang:is', async () => {
    const page = await context.newPage()
    await page.goto('/')
    await page
      .locator('[data-testid="frontpage-burger-button"]:nth-child(2)')
      .click()
    await expect(
      page.locator('[data-testid="mega-menu-link"] > a'),
    ).toHaveCountGreaterThan(18)
  })
})
