import { assign } from 'xstate'
import unset from 'lodash/unset'
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
  ChildrenCustodyInformationApi,
} from '@island.is/application/types'
import {
  coreMessages,
  pruneAfterDays,
  DefaultStateLifeCycle,
} from '@island.is/application/core'
import {
  ConnectedApplications,
  Events,
  Roles,
  States,
} from './constants'
import { dataSchema } from './dataSchema'
import { oldAgePensionFormMessage, statesMessages } from './messages'
import { answerValidators } from './answerValidators'
import {
  NationalRegistryResidenceHistoryApi,
  NationalRegistryCohabitantsApi,
} from '../dataProviders'
import { getApplicationAnswers } from './oldAgePensionUtils'

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
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: States.PREREQUISITES,
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
                ChildrenCustodyInformationApi,
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
        exit: ['clearHouseholdSupplement'],
        meta: {
          name: States.DRAFT,
          status: 'draft',
          lifecycle: pruneAfterDays(30),
          actionCard: {
            description: statesMessages.draftDescription,
            historyLogs: {
              onEvent: DefaultEvents.SUBMIT,
              logMessage: statesMessages.applicationSent,
            },
          },
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
        on: {
          SUBMIT: [{ target: States.TRYGGINGASTOFNUN_SUBMITTED }],
        },
      },
      [States.TRYGGINGASTOFNUN_SUBMITTED]: {
        meta: {
          name: States.TRYGGINGASTOFNUN_SUBMITTED,
          progress: 0.75,
          status: 'inprogress',
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            tag: {
              label: statesMessages.pendingTag,
            },
            pendingAction: {
              title: statesMessages.tryggingastofnunSubmittedTitle,
              content: statesMessages.tryggingastofnunSubmittedContent,
              displayStatus: 'info',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.EDIT,
                logMessage: statesMessages.applicationEdited,
              },
            ],
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              actions: [
                {
                  event: DefaultEvents.EDIT,
                  name: 'Breyta umsókn',
                  type: 'primary',
                },
              ],
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.EDIT]: { target: States.DRAFT },
        },
      },
      [States.TRYGGINGASTOFNUN_IN_REVIEW]: {
        meta: {
          name: States.TRYGGINGASTOFNUN_IN_REVIEW,
          progress: 0.75,
          status: 'inprogress',
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            pendingAction: {
              title: statesMessages.tryggingastofnunInReviewTitle,
              content: statesMessages.tryggingastofnunInReviewContent,
              displayStatus: 'info',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.APPROVE,
                logMessage: statesMessages.additionalDocumentsAdded,
              },
            ],
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              read: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: { target: States.APPROVED },
          [DefaultEvents.REJECT]: { target: States.REJECTED },
          ADDITIONALDOCUMENTSREQUIRED: {
            target: States.ADDITIONAL_DOCUMENTS_REQUIRED,
          },
        },
      },
      [States.ADDITIONAL_DOCUMENTS_REQUIRED]: {
        meta: {
          status: 'inprogress',
          name: States.ADDITIONAL_DOCUMENTS_REQUIRED,
          actionCard: {
            tag: {
              label: coreMessages.tagsRequiresAction,
              variant: 'red',
            },
            pendingAction: {
              title: statesMessages.additionalDocumentRequired,
              content: statesMessages.additionalDocumentRequiredDescription,
              displayStatus: 'warning',
            },
          },
          lifecycle: pruneAfterDays(970),
          progress: 0.5,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/AdditionalDocumentsRequired').then((val) =>
                  Promise.resolve(val.AdditionalDocumentsRequired),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: {
            target: States.TRYGGINGASTOFNUN_IN_REVIEW,
          },
        },
      },
      [States.APPROVED]: {
        meta: {
          name: States.APPROVED,
          progress: 1,
          status: 'approved',
          actionCard: {
            pendingAction: {
              title: statesMessages.applicationApproved,
              content: statesMessages.applicationApprovedDescription,
              displayStatus: 'success',
            },
          },
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              read: 'all',
            },
          ],
        },
      },
      [States.REJECTED]: {
        meta: {
          name: States.REJECTED,
          progress: 1,
          status: 'rejected',
          actionCard: {
            historyLogs: [
              {
                // TODO: Þurfum mögulega að breyta þessu þegar við vitum hvernig TR gerir stöðubreytingar
                onEvent: States.REJECTED,
                logMessage: statesMessages.applicationRejected,
              },
            ],
          },
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
            },
          ],
        },
      },
    },
  },
  stateMachineOptions: {
    actions: {
      clearHouseholdSupplement: assign((context) => {
        const { application } = context
        const { connectedApplications } = getApplicationAnswers(
          application.answers,
        )

        if (
          !connectedApplications?.includes(
            ConnectedApplications.HOUSEHOLDSUPPLEMENT,
          )
        ) {
          unset(application.answers, 'householdSupplement')
          unset(application.answers, 'fileUploadHouseholdSupplement')
        }

        return context
      }),
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
