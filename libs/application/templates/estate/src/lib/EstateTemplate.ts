import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
} from '@island.is/application/core'
import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
} from '@island.is/application/types'
import { m } from './messages'
import { estateSchema } from './dataSchema'
import { EstateEvent, EstateTypes, Roles, States } from './constants'
import { Features } from '@island.is/feature-flags'
import { ApiActions } from '../shared'

const EstateTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<EstateEvent>,
  EstateEvent
> = {
  type: ApplicationTypes.ESTATE,
  name: m.name,
  institution: m.institutionName,
  dataSchema: estateSchema,
  featureFlag: Features.estateApplication,
  allowMultipleApplicationsInDraft: true,
  stateMachineConfig: {
    initial: States.prerequisites,
    states: {
      [States.prerequisites]: {
        meta: {
          name: '',
          progress: 0,
          lifecycle: {
            shouldBeListed: false,
            shouldBePruned: true,
            whenToPrune: 24 * 3600 * 1000,
          },
          onEntry: {
            apiModuleAction: ApiActions.syslumennOnEntry,
            shouldPersistToExternalData: true,
            throwOnError: false,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Prerequisites').then((module) =>
                  Promise.resolve(module.Prerequisites),
                ),
              actions: [{ event: 'SUBMIT', name: '', type: 'primary' }],
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          SUBMIT: {
            target: States.draft,
          },
        },
      },
      [States.draft]: {
        meta: {
          name: '',
          actionCard: {
            title: m.draftTitle,
            description: m.draftDescription,
          },
          progress: 0.25,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT_NO_PROPERTY,
              formLoader: () =>
                import('../forms/EstateWithoutProperty').then((module) =>
                  Promise.resolve(module.estateWithoutProperty),
                ),
              actions: [{ event: 'SUBMIT', name: '', type: 'primary' }],
              write: 'all',
              delete: true,
            },
            {
              id: Roles.APPLICANT_OFFICIAL_ESTATE,
              formLoader: () =>
                import('../forms/OfficialExchange').then((module) =>
                  Promise.resolve(module.officialExchange),
                ),
              actions: [{ event: 'SUBMIT', name: '', type: 'primary' }],
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          SUBMIT: [
            {
              target: States.done,
            },
          ],
        },
      },
      [States.done]: {
        meta: {
          name: 'Approved',
          progress: 1,
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT_NO_PROPERTY,
              formLoader: () =>
                import('../forms/Done').then((val) =>
                  Promise.resolve(val.Done),
                ),
              read: 'all',
            },
            {
              id: Roles.APPLICANT_OFFICIAL_ESTATE,
              formLoader: () =>
                import('../forms/Done').then((val) =>
                  Promise.resolve(val.Done),
                ),
              read: 'all',
            },
          ],
        },
        type: 'final' as const,
      },
    },
  },
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (application.applicant === nationalId) {
      if (application.answers.selectedEstate === EstateTypes.officialEstate) {
        return Roles.APPLICANT_OFFICIAL_ESTATE
      } else if (
        application.answers.selectedEstate === EstateTypes.noPropertyEstate
      ) {
        return Roles.APPLICANT_NO_PROPERTY
      } else return Roles.APPLICANT
    }
  },
}

export default EstateTemplate
