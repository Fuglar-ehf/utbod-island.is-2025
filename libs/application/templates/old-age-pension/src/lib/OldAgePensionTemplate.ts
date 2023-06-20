import {
  ApplicationTemplate,
  ApplicationContext,
  ApplicationStateSchema,
  Application,
  ApplicationTypes,
  ApplicationConfigurations,
  ApplicationRole,
  DefaultEvents,
  NationalRegistryUserApi,
  UserProfileApi,
  NationalRegistrySpouseApi,
} from '@island.is/application/types'

import { pruneAfterDays } from '@island.is/application/core'

import { Events, Roles, States } from './constants'
import { dataSchema } from './dataSchema'
import { oldAgePensionFormMessage } from './messages'
import { answerValidators } from './answerValidators'
import {
  NationalRegistryResidenceHistoryApi,
  NationalRegistryCohabitantsApi,
} from '../dataProviders'

const OldAgePensionTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.OLD_AGE_PENSION,
  name: oldAgePensionFormMessage.shared.applicationTitle,
  institution: oldAgePensionFormMessage.shared.institution,
  readyForProduction: false, // hafa þett svona atm?
  translationNamespaces: [ApplicationConfigurations.OldAgePension.translation],
  dataSchema,
  stateMachineConfig: {
    initial: States.PREREQUESITES,
    states: {
      [States.PREREQUESITES]: {
        meta: {
          name: States.PREREQUESITES,
          status: 'draft',
          lifecycle: pruneAfterDays(1),
          progress: 0.25,
          //onExit: defineTemplateApi - kalla á TR
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Prerequisites').then((val) =>
                  Promise.resolve(val.PrerequisitesForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Submit',
                  type: 'primary',
                },
              ],
              write: 'all',
              api: [
                NationalRegistryUserApi,
                UserProfileApi,
                NationalRegistrySpouseApi,
                NationalRegistryResidenceHistoryApi,
                NationalRegistryCohabitantsApi,
              ],
              delete: true,
            },
          ],
        },
        on: {
          SUBMIT: States.DRAFT,
        },
      },
      [States.DRAFT]: {
        meta: {
          name: States.DRAFT,
          status: 'draft',
          lifecycle: pruneAfterDays(30),
          progress: 0.25,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/OldAgePensionForm').then((val) =>
                  Promise.resolve(val.OldAgePensionForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Submit',
                  type: 'primary',
                },
              ],
              write: 'all',
              delete: true,
            },
          ],
        },
        // on: {
        //   SUBMIT: [],
        // },
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
  answerValidators,
}

export default OldAgePensionTemplate
