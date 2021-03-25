import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
} from '@island.is/application/core'
import { DataProtectionComplaintSchema } from './dataSchema'
import { application } from './messages/application'

type DataProtectionComplaintEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ASSIGN }

enum Roles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee',
}

const DataProtectionComplaintTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<DataProtectionComplaintEvent>,
  DataProtectionComplaintEvent
> = {
  type: ApplicationTypes.DATA_PROTECTION_AUTHORITY_COMPLAINT,
  name: application.name.defaultMessage,
  dataSchema: DataProtectionComplaintSchema,
  stateMachineConfig: {
    initial: 'draft',
    states: {
      draft: {
        meta: {
          name: application.name.defaultMessage,
          progress: 0.25,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ComplaintForm').then((module) =>
                  Promise.resolve(module.ComplaintForm),
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
            target: 'inReview',
          },
        },
      },
    },
  },
  mapUserToRole(
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    return Roles.APPLICANT
  },
}

export default DataProtectionComplaintTemplate
