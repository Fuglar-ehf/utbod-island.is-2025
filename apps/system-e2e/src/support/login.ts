import { expect, Page } from '@playwright/test'
import { JUDICIAL_SYSTEM_HOME_URL, urls } from './urls'
import { debug } from './utils'

export type CognitoCreds = {
  username: string
  password: string
}
function getCognitoCredentials(): CognitoCreds {
  const username = process.env.AWS_COGNITO_USERNAME
  const password = process.env.AWS_COGNITO_PASSWORD
  if (!username || !password) throw new Error('Cognito credentials missing')
  return {
    username,
    password,
  }
}
export const cognitoLogin = async (
  page: Page,
  home: string,
  authUrl: string,
  creds?: CognitoCreds,
) => {
  const { username, password } = creds ?? getCognitoCredentials()
  const cognito = page.locator('form[name="cognitoSignInForm"]:visible')
  await cognito.locator('input[id="signInFormUsername"]:visible').type(username)
  const passwordInput = cognito.locator(
    'input[id="signInFormPassword"]:visible',
  )

  await passwordInput.selectText()
  await passwordInput.type(password)
  await cognito.locator('input[name="signInSubmitButton"]:visible').click()
  if (home === JUDICIAL_SYSTEM_HOME_URL) {
    return
  }
  await page.waitForURL(new RegExp(`${home}|${authUrl}/delegation`))
}

export async function idsLogin(
  page: Page,
  phoneNumber: string,
  home: string,
  delegation?: string,
) {
  await page.waitForURL(`${urls.authUrl}/**`, { timeout: 15000 })
  const input = await page.locator('#phoneUserIdentifier')
  await input.type(phoneNumber, { delay: 100 })

  const btn = page.locator('button[id="submitPhoneNumber"]')
  await expect(btn).toBeEnabled()
  await btn.click()
  await page.waitForURL(new RegExp(`${home}|${urls.authUrl}/delegation`), {
    waitUntil: 'domcontentloaded',
  })

  // Handle delegation on login
  if (page.url().startsWith(urls.authUrl)) {
    debug('Still on auth site')
    const delegations = page.locator('button[name="SelectedNationalId"]')
    await expect(delegations).toHaveCountGreaterThan(0)
    // Default to the first delegation
    if (!delegation) await delegations.first().click()
    else
      await delegations
        .locator(`[value="${delegation.replace('-', '')}"]`)
        .click()
  }
  await page.waitForURL(new RegExp(`${home}`), {
    waitUntil: 'domcontentloaded',
  })
}
