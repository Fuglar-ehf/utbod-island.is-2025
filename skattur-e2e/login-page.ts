import { Page } from '@playwright/test'

export class LoginPage {
  constructor(private readonly page: Page) {}

  async waitForLoaded() {
    await this.page.waitForSelector('text=Skráðu þig inn')
  }

  async login(phoneNumber: string) {
    await this.page
      .locator('#phoneUserIdentifier')
      .pressSequentially(phoneNumber, { delay: 100 })
    await this.page.getByRole('button').first().click()
  }
}
