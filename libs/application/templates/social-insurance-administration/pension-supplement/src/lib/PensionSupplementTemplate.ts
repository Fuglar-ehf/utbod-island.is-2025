import { assign } from 'xstate'
import set from 'lodash/set'
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
} from '@island.is/application/types'
import {
  coreMessages,
  pruneAfterDays,
  DefaultStateLifeCycle,
} from '@island.is/application/core'
import { Events, Roles, States, BankAccountType } from './constants'
import { dataSchema } from './dataSchema'
import { answerValidators } from './answerValidators'
import { pensionSupplementFormMessage, statesMessages } from './messages'
import {
  SocialInsuranceAdministrationApplicantApi,
  SocialInsuranceAdministrationCurrenciesApi,
} from '../dataProviders'
import { getApplicationAnswers } from './pensionSupplementUtils'

const PensionSupplementTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.PENSION_SUPPLEMENT,
  name: pensionSupplementFormMessage.shared.applicationTitle,
  institution: pensionSupplementFormMessage.shared.institution,
  readyForProduction: false, // hafa þetta svona atm?
  translationNamespaces: [
    ApplicationConfigurations.PensionSupplement.translation,
  ],
  dataSchema,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: States.PREREQUISITES,
          status: 'draft',
          lifecycle: pruneAfterDays(1),
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
                SocialInsuranceAdministrationApplicantApi,
                SocialInsuranceAdministrationCurrenciesApi,
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
        exit: ['clearBankAccountInfo'],
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
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/PensionSupplementForm').then((val) =>
                  Promise.resolve(val.PensionSupplementForm),
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
          status: 'inprogress',
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            pendingAction: {
              title: statesMessages.tryggingastofnunInReviewTitle,
              content: statesMessages.tryggingastofnunInReviewContent,
              displayStatus: 'info',
            },
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
        entry: ['moveAdditionalDocumentRequired'],
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
            historyLogs: [
              {
                onEvent: DefaultEvents.APPROVE,
                logMessage: statesMessages.additionalDocumentsAdded,
              },
            ],
          },
          lifecycle: pruneAfterDays(970),
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
      clearBankAccountInfo: assign((context) => {
        const { application } = context
        const { bankAccountType } = getApplicationAnswers(application.answers)

        if (bankAccountType === BankAccountType.ICELANDIC) {
          unset(application.answers, 'paymentInfo.iban')
          unset(application.answers, 'paymentInfo.swift')
          unset(application.answers, 'paymentInfo.bankName')
          unset(application.answers, 'paymentInfo.bankAddress')
          unset(application.answers, 'paymentInfo.currency')
        }

        if (bankAccountType === BankAccountType.FOREIGN) {
          unset(application.answers, 'paymentInfo.bank')
        }
        return context
      }),
      moveAdditionalDocumentRequired: assign((context) => {
        const { application } = context
        const { answers } = application
        const { additionalAttachmentsRequired, additionalAttachments } =
          getApplicationAnswers(answers)

        const mergedAdditionalDocumentRequired = [
          ...additionalAttachments,
          ...additionalAttachmentsRequired,
        ]

        set(
          answers,
          'fileUploadAdditionalFiles.additionalDocuments',
          mergedAdditionalDocumentRequired,
        )
        unset(answers, 'fileUploadAdditionalFilesRequired')

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

export default PensionSupplementTemplate
