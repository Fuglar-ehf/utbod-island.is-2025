import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
} from '@island.is/application/core'
import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationStateSchema,
  DefaultEvents,
  defineTemplateApi,
  JuristictionApi,
  CurrentLicenseApi,
  DrivingAssessmentApi,
  NationalRegistryUserApi,
  UserProfileApi,
  QualityPhotoApi,
  TeachersApi,
  ExistingApplicationApi,
} from '@island.is/application/types'
import { FeatureFlagClient } from '@island.is/feature-flags'
import { ApiActions } from '../shared'
import { Events, States, Roles } from './constants'
import { dataSchema } from './dataSchema'
import {
  getApplicationFeatureFlags,
  DrivingLicenseFeatureFlags,
} from './getApplicationFeatureFlags'
import { m } from './messages'
import { hasCompletedPrerequisitesStep } from './utils'
import { SyslumadurPaymentCatalogApi } from '../dataProviders'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.DRIVING_LICENSE,
  name: m.applicationForDrivingLicense,
  institution: m.nationalCommissionerOfPolice,
  dataSchema,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: m.applicationForDrivingLicense.defaultMessage,
          progress: 0.2,
          status: 'draft',
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: async ({ featureFlagClient }) => {
                const featureFlags = await getApplicationFeatureFlags(
                  featureFlagClient as FeatureFlagClient,
                )

                const getForm = await import(
                  '../forms/prerequisites/getForm'
                ).then((val) => val.getForm)

                return getForm({
                  allowFakeData:
                    featureFlags[DrivingLicenseFeatureFlags.ALLOW_FAKE],
                  allowPickLicense:
                    featureFlags[
                      DrivingLicenseFeatureFlags.ALLOW_LICENSE_SELECTION
                    ],
                })
              },
              write: 'all',
              delete: true,
              api: [
                NationalRegistryUserApi,
                TeachersApi,
                UserProfileApi,
                SyslumadurPaymentCatalogApi,
                CurrentLicenseApi,
                DrivingAssessmentApi,
                JuristictionApi,
                QualityPhotoApi,
                ExistingApplicationApi.configure({
                  params: {
                    states: [States.PAYMENT, States.DRAFT],
                    where: {
                      applicant: 'applicant',
                    },
                  },
                }),
              ],
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.DRAFT },
          [DefaultEvents.REJECT]: { target: States.DECLINED },
        },
      },
      [States.DRAFT]: {
        meta: {
          name: m.applicationForDrivingLicense.defaultMessage,
          actionCard: {
            description: m.actionCardDraft,
          },
          status: 'draft',
          progress: 0.4,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: async () => (await import('../forms/draft')).draft,
              actions: [
                {
                  event: DefaultEvents.PAYMENT,
                  name: m.continue,
                  type: 'primary',
                },
              ],
              write: 'all',
              read: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.PAYMENT]: [
            {
              target: States.PREREQUISITES,
              cond: hasCompletedPrerequisitesStep(false),
            },
            {
              target: States.PAYMENT,
              cond: hasCompletedPrerequisitesStep(true),
            },
          ],
          [DefaultEvents.REJECT]: { target: States.DECLINED },
        },
      },
      [States.PAYMENT]: {
        meta: {
          name: 'Payment state',
          status: 'inprogress',
          actionCard: {
            description: m.actionCardPayment,
          },
          progress: 0.9,
          lifecycle: DefaultStateLifeCycle,
          onEntry: defineTemplateApi({
            action: ApiActions.createCharge,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/payment').then((val) => val.payment),
              actions: [
                { event: DefaultEvents.SUBMIT, name: 'Panta', type: 'primary' },
                {
                  event: DefaultEvents.ABORT,
                  name: 'Hætta við',
                  type: 'reject',
                },
              ],
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.DONE },
          [DefaultEvents.ABORT]: { target: States.DRAFT },
        },
      },
      [States.DONE]: {
        meta: {
          name: 'Done',
          progress: 1,
          status: 'completed',
          lifecycle: DefaultStateLifeCycle,
          onEntry: defineTemplateApi({
            action: ApiActions.submitApplication,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () => import('../forms/done').then((val) => val.done),
              read: 'all',
            },
          ],
        },
      },
      [States.DECLINED]: {
        meta: {
          name: 'Declined',
          status: 'rejected',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/declined').then((val) => val.declined),
              read: 'all',
            },
          ],
        },
      },
    },
  },
  mapUserToRole(nationalId, { applicant }) {
    if (nationalId === applicant) {
      return Roles.APPLICANT
    }

    return undefined
  },
}

export default template
