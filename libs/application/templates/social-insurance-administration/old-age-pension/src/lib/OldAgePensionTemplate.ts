import { assign } from 'xstate'
import unset from 'lodash/unset'
import set from 'lodash/set'

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
  InstitutionNationalIds,
  defineTemplateApi,
} from '@island.is/application/types'
import {
  coreMessages,
  pruneAfterDays,
  DefaultStateLifeCycle,
  coreHistoryMessages,
  EphemeralStateLifeCycle,
} from '@island.is/application/core'
import {
  Actions,
  ConnectedApplications,
  Events,
  NO,
  Roles,
  States,
} from './constants'
import { dataSchema } from './dataSchema'
import { oldAgePensionFormMessage, statesMessages } from './messages'
import { answerValidators } from './answerValidators'
import {
  NationalRegistryResidenceHistoryApi,
  NationalRegistryCohabitantsApi,
  SocialInsuranceAdministrationBankInfoApi,
  SocialInsuranceAdministrationSpouseInNursingHomeApi,
  SocialInsuranceAdministrationIsApplicantEligibleApi,
} from '../dataProviders'
import { Features } from '@island.is/feature-flags'
import {
  childCustodyLivesWithApplicant,
  getApplicationAnswers,
} from './oldAgePensionUtils'

const OldAgePensionTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.OLD_AGE_PENSION,
  name: oldAgePensionFormMessage.shared.applicationTitle,
  institution: oldAgePensionFormMessage.shared.institution,
  featureFlag: Features.oldAgePensionApplication,
  translationNamespaces: [ApplicationConfigurations.OldAgePension.translation],
  dataSchema,
  allowMultipleApplicationsInDraft: false,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: States.PREREQUISITES,
          status: 'draft',
          lifecycle: EphemeralStateLifeCycle,
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
                SocialInsuranceAdministrationBankInfoApi,
                SocialInsuranceAdministrationSpouseInNursingHomeApi,
                SocialInsuranceAdministrationIsApplicantEligibleApi,
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
        exit: [
          'clearHouseholdSupplement',
          'clearChildPension',
          'clearChildPensionAddChild',
          'clearChildPensionChildSupport',
        ],
        meta: {
          name: States.DRAFT,
          status: 'draft',
          lifecycle: pruneAfterDays(30),
          actionCard: {
            description: statesMessages.draftDescription,
            historyLogs: {
              onEvent: DefaultEvents.SUBMIT,
              logMessage: coreHistoryMessages.applicationSent,
            },
          },
          progress: 0.25,
          onExit: defineTemplateApi({
            action: Actions.SEND_APPLICATION,
            throwOnError: true,
          }),
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
        entry: ['assignOrganization'],
        exit: ['clearAssignees'],
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
            {
              id: Roles.ORGINISATION_REVIEWER,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.EDIT]: { target: States.DRAFT },
          INREVIEW: {
            target: States.TRYGGINGASTOFNUN_IN_REVIEW,
          },
        },
      },
      [States.TRYGGINGASTOFNUN_IN_REVIEW]: {
        entry: ['assignOrganization'],
        exit: ['clearAssignees'],
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
                onEvent: DefaultEvents.SUBMIT,
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
            {
              id: Roles.ORGINISATION_REVIEWER,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: { target: States.APPROVED },
          [DefaultEvents.REJECT]: { target: States.REJECTED },
          ADDITIONALDOCUMENTSREQUIRED: {
            target: States.ADDITIONAL_DOCUMENTS_REQUIRED,
          },
          PENDING: { target: States.PENDING },
          // DISMISSED: { target: States.DISMISSED },
        },
      },
      [States.ADDITIONAL_DOCUMENTS_REQUIRED]: {
        entry: ['assignOrganization'],
        exit: ['clearAssignees'],
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
            {
              id: Roles.ORGINISATION_REVIEWER,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              write: 'all',
            },
          ],
        },
        on: {
          SUBMIT: [{ target: States.TRYGGINGASTOFNUN_IN_REVIEW }],
        },
      },
      [States.PENDING]: {
        meta: {
          name: States.PENDING,
          progress: 1,
          status: 'inprogress',
          actionCard: {
            tag: {
              label: statesMessages.pendingTag,
            },
            pendingAction: {
              title: statesMessages.applicationPending,
              content: statesMessages.applicationPendingDescription,
              displayStatus: 'info',
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
      // // TODO: Not implemented in Smári yet
      // [States.DISMISSED]: {
      //   meta: {
      //     name: States.DISMISSED,
      //     progress: 1,
      //     status: 'rejected',
      //     actionCard: {
      //       pendingAction: {
      //         title: statesMessages.applicationDismissed,
      //         content: statesMessages.applicationDismissedDescription,
      //         displayStatus: 'error',
      //       },
      //     },
      //     lifecycle: DefaultStateLifeCycle,
      //     roles: [
      //       {
      //         id: Roles.APPLICANT,
      //         formLoader: () =>
      //           import('../forms/InReview').then((val) =>
      //             Promise.resolve(val.InReview),
      //           ),
      //         read: 'all',
      //       },
      //     ],
      //   },
      // },
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
            pendingAction: {
              title: statesMessages.applicationRejected,
              content: statesMessages.applicationRejectedDescription,
              displayStatus: 'error',
            },
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
              read: 'all',
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
      assignOrganization: assign((context) => {
        const { application } = context
        const TR_ID = InstitutionNationalIds.TRYGGINGASTOFNUN ?? ''

        const assignees = application.assignees
        if (TR_ID) {
          if (Array.isArray(assignees) && !assignees.includes(TR_ID)) {
            assignees.push(TR_ID)
            set(application, 'assignees', assignees)
          } else {
            set(application, 'assignees', [TR_ID])
          }
        }

        return context
      }),
      clearChildPension: assign((context) => {
        const { application } = context
        const { connectedApplications } = getApplicationAnswers(
          application.answers,
        )

        if (
          !connectedApplications?.includes(ConnectedApplications.CHILDPENSION)
        ) {
          unset(application.answers, 'childPensionAddChild')
          unset(application.answers, 'childPensionRepeater')
          unset(application.answers, 'childPension')
          unset(application.answers, 'fileUploadChildPension')
        }

        return context
      }),
      clearChildPensionChildSupport: assign((context) => {
        const { application } = context

        const doesNotLiveWithApplicant = childCustodyLivesWithApplicant(
          application.answers,
          application.externalData,
        )

        if (!doesNotLiveWithApplicant)
          unset(application.answers, 'fileUploadChildPension.childSupport')

        return context
      }),
      clearChildPensionAddChild: assign((context) => {
        const { application } = context
        const { childPensionAddChild } = getApplicationAnswers(
          application.answers,
        )

        if (childPensionAddChild === NO) {
          unset(application.answers, 'childPensionRepeater')
          unset(application.answers, 'fileUploadChildPension.maintenance')
        }

        return context
      }),
      clearAssignees: assign((context) => ({
        ...context,
        application: {
          ...context.application,
          assignees: [],
        },
      })),
    },
  },
  mapUserToRole(
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (id === application.applicant) {
      return Roles.APPLICANT
    }

    const TR_ID = InstitutionNationalIds.TRYGGINGASTOFNUN
    if (id === TR_ID) {
      return Roles.ORGINISATION_REVIEWER
    }

    return undefined
  },
  answerValidators,
}

export default OldAgePensionTemplate
