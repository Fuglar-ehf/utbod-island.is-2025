import { Page } from '@playwright/test'

export class DataCollectionPage {
  url = 'http://localhost:4242/umsoknir/skattframtal'

  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto(this.url)
  }

  async waitForLoaded() {
    await this.page.waitForSelector('text=Gagnaöflun')
  }

  async approve() {
    await this.page.getByRole('checkbox').click()
  }

  async continue() {
    await this.page.getByRole('button', { name: 'Halda áfram' }).click()
  }
}
