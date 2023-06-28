import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  ApplicationRole,
  defineTemplateApi,
  UserProfileApi,
} from '@island.is/application/types'
import { dataSchema } from './dataSchema'
import { Roles, States, Events, ApiActions } from './constants'
import { m } from './messages'
import { FeatureFlagClient, Features } from '@island.is/feature-flags'
import {
  getApplicationFeatureFlags,
  OperatingLicenseFeatureFlags,
} from './getApplicationFeatureFlags'
import {
  JudicialAdministrationApi,
  CriminalRecordApi,
  NoDebtCertificateApi,
  SyslumadurPaymentCatalogApi,
} from '../dataProviders'
import { AuthDelegationType } from '@island.is/shared/types'

const oneDay = 24 * 3600 * 1000
const thirtyDays = 24 * 3600 * 1000 * 30

const pruneAfter = (time: number) => {
  return {
    shouldBeListed: true,
    shouldBePruned: true,
    whenToPrune: time,
  }
}

const OperatingLicenseTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.OPERATING_LCENSE,
  name: m.formName.defaultMessage,
  featureFlag: Features.operatingLicense,
  allowedDelegations: [{ type: AuthDelegationType.ProcurationHolder }],
  dataSchema,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: m.formName.defaultMessage,
          status: 'draft',
          progress: 0.33,
          lifecycle: pruneAfter(oneDay),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: async ({ featureFlagClient }) => {
                const featureFlags = await getApplicationFeatureFlags(
                  featureFlagClient as FeatureFlagClient,
                )
                return import('../forms/draft/index').then((val) =>
                  Promise.resolve(
                    val.getApplication({
                      allowFakeData:
                        featureFlags[OperatingLicenseFeatureFlags.ALLOW_FAKE],
                    }),
                  ),
                )
              },

              actions: [
                {
                  event: DefaultEvents.PAYMENT,
                  name: m.confirm.defaultMessage,
                  type: 'primary',
                },
              ],
              write: 'all',
              delete: true,
              api: [
                SyslumadurPaymentCatalogApi,
                UserProfileApi,
                CriminalRecordApi,
                NoDebtCertificateApi,
                JudicialAdministrationApi,
              ],
            },
          ],
        },
        on: {
          [DefaultEvents.PAYMENT]: { target: States.PAYMENT },
        },
      },
      [States.PAYMENT]: {
        meta: {
          name: 'Payment state',
          status: 'inprogress',
          actionCard: {
            description: m.payment,
          },
          progress: 0.9,
          lifecycle: { shouldBeListed: true, shouldBePruned: false },
          onEntry: defineTemplateApi({
            action: ApiActions.createCharge,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Payment').then((val) =>
                  Promise.resolve(val.payment),
                ),
              actions: [
                { event: DefaultEvents.SUBMIT, name: '', type: 'primary' },
              ],
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.DONE },
        },
      },
      [States.DONE]: {
        meta: {
          name: 'Done',
          status: 'completed',
          progress: 1,
          lifecycle: pruneAfter(thirtyDays),
          onEntry: defineTemplateApi({
            action: ApiActions.submitOperatingLicenseApplication,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Done').then((val) =>
                  Promise.resolve(val.Done),
                ),
              read: {
                externalData: ['submitOperatingLicenseApplication'],
              },
            },
          ],
        },
      },
    },
  },
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (
      nationalId === application.applicant ||
      application.applicantActors.includes(nationalId)
    ) {
      return Roles.APPLICANT
    }
    return undefined
  },
}

export default OperatingLicenseTemplate
