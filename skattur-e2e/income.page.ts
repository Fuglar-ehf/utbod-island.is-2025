import { expect, Page } from '@playwright/test'

export class IncomePage {
  constructor(private readonly page: Page) {}

  async waitForLoaded() {
    await this.page.waitForSelector('text=Tekjur ársins 2024')
  }
}
