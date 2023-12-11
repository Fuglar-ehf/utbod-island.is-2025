import {
  ApplicationConfigurations,
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  defineTemplateApi,
  InstitutionNationalIds,
} from '@island.is/application/types'
import {
  EphemeralStateLifeCycle,
  coreHistoryMessages,
  corePendingActionMessages,
  pruneAfterDays,
} from '@island.is/application/core'
import { Events, States, Roles } from './constants'
import { application } from './messages'
import { Features } from '@island.is/feature-flags'
import { ApiActions } from '../shared'
import { DigitalTachographWorkshopCardSchema } from './dataSchema'
import {
  NationalRegistryUserApi,
  UserProfileApi,
  SamgongustofaPaymentCatalogApi,
} from '../dataProviders'
import { buildPaymentState } from '@island.is/application/utils'
import { ChargeItemCode } from '@island.is/shared/constants'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.DIGITAL_TACHOGRAPH_WORKSHOP_CARD,
  name: application.name,
  institution: application.institutionName,
  translationNamespaces: [
    ApplicationConfigurations.DigitalTachographWorkshopCard.translation,
  ],
  dataSchema: DigitalTachographWorkshopCardSchema,
  featureFlag: Features.transportAuthorityDigitalTachographWorkshopCard,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Verkstæðiskort',
          status: 'draft',
          actionCard: {
            tag: {
              label: application.actionCardDraft,
              variant: 'blue',
            },
            historyLogs: [
              {
                logMessage: coreHistoryMessages.paymentStarted,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
          },
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/DigitalTachographWorkshopCardForm/index').then(
                  (module) =>
                    Promise.resolve(module.DigitalTachographWorkshopCardForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              write: 'all',
              delete: true,
              api: [
                NationalRegistryUserApi,
                UserProfileApi,
                SamgongustofaPaymentCatalogApi,
              ],
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.PAYMENT },
        },
      },
      [States.PAYMENT]: buildPaymentState({
        organizationId: InstitutionNationalIds.SAMGONGUSTOFA,
        chargeItemCodes: [
          ChargeItemCode.TRANSPORT_AUTHORITY_DIGITAL_TACHOGRAPH_WORKSHOP_CARD,
        ],
        submitTarget: States.COMPLETED,
        onExit: [
          defineTemplateApi({
            action: ApiActions.submitApplication,
            triggerEvent: DefaultEvents.SUBMIT,
          }),
        ],
      }),
      [States.COMPLETED]: {
        meta: {
          name: 'Completed',
          status: 'completed',
          lifecycle: pruneAfterDays(3 * 30),
          actionCard: {
            tag: {
              label: application.actionCardDone,
              variant: 'blueberry',
            },
            pendingAction: {
              title: corePendingActionMessages.applicationReceivedTitle,
              displayStatus: 'success',
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Confirmation').then((val) =>
                  Promise.resolve(val.Confirmation),
                ),
              read: 'all',
            },
          ],
        },
      },
    },
  },
  mapUserToRole(
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (id === application.applicant) {
      return Roles.APPLICANT
    }
    return undefined
  },
}

export default template
