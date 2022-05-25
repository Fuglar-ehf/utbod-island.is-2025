import { assign } from 'xstate'
import set from 'lodash/set'
import unset from 'lodash/unset'
import cloneDeep from 'lodash/cloneDeep'

import {
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTypes,
  ApplicationTemplate,
  Application,
  DefaultEvents,
  DefaultStateLifeCycle,
  ApplicationConfigurations,
  EphemeralStateLifeCycle,
} from '@island.is/application/core'

import {
  YES,
  API_MODULE_ACTIONS,
  States,
  ParentalRelations,
  NO,
  MANUAL,
  SPOUSE,
  NO_PRIVATE_PENSION_FUND,
  NO_UNION,
} from '../constants'
import { dataSchema } from './dataSchema'
import { answerValidators } from './answerValidators'
import { parentalLeaveFormMessages, statesMessages } from './messages'
import {
  hasEmployer,
  needsOtherParentApproval,
} from './parentalLeaveTemplateUtils'
import {
  getApplicationAnswers,
  getOtherParentId,
  getSelectedChild,
} from '../lib/parentalLeaveUtils'

type Events =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ABORT }
  | { type: DefaultEvents.EDIT }
  | { type: 'MODIFY' } // Ex: The user might modify their 'edits'.

enum Roles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee',
}

const ParentalLeaveTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.PARENTAL_LEAVE,
  name: parentalLeaveFormMessages.shared.name,
  institution: parentalLeaveFormMessages.shared.institution,
  readyForProduction: true,
  translationNamespaces: [ApplicationConfigurations.ParentalLeave.translation],
  dataSchema,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        exit: [
          'attemptToSetPrimaryParentAsOtherParent',
          'setRightsToOtherParent',
          'setAllowanceToOtherParent',
        ],
        meta: {
          name: States.PREREQUISITES,
          lifecycle: EphemeralStateLifeCycle,
          progress: 0.25,
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
              delete: true,
            },
          ],
        },
        on: {
          SUBMIT: States.DRAFT,
        },
      },
      [States.DRAFT]: {
        entry: 'clearAssignees',
        exit: [
          'setOtherParentIdIfSelectedSpouse',
          'setPrivatePensionValuesIfUsePrivatePensionFundIsNO',
          'setUnionValuesIfUseUnionIsNO',
          'clearPersonalAllowanceIfUsePersonalAllowanceIsNo',
          'clearSpouseAllowanceIfUseSpouseAllowanceIsNo',
          'setPersonalUsageToHundredIfUseAsMuchAsPossibleIsYes',
          'setSpouseUsageToHundredIfUseAsMuchAsPossibleIsYes',
        ],
        meta: {
          name: States.DRAFT,
          actionCard: {
            description: statesMessages.draftDescription,
          },
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: 30 * 24 * 3600 * 1000, // 30 days
          },
          progress: 0.25,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ParentalLeaveForm').then((val) =>
                  Promise.resolve(val.ParentalLeaveForm),
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
          SUBMIT: [
            {
              target: States.OTHER_PARENT_APPROVAL,
              cond: needsOtherParentApproval,
            },
            { target: States.EMPLOYER_WAITING_TO_ASSIGN, cond: hasEmployer },
            {
              target: States.VINNUMALASTOFNUN_APPROVAL,
            },
          ],
        },
      },
      [States.OTHER_PARENT_APPROVAL]: {
        entry: 'assignToOtherParent',
        exit: ['clearAssignees', 'removePeriodsOrAllowanceOnSpouseRejection'],
        meta: {
          name: States.OTHER_PARENT_APPROVAL,
          actionCard: {
            description: statesMessages.otherParentApprovalDescription,
          },
          lifecycle: DefaultStateLifeCycle,
          progress: 0.4,
          onEntry: {
            apiModuleAction: API_MODULE_ACTIONS.assignOtherParent,
            throwOnError: true,
          },
          roles: [
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/OtherParentApproval').then((val) =>
                  Promise.resolve(val.OtherParentApproval),
                ),
              actions: [
                {
                  event: DefaultEvents.APPROVE,
                  name: 'Approve',
                  type: 'primary',
                },
                { event: DefaultEvents.REJECT, name: 'Reject', type: 'reject' },
              ],
              read: {
                answers: [
                  'requestRights',
                  'usePersonalAllowanceFromSpouse',
                  'personalAllowanceFromSpouse',
                ],
              },
            },
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              read: 'all',
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: [
            {
              target: States.EMPLOYER_WAITING_TO_ASSIGN,
              cond: hasEmployer,
            },
            {
              target: States.VINNUMALASTOFNUN_APPROVAL,
            },
          ],
          [DefaultEvents.EDIT]: { target: States.DRAFT },
          [DefaultEvents.REJECT]: { target: States.OTHER_PARENT_ACTION },
        },
      },
      [States.OTHER_PARENT_ACTION]: {
        meta: {
          name: States.OTHER_PARENT_ACTION,
          actionCard: {
            description: statesMessages.otherParentActionDescription,
          },
          lifecycle: DefaultStateLifeCycle,
          progress: 0.4,
          onEntry: {
            apiModuleAction:
              API_MODULE_ACTIONS.notifyApplicantOfRejectionFromOtherParent,
            throwOnError: true,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/DraftRequiresAction').then((val) =>
                  Promise.resolve(val.DraftRequiresAction),
                ),
              read: 'all',
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.EDIT]: { target: States.DRAFT },
        },
      },
      [States.EMPLOYER_WAITING_TO_ASSIGN]: {
        exit: 'setEmployerReviewerNationalRegistryId',
        meta: {
          name: States.EMPLOYER_WAITING_TO_ASSIGN,
          actionCard: {
            description: statesMessages.employerWaitingToAssignDescription,
          },
          lifecycle: DefaultStateLifeCycle,
          progress: 0.4,
          onEntry: {
            apiModuleAction: API_MODULE_ACTIONS.assignEmployer,
            throwOnError: true,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              read: 'all',
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.ASSIGN]: { target: States.EMPLOYER_APPROVAL },
          [DefaultEvents.REJECT]: { target: States.EMPLOYER_ACTION },
          [DefaultEvents.EDIT]: { target: States.DRAFT },
        },
      },
      [States.EMPLOYER_APPROVAL]: {
        exit: 'clearAssignees',
        meta: {
          name: States.EMPLOYER_APPROVAL,
          actionCard: {
            description: statesMessages.employerApprovalDescription,
          },
          lifecycle: DefaultStateLifeCycle,
          progress: 0.5,
          roles: [
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/EmployerApproval').then((val) =>
                  Promise.resolve(val.EmployerApproval),
                ),
              read: {
                answers: [
                  'periods',
                  'selectedChild',
                  'payments',
                  'firstPeriodStart',
                ],
                externalData: ['children'],
              },
              write: {
                answers: ['employerNationalRegistryId'],
              },
              actions: [
                {
                  event: DefaultEvents.APPROVE,
                  name: 'Approve',
                  type: 'primary',
                },
                { event: DefaultEvents.REJECT, name: 'Reject', type: 'reject' },
              ],
            },
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              read: 'all',
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: [
            {
              target: States.VINNUMALASTOFNUN_APPROVAL,
            },
          ],
          [DefaultEvents.REJECT]: { target: States.EMPLOYER_ACTION },
          [DefaultEvents.EDIT]: { target: States.DRAFT },
        },
      },
      [States.EMPLOYER_ACTION]: {
        meta: {
          name: States.EMPLOYER_ACTION,
          actionCard: {
            description: statesMessages.employerActionDescription,
          },
          lifecycle: DefaultStateLifeCycle,
          progress: 0.5,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/DraftRequiresAction').then((val) =>
                  Promise.resolve(val.DraftRequiresAction),
                ),
              read: 'all',
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.EDIT]: { target: States.DRAFT },
        },
      },
      [States.VINNUMALASTOFNUN_APPROVAL]: {
        meta: {
          name: States.VINNUMALASTOFNUN_APPROVAL,
          actionCard: {
            description: statesMessages.vinnumalastofnunApprovalDescription,
          },
          lifecycle: DefaultStateLifeCycle,
          progress: 0.75,
          onEntry: {
            apiModuleAction: API_MODULE_ACTIONS.sendApplication,
            shouldPersistToExternalData: true,
            throwOnError: true,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          // TODO: How does VMLST approve? Do we need a form like we have for employer approval?
          // Or is it a webhook that sets the application as approved?
          [DefaultEvents.APPROVE]: { target: States.APPROVED },
          [DefaultEvents.REJECT]: { target: States.VINNUMALASTOFNUN_ACTION },
        },
      },
      [States.VINNUMALASTOFNUN_ACTION]: {
        meta: {
          name: States.VINNUMALASTOFNUN_ACTION,
          actionCard: {
            description: statesMessages.vinnumalastofnunActionDescription,
          },
          lifecycle: DefaultStateLifeCycle,
          progress: 0.5,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/DraftRequiresAction').then((val) =>
                  Promise.resolve(val.DraftRequiresAction),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.EDIT]: { target: States.DRAFT },
        },
      },
      [States.APPROVED]: {
        meta: {
          name: States.APPROVED,
          actionCard: {
            description: statesMessages.approvedDescription,
          },
          lifecycle: DefaultStateLifeCycle,
          progress: 1,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.EDIT]: { target: States.EDIT_OR_ADD_PERIODS },
        },
      },
      // Edit Flow States
      [States.EDIT_OR_ADD_PERIODS]: {
        entry: 'createTempPeriods',
        exit: 'restorePeriodsFromTemp',
        meta: {
          name: States.EDIT_OR_ADD_PERIODS,
          actionCard: {
            description: statesMessages.editOrAddPeriodsDescription,
          },
          lifecycle: DefaultStateLifeCycle,
          progress: 1,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/EditOrAddPeriods').then((val) =>
                  Promise.resolve(val.EditOrAddPeriods),
                ),
              write: 'all',
              read: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: [
            {
              target: States.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS,
              cond: hasEmployer,
            },
            {
              target: States.VINNUMALASTOFNUN_APPROVE_EDITS,
            },
          ],
          [DefaultEvents.ABORT]: [
            {
              target: States.APPROVED,
            },
          ],
        },
      },
      [States.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS]: {
        exit: 'setEmployerReviewerNationalRegistryId',
        meta: {
          name: States.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS,
          actionCard: {
            description:
              statesMessages.employerWaitingToAssignForEditsDescription,
          },
          lifecycle: DefaultStateLifeCycle,
          progress: 0.4,
          onEntry: {
            apiModuleAction: API_MODULE_ACTIONS.assignEmployer,
            throwOnError: true,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/EditsInReview').then((val) =>
                  Promise.resolve(val.EditsInReview),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.ASSIGN]: { target: States.EMPLOYER_APPROVE_EDITS },
          [DefaultEvents.REJECT]: { target: States.EMPLOYER_EDITS_ACTION },
        },
      },

      [States.EMPLOYER_APPROVE_EDITS]: {
        meta: {
          name: States.EMPLOYER_APPROVE_EDITS,
          actionCard: {
            description: statesMessages.employerApproveEditsDescription,
          },
          lifecycle: DefaultStateLifeCycle,
          progress: 0.4,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/EditsInReview').then((val) =>
                  Promise.resolve(val.EditsInReview),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: [
            {
              target: States.VINNUMALASTOFNUN_APPROVE_EDITS,
            },
          ],
          [DefaultEvents.REJECT]: { target: States.EMPLOYER_EDITS_ACTION },
        },
      },
      [States.EMPLOYER_EDITS_ACTION]: {
        exit: 'restorePeriodsFromTemp',
        meta: {
          name: States.EMPLOYER_EDITS_ACTION,
          actionCard: {
            description: statesMessages.employerEditsActionDescription,
          },
          lifecycle: DefaultStateLifeCycle,
          progress: 0.4,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/EditsRequireAction').then((val) =>
                  Promise.resolve(val.EditsRequireAction),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          MODIFY: {
            target: States.EDIT_OR_ADD_PERIODS,
          },
          [DefaultEvents.ABORT]: { target: States.APPROVED },
        },
      },
      [States.VINNUMALASTOFNUN_APPROVE_EDITS]: {
        exit: 'clearTemp',
        meta: {
          name: States.VINNUMALASTOFNUN_APPROVE_EDITS,
          actionCard: {
            description: statesMessages.vinnumalastofnunApproveEditsDescription,
          },
          lifecycle: DefaultStateLifeCycle,
          progress: 0.4,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/EditsInReview').then((val) =>
                  Promise.resolve(val.EditsInReview),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: { target: States.APPROVED },
          [DefaultEvents.REJECT]: {
            target: States.VINNUMALASTOFNUN_EDITS_ACTION,
          },
        },
      },
      [States.VINNUMALASTOFNUN_EDITS_ACTION]: {
        exit: 'restorePeriodsFromTemp',
        meta: {
          name: States.VINNUMALASTOFNUN_EDITS_ACTION,
          actionCard: {
            description: statesMessages.vinnumalastofnunEditsActionDescription,
          },
          lifecycle: DefaultStateLifeCycle,
          progress: 0.4,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/EditsRequireAction').then((val) =>
                  Promise.resolve(val.EditsRequireAction),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          MODIFY: {
            target: States.EDIT_OR_ADD_PERIODS,
          },
          [DefaultEvents.ABORT]: { target: States.APPROVED },
        },
      },
    },
  },
  stateMachineOptions: {
    actions: {
      /**
       * Copy the current periods to temp. If the user cancels the edits,
       * we will restore the periods to their original state from temp.
       */
      createTempPeriods: assign((context, event) => {
        if (event.type !== DefaultEvents.EDIT) {
          return context
        }

        const { application } = context
        const { answers } = application

        set(answers, 'tempPeriods', answers.periods)

        return context
      }),
      /**
       * The user canceled the edits.
       * Restore the periods to their original state from temp.
       */
      restorePeriodsFromTemp: assign((context, event) => {
        if (event.type !== DefaultEvents.ABORT) {
          return context
        }

        const { application } = context
        const { answers } = application

        set(answers, 'periods', cloneDeep(answers.tempPeriods))
        unset(answers, 'tempPeriods')

        return context
      }),
      /**
       * The edits were approved. Clear out temp.
       */
      clearTemp: assign((context, event) => {
        if (event.type !== DefaultEvents.APPROVE) {
          return context
        }

        const { application } = context
        const { answers } = application

        unset(answers, 'tempPeriods')

        return context
      }),
      setOtherParentIdIfSelectedSpouse: assign((context) => {
        const { application } = context

        const answers = getApplicationAnswers(application.answers)

        if (answers.otherParent === SPOUSE) {
          // Specifically persist the national registry id of the spouse
          // into answers.otherParentId since it is used when the other
          // parent is applying for parental leave to see if there
          // have already been any applications created by the primary parent
          set(
            application.answers,
            'otherParentId',
            getOtherParentId(application),
          )
        }

        return context
      }),
      clearPersonalAllowanceIfUsePersonalAllowanceIsNo: assign((context) => {
        const { application } = context

        const answers = getApplicationAnswers(application.answers)

        if (answers.usePersonalAllowance === NO) {
          if (application.answers.personalAllowance) {
            unset(application.answers, 'personalAllowance')
          }
        }

        return context
      }),
      clearSpouseAllowanceIfUseSpouseAllowanceIsNo: assign((context) => {
        const { application } = context

        const answers = getApplicationAnswers(application.answers)

        if (answers.usePersonalAllowanceFromSpouse === NO) {
          if (application.answers.personalAllowanceFromSpouse) {
            unset(application.answers, 'personalAllowanceFromSpouse')
          }
        }

        return context
      }),
      setPrivatePensionValuesIfUsePrivatePensionFundIsNO: assign((context) => {
        const { application } = context

        const answers = getApplicationAnswers(application.answers)

        if (
          answers.usePrivatePensionFund === NO &&
          answers.privatePensionFund !== NO_PRIVATE_PENSION_FUND
        ) {
          set(
            application.answers,
            'payments.privatePensionFund',
            NO_PRIVATE_PENSION_FUND,
          )
        }

        if (
          answers.usePrivatePensionFund === NO &&
          answers.privatePensionFundPercentage !== '0'
        ) {
          set(application.answers, 'payments.privatePensionFundPercentage', '0')
        }

        return context
      }),
      setUnionValuesIfUseUnionIsNO: assign((context) => {
        const { application } = context

        const answers = getApplicationAnswers(application.answers)

        if (answers.useUnion === NO && answers.union !== NO_UNION) {
          set(application.answers, 'payments.union', NO_UNION)
        }

        return context
      }),
      setPersonalUsageToHundredIfUseAsMuchAsPossibleIsYes: assign((context) => {
        const { application } = context

        const answers = getApplicationAnswers(application.answers)

        if (
          answers.personalUseAsMuchAsPossible === YES &&
          answers.personalUsage !== '100'
        ) {
          set(application.answers, 'personalAllowance', {
            useAsMuchAsPossible: YES,
            usage: '100',
          })
        }

        return context
      }),
      setSpouseUsageToHundredIfUseAsMuchAsPossibleIsYes: assign((context) => {
        const { application } = context

        const answers = getApplicationAnswers(application.answers)

        if (
          answers.spouseUseAsMuchAsPossible === YES &&
          answers.spouseUsage !== '100'
        ) {
          set(application.answers, 'personalAllowanceFromSpouse', {
            useAsMuchAsPossible: YES,
            usage: '100',
          })
        }

        return context
      }),
      assignToOtherParent: assign((context) => {
        const { application } = context
        const otherParentId = getOtherParentId(application)

        if (
          otherParentId !== undefined &&
          otherParentId !== '' &&
          needsOtherParentApproval(context)
        ) {
          set(application, 'assignees', [otherParentId])
        }

        return context
      }),
      setEmployerReviewerNationalRegistryId: assign((context, event) => {
        // Only set if employer gets assigned
        if (event.type !== DefaultEvents.ASSIGN) {
          return context
        }

        const { application } = context
        const { answers } = application

        set(
          answers,
          'employerReviewerNationalRegistryId',
          application.assignees[0],
        )

        return context
      }),
      attemptToSetPrimaryParentAsOtherParent: assign((context) => {
        const { application } = context
        const { answers, externalData } = application
        const selectedChild = getSelectedChild(answers, externalData)

        if (!selectedChild) {
          return context
        }

        if (selectedChild.parentalRelation === ParentalRelations.primary) {
          return context
        }

        // Current parent is secondary parent, this will set otherParentId to the id of the primary parent
        set(
          answers,
          'otherParentId',
          selectedChild.primaryParentNationalRegistryId,
        )

        set(answers, 'otherParent', MANUAL)

        return context
      }),
      setRightsToOtherParent: assign((context) => {
        const { application } = context
        const { answers, externalData } = application
        const selectedChild = getSelectedChild(answers, externalData)

        if (!selectedChild) {
          return context
        }

        if (selectedChild.parentalRelation === ParentalRelations.primary) {
          return context
        }

        const days = selectedChild.transferredDays

        if (days !== undefined && days > 0) {
          set(answers, 'requestRights.isRequestingRights', YES)
          set(answers, 'requestRights.requestDays', days.toString())
        } else if (days !== undefined && days < 0) {
          set(answers, 'giveRights.isGivingRights', YES)
          set(answers, 'giveRights.giveDays', days.toString())
        } else {
          set(answers, 'requestRights.isRequestingRights', NO)
          set(answers, 'giveRights.isGivingRights', NO)
        }

        return context
      }),
      setAllowanceToOtherParent: assign((context) => {
        const { application } = context
        const { answers, externalData } = application
        const selectedChild = getSelectedChild(answers, externalData)

        if (!selectedChild) {
          return context
        }

        if (selectedChild.parentalRelation === ParentalRelations.primary) {
          return context
        }

        set(answers, 'usePersonalAllowance', NO)
        set(answers, 'usePersonalAllowanceFromSpouse', NO)

        return context
      }),
      removePeriodsOrAllowanceOnSpouseRejection: assign((context) => {
        const { application } = context

        const answers = getApplicationAnswers(application.answers)

        if (answers.requestDays > 0) {
          unset(application.answers, 'periods')
          unset(application.answers, 'validatedPeriods')
          set(application.answers, 'requestRights.requestDays', '0')
          set(application.answers, 'requestRights.isRequestingRights', 'no')
          set(application.answers, 'giveRights.giveDays', '0')
          set(application.answers, 'giveRights.isGivingRights', 'no')
        }

        if (answers.usePersonalAllowanceFromSpouse === YES) {
          unset(application.answers, 'personalAllowanceFromSpouse')
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
    // If the applicant is its own employer, we need to give it the `ASSIGNEE` role to be able to continue the process
    if (id === application.applicant && application.assignees.includes(id)) {
      return Roles.ASSIGNEE
    }

    if (id === application.applicant) {
      return Roles.APPLICANT
    }

    if (application.assignees.includes(id)) {
      return Roles.ASSIGNEE
    }

    return undefined
  },
  answerValidators,
}

export default ParentalLeaveTemplate
