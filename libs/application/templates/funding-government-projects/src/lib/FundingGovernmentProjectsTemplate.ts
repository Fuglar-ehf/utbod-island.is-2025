import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  DefaultStateLifeCycle,
  ApplicationConfigurations,
} from '@island.is/application/core'
import { FundingGovernmentProjectsSchema } from './dataSchema'
import { application } from './messages'

const States = {
  draft: 'draft',
  submitted: 'submitted',
}

type FundingGovernmentProjectsEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.SUBMIT }

enum Roles {
  APPLICANT = 'applicant',
}

enum TEMPLATE_API_ACTIONS {
  // Has to match name of action in template API module
  // (will be refactored when state machine is a part of API module)
  sendApplication = 'sendApplication',
}

const FundingGovernmentProjectsTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<FundingGovernmentProjectsEvent>,
  FundingGovernmentProjectsEvent
> = {
  type: ApplicationTypes.FUNDING_GOVERNMENT_PROJECTS,
  name: application.name,
  institution: application.institutionName,
  readyForProduction: true,
  translationNamespaces: [
    ApplicationConfigurations.FundingGovernmentProjects.translation,
  ],
  dataSchema: FundingGovernmentProjectsSchema,
  stateMachineConfig: {
    initial: States.draft,
    states: {
      [States.draft]: {
        meta: {
          name: States.draft,
          actionCard: {
            title: application.name,
            description: application.description,
          },
          progress: 0.5,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import(
                  '../forms/FundingGovernmentProjectsForm'
                ).then((module) =>
                  Promise.resolve(module.FundingGovernmentProjectsForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          SUBMIT: {
            target: States.submitted,
          },
        },
      },
      [States.submitted]: {
        meta: {
          name: States.submitted,
          actionCard: {
            title: application.name,
            description: application.description,
          },
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          onEntry: {
            apiModuleAction: TEMPLATE_API_ACTIONS.sendApplication,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import(
                  '../forms/FundingGovernmentProjectsFormSubmitted'
                ).then((module) =>
                  Promise.resolve(
                    module.FundingGovernmentProjectsFormSubmitted,
                  ),
                ),
              write: 'all',
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

export default FundingGovernmentProjectsTemplate
