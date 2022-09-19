import { assign } from 'xstate'
import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  defineTemplateApi,
} from '@island.is/application/types'
import { getSelectedChildrenFromExternalData } from '@island.is/application/templates/family-matters-core/utils'
import { dataSchema } from './dataSchema'
import { CRCApplication } from '../types'
import { Roles, ApplicationStates } from './constants'
import { application, stateDescriptions, stateLabels } from './messages'
import {
  ChildrenCustodyInformationApi,
  NationalRegistryUserApi,
  UserProfileApi,
} from '../dataProviders'

type Events =
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.REJECT }

enum TemplateApiActions {
  submitApplication = 'submitApplication',
  sendNotificationToCounterParty = 'sendNotificationToCounterParty',
  rejectApplication = 'rejectApplication',
  approveApplication = 'approveApplication',
  rejectedApplication = 'rejectedApplication',
}

const applicationName = 'Umsókn um breytt lögheimili barns'

const oneYear = 24 * 3600 * 1000 * 365
const twentyEightDays = 24 * 3600 * 1000 * 28

const pruneAfter = (time: number) => {
  return {
    shouldBeListed: true,
    shouldBePruned: true,
    whenToPrune: time,
  }
}

const ChildrenResidenceChangeTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.CHILDREN_RESIDENCE_CHANGE,
  name: application.name,
  readyForProduction: true,
  dataSchema,
  stateMachineConfig: {
    initial: ApplicationStates.DRAFT,
    states: {
      [ApplicationStates.DRAFT]: {
        meta: {
          name: applicationName,
          actionCard: {
            description: stateDescriptions.draft,
          },
          lifecycle: pruneAfter(oneYear),
          roles: [
            {
              id: Roles.ParentA,
              formLoader: () =>
                import('../forms/ChildrenResidenceChangeForm').then((module) =>
                  Promise.resolve(module.ChildrenResidenceChangeForm),
                ),
              actions: [
                {
                  event: DefaultEvents.ASSIGN,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              delete: true,
              read: 'all',
              write: {
                answers: [
                  'reason',
                  'parentA',
                  'approveTerms',
                  'counterParty',
                  'selectDuration',
                  'selectedChildren',
                  'approveExternalData',
                  'residenceChangeReason',
                  'approveChildSupportTerms',
                ],
                externalData: [
                  'UserProfile.userProfile',
                  'NationalRegistry.nationalRegistry',
                  'NationalRegistry.childrenCustodyInformation',
                ],
              },
              api: [
                ChildrenCustodyInformationApi,
                NationalRegistryUserApi,
                UserProfileApi,
              ],
            },
          ],
        },
        on: {
          ASSIGN: {
            target: ApplicationStates.IN_REVIEW,
          },
        },
      },
      [ApplicationStates.IN_REVIEW]: {
        entry: 'assignToOtherParent',
        meta: {
          name: applicationName,
          actionCard: {
            description: stateDescriptions.inReview,
          },
          lifecycle: pruneAfter(twentyEightDays),
          onEntry: defineTemplateApi({
            action: TemplateApiActions.sendNotificationToCounterParty,
          }),
          roles: [
            {
              id: Roles.ParentB,
              formLoader: () =>
                import('../forms/ParentBForm').then((module) =>
                  Promise.resolve(module.ParentBForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
                {
                  event: DefaultEvents.REJECT,
                  name: 'Hafna',
                  type: 'reject',
                },
              ],
              read: 'all',
              write: {
                answers: [
                  'parentB',
                  'acceptContract',
                  'approveTermsParentB',
                  'confirmContractParentB',
                  'approveChildSupportTermsParentB',
                ],
                externalData: [],
              },
            },
            {
              id: Roles.ParentA,
              formLoader: () =>
                import('../forms/ApplicationConfirmation').then((module) =>
                  Promise.resolve(module.ApplicationConfirmation),
                ),
              read: 'all',
            },
          ],
        },
        on: {
          SUBMIT: {
            target: ApplicationStates.SUBMITTED,
          },
          REJECT: {
            target: ApplicationStates.REJECTEDBYPARENTB,
          },
        },
      },
      [ApplicationStates.SUBMITTED]: {
        meta: {
          name: applicationName,
          actionCard: {
            description: stateDescriptions.submitted,
            tag: { label: stateLabels.submitted },
          },
          lifecycle: pruneAfter(oneYear),
          onEntry: defineTemplateApi({
            action: TemplateApiActions.submitApplication,
          }),
          roles: [
            {
              id: Roles.ParentA,
              formLoader: () =>
                import('../forms/ApplicationConfirmation').then((module) =>
                  Promise.resolve(module.ApplicationConfirmation),
                ),
              read: 'all',
            },
            {
              id: Roles.ParentB,
              formLoader: () =>
                import(
                  '../forms/ParentBApplicationConfirmation'
                ).then((module) =>
                  Promise.resolve(module.ParentBApplicationConfirmation),
                ),
              read: 'all',
            },
          ],
        },
      },
      [ApplicationStates.REJECTEDBYPARENTB]: {
        meta: {
          name: applicationName,
          actionCard: {
            description: stateDescriptions.rejectedByParentB,
            tag: {
              variant: 'red',
              label: stateLabels.rejected,
            },
          },
          lifecycle: pruneAfter(oneYear),
          onEntry: defineTemplateApi({
            action: TemplateApiActions.rejectApplication,
          }),
          roles: [
            {
              id: Roles.ParentB,
              formLoader: () =>
                import('../forms/ContractRejected').then((module) =>
                  Promise.resolve(module.ParentBContractRejected),
                ),
            },
            {
              id: Roles.ParentA,
              formLoader: () =>
                import('../forms/ContractRejected').then((module) =>
                  Promise.resolve(module.ContractRejected),
                ),
              read: 'all',
            },
          ],
        },
      },
      [ApplicationStates.REJECTED]: {
        meta: {
          name: applicationName,
          actionCard: {
            description: stateDescriptions.rejected,
            tag: { label: stateLabels.rejected, variant: 'red' },
          },
          lifecycle: pruneAfter(oneYear),
          onEntry: defineTemplateApi({
            action: TemplateApiActions.rejectedApplication,
          }),
          roles: [
            {
              id: Roles.ParentA,
              formLoader: () =>
                import('../forms/ApplicationRejected').then((module) =>
                  Promise.resolve(module.ApplicationRejected),
                ),
              read: 'all',
            },
            {
              id: Roles.ParentB,
              formLoader: () =>
                import('../forms/ApplicationRejected').then((module) =>
                  Promise.resolve(module.ApplicationRejected),
                ),
              read: 'all',
            },
          ],
        },
      },
      [ApplicationStates.COMPLETED]: {
        meta: {
          name: applicationName,
          actionCard: {
            description: stateDescriptions.approved,
            tag: { label: stateLabels.approved, variant: 'blueberry' },
          },
          lifecycle: pruneAfter(oneYear),
          onEntry: defineTemplateApi({
            action: TemplateApiActions.approveApplication,
          }),
          roles: [
            {
              id: Roles.ParentA,
              formLoader: () =>
                import('../forms/ApplicationApproved').then((module) =>
                  Promise.resolve(module.ApplicationApproved),
                ),
              read: 'all',
            },
            {
              id: Roles.ParentB,
              formLoader: () =>
                import('../forms/ApplicationApproved').then((module) =>
                  Promise.resolve(module.ApplicationApproved),
                ),
              read: 'all',
            },
          ],
        },
      },
    },
  },
  stateMachineOptions: {
    actions: {
      assignToOtherParent: assign((context) => {
        // TODO: fix this..
        const {
          externalData,
          answers,
        } = (context.application as unknown) as CRCApplication
        const children = externalData.childrenCustodyInformation.data
        const selectedChildren = getSelectedChildrenFromExternalData(
          children,
          answers.selectedChildren,
        )
        const otherParent = selectedChildren[0].otherParent

        return {
          ...context,
          application: {
            ...context.application,
            assignees: [otherParent?.nationalId ?? ''],
          },
        }
      }),
    },
  },

  mapUserToRole(
    id: string,
    // TODO: Somehow use CRCApplication here
    application: Application,
  ): ApplicationRole | undefined {
    if (
      application.assignees.includes(id) &&
      application.answers.useMocks === 'yes' &&
      application.state === ApplicationStates.IN_REVIEW
    ) {
      return Roles.ParentB
    }
    if (id === application.applicant) {
      return Roles.ParentA
    }
    if (application.assignees.includes(id)) {
      return Roles.ParentB
    }
    return undefined
  },
}

export default ChildrenResidenceChangeTemplate
