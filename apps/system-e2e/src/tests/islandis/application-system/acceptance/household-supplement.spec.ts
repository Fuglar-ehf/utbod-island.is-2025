import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { householdSupplementFormMessage } from '@island.is/application/templates/social-insurance-administration/household-supplement'
import { test as base, expect, Page } from '@playwright/test'
import {
  disableI18n,
  disablePreviousApplications,
} from '../../../../support/disablers'
import { label } from '../../../../support/i18n'
import { helpers } from '../../../../support/locator-helpers'
import { session } from '../../../../support/session'
import { setupXroadMocks } from './setup-xroad.mocks'

const homeUrl = '/umsoknir/heimilisuppbot'

const applicationTest = base.extend<{ applicationPage: Page }>({
  applicationPage: async ({ browser }, use) => {
    const applicationContext = await session({
      browser,
      homeUrl,
      phoneNumber: '0103019', // Gervimaður Afríka
      idsLoginOn: true,
    })

    const applicationPage = await applicationContext.newPage()
    await disablePreviousApplications(applicationPage)
    await disableI18n(applicationPage)
    await applicationPage.goto(homeUrl)
    await expect(applicationPage).toBeApplication()
    await setupXroadMocks()
    await use(applicationPage)

    await applicationPage.close()
    await applicationContext.close()
  },
})

applicationTest.describe('Household Supplement', () => {
  applicationTest(
    'Should be able to create application',
    async ({ applicationPage }) => {
      const page = applicationPage
      const { proceed } = helpers(page)

      await applicationTest.step('Agree to data providers', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(
              socialInsuranceAdministrationMessage.pre.externalDataSection,
            ),
          }),
        ).toBeVisible()
        await page.getByTestId('agree-to-data-providers').click()
        await page
          .getByRole('button', {
            name: label(
              socialInsuranceAdministrationMessage.pre.startApplication,
            ),
          })
          .click()
      })

      await applicationTest.step('Fill in applicant info', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(
              socialInsuranceAdministrationMessage.info.infoSubSectionTitle,
            ),
          }),
        ).toBeVisible()

        const phoneNumber = page.getByRole('textbox', {
          name: label(
            socialInsuranceAdministrationMessage.info.applicantPhonenumber,
          ),
        })
        await phoneNumber.selectText()
        await phoneNumber.type('6555555')
        await proceed()
      })

      await applicationTest.step('Fill in payment information', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(socialInsuranceAdministrationMessage.payment.title),
          }),
        ).toBeVisible()
        const paymentBank = page.getByRole('textbox', {
          name: label(socialInsuranceAdministrationMessage.payment.bank),
        })
        await paymentBank.selectText()
        await paymentBank.fill('051226054678')
        await proceed()
      })

      await applicationTest.step('Household supplement', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(
              householdSupplementFormMessage.shared.householdSupplement,
            ),
          }),
        ).toBeVisible()

        await page
          .getByRole('region', {
            name: label(
              householdSupplementFormMessage.info.householdSupplementHousing,
            ),
          })
          .getByRole('radio', {
            name: label(
              householdSupplementFormMessage.info
                .householdSupplementHousingOwner,
            ),
          })
          .click()

        await page
          .getByRole('region', {
            name: label(
              householdSupplementFormMessage.info
                .householdSupplementChildrenBetween18And25,
            ),
          })
          .getByRole('radio', {
            name: label(socialInsuranceAdministrationMessage.shared.no),
          })
          .click()
        await proceed()
      })

      await applicationTest.step('Select period', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(socialInsuranceAdministrationMessage.period.title),
          }),
        ).toBeVisible()
        await page.getByTestId('select-period.year').click()
        await page.keyboard.press('Enter')

        // TODO: Need to look into this, it may happen that a month is not valid
        await page.getByTestId('select-period.month').click()
        await page.keyboard.press('ArrowUp')
        await page.keyboard.press('Enter')
        await proceed()
      })

      await applicationTest.step(
        'Check that additional documents header is visible',
        async () => {
          await expect(
            page.getByRole('heading', {
              name: label(
                socialInsuranceAdministrationMessage.fileUpload
                  .additionalFileTitle,
              ),
            }),
          ).toBeVisible()
          await proceed()
        },
      )

      await applicationTest.step('Write comment', async () => {
        await expect(
          page.getByRole('heading', {
            name: label(
              socialInsuranceAdministrationMessage.additionalInfo
                .commentSection,
            ),
          }),
        ).toBeVisible()
        await page
          .getByPlaceholder(
            label(
              socialInsuranceAdministrationMessage.additionalInfo
                .commentPlaceholder,
            ),
          )
          .fill(
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vehicula malesuada augue, sit amet pulvinar tortor pellentesque at. Nulla facilisi. Nunc vel mi ac mi commodo rhoncus sit amet ut neque.',
          )
        await proceed()
      })

      await applicationTest.step('Submit application', async () => {
        await expect(
          page
            .locator('form')
            .getByRole('paragraph')
            .filter({
              hasText: label(
                socialInsuranceAdministrationMessage.confirm.overviewTitle,
              ),
            }),
        ).toBeVisible()
        await page
          .getByRole('button', {
            name: label(
              socialInsuranceAdministrationMessage.confirm.submitButton,
            ),
          })
          .click()
      })

      await applicationTest.step(
        'Check that conclusion screen header is visible to view the application',
        async () => {
          await expect(
            page
              .getByRole('heading', {
                name: label(
                  socialInsuranceAdministrationMessage.conclusionScreen
                    .receivedTitle,
                ),
              })
              .first(),
          ).toBeVisible()
        },
      )
    },
  )
})
