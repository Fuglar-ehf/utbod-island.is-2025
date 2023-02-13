import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
  getValueViaPath,
} from '@island.is/application/core'
import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  defineTemplateApi,
  NationalRegistryUserApi,
  UserProfileApi,
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
  name: ({ answers }) =>
    answers.selectedEstate
      ? m.prerequisitesTitle.defaultMessage + ' - ' + answers.selectedEstate
      : m.prerequisitesTitle.defaultMessage,
  institution: m.institution,
  dataSchema: estateSchema,
  featureFlag: Features.estateApplication,
  allowMultipleApplicationsInDraft: true,
  stateMachineConfig: {
    initial: States.prerequisites,
    states: {
      [States.prerequisites]: {
        meta: {
          name: '',
          status: 'draft',
          progress: 0,
          lifecycle: {
            shouldBeListed: false,
            shouldBePruned: true,
            whenToPrune: 24 * 3600 * 1000,
          },
          onEntry: defineTemplateApi({
            action: ApiActions.syslumennOnEntry,
            shouldPersistToExternalData: true,
            throwOnError: false,
          }),
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
          status: 'draft',
          actionCard: {
            title: '', //TBD
            description: '', //TBD
          },
          progress: 0.25,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT_NO_PROPERTY,
              formLoader: () =>
                import('../forms/EstateWithNoProperty/form').then((module) =>
                  Promise.resolve(module.form),
                ),
              actions: [{ event: 'SUBMIT', name: '', type: 'primary' }],
              write: 'all',
              delete: true,
              api: [NationalRegistryUserApi, UserProfileApi],
            },
            {
              id: Roles.APPLICANT_OFFICIAL_ESTATE,
              formLoader: () =>
                import('../forms/OfficialExchange/form').then((module) =>
                  Promise.resolve(module.form),
                ),
              actions: [{ event: 'SUBMIT', name: '', type: 'primary' }],
              write: 'all',
              delete: true,
              api: [NationalRegistryUserApi, UserProfileApi],
            },
            {
              id: Roles.APPLICANT_RESIDENCE_PERMIT,
              formLoader: () =>
                import('../forms/ResidencePermit/form').then((module) =>
                  Promise.resolve(module.form),
                ),
              actions: [{ event: 'SUBMIT', name: '', type: 'primary' }],
              write: 'all',
              delete: true,
              api: [NationalRegistryUserApi, UserProfileApi],
            },
            {
              id: Roles.APPLICANT_PRIVATE_EXCHANGE,
              formLoader: () =>
                //TODO: check if we can merge PrivateExchange and ResidencePermit forms
                import('../forms/PrivateExchange/form').then((module) =>
                  Promise.resolve(module.form),
                ),
              actions: [{ event: 'SUBMIT', name: '', type: 'primary' }],
              write: 'all',
              delete: true,
              api: [NationalRegistryUserApi, UserProfileApi],
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
          status: 'approved',
          progress: 1,
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT_NO_PROPERTY,
              formLoader: () =>
                import('../forms/EstateWithNoProperty/done').then((val) =>
                  Promise.resolve(val.done),
                ),
              read: 'all',
            },
            {
              id: Roles.APPLICANT_OFFICIAL_ESTATE,
              formLoader: () =>
                import('../forms/OfficialExchange/done').then((val) =>
                  Promise.resolve(val.done),
                ),
              read: 'all',
            },
            {
              id: Roles.APPLICANT_RESIDENCE_PERMIT,
              formLoader: () =>
                import('../forms/ResidencePermit/done').then((val) =>
                  Promise.resolve(val.done),
                ),
              read: 'all',
            },
            {
              id: Roles.APPLICANT_PRIVATE_EXCHANGE,
              formLoader: () =>
                import('../forms/PrivateExchange/done').then((val) =>
                  Promise.resolve(val.done),
                ),
              read: 'all',
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
    if (application.applicant === nationalId) {
      const selectedEstate = getValueViaPath<string>(
        application.answers,
        'selectedEstate',
      )
      if (selectedEstate === EstateTypes.officialEstate) {
        return Roles.APPLICANT_OFFICIAL_ESTATE
      } else if (selectedEstate === EstateTypes.noPropertyEstate) {
        return Roles.APPLICANT_NO_PROPERTY
      } else if (selectedEstate === EstateTypes.residencePermit) {
        return Roles.APPLICANT_RESIDENCE_PERMIT
      } else if (selectedEstate === EstateTypes.privateExchange) {
        return Roles.APPLICANT_PRIVATE_EXCHANGE
      } else return Roles.APPLICANT
    }
  },
}

export default EstateTemplate
