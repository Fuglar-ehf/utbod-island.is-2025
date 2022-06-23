import {
  Application,
  ApplicationTemplateHelper,
  ApplicationTypes,
  ExternalData,
  FormValue,
  DefaultEvents,
  ApplicationStatus,
} from '@island.is/application/core'
import ParentalLeaveTemplate from './ParentalLeaveTemplate'
import {
  NO,
  NO_PRIVATE_PENSION_FUND,
  NO_UNION,
  SPOUSE,
  States as ApplicationStates,
  YES,
} from '../constants'

import { createNationalId } from '@island.is/testing/fixtures'

function buildApplication(data: {
  answers?: FormValue
  externalData?: ExternalData
  state?: string
}): Application {
  const {
    answers = {},
    externalData = {
      children: {
        data: {
          children: [
            {
              hasRights: true,
              remainingDays: 180,
              parentalRelation: 'primary',
              expectedDateOfBirth: '2022-10-31',
            },
          ],
          existingApplications: [],
        },
        date: new Date('2021-10-31'),
        status: 'success',
      },
    },
    state = 'draft',
  } = data

  return {
    id: '12345',
    assignees: [],
    applicant: '1234567890',
    typeId: ApplicationTypes.PARENTAL_LEAVE,
    created: new Date(),
    modified: new Date(),
    attachments: {},
    answers,
    state,
    externalData,
    status: ApplicationStatus.IN_PROGRESS,
  }
}

describe('Parental Leave Application Template', () => {
  describe('state transitions', () => {
    const otherParentId = createNationalId('person')
    it('should transition from draft to other parent if applicant is asking for shared rights', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            requestRights: {
              isRequestingRights: 'yes',
            },
            otherParentObj: {
              otherParentId,
            },
            selectedChild: '0',
          },
        }),
        ParentalLeaveTemplate,
      )
      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe('otherParentApproval')
      expect(newApplication.assignees).toEqual([otherParentId])
    })

    it('should transition from draft to employer approval if applicant is not asking for shared rights', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            requestRights: {
              isRequestingRights: 'no',
            },
            otherParentObj: {
              otherParentId,
            },
            employer: {
              isSelfEmployed: 'no',
            },
          },
        }),
        ParentalLeaveTemplate,
      )
      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe('employerWaitingToAssign')
      // There should be no one assigned until employer accepts to be assigned
      expect(newApplication.assignees).toEqual([])
    })

    it('should assign the application to the employer when transitioning to employer approval from other parent approval', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          state: 'draft',
          answers: {
            requestRights: {
              isRequestingRights: 'yes',
            },
            otherParentObj: {
              otherParentId,
            },
            employer: {
              isSelfEmployed: 'no',
            },
            selectedChild: '0',
          },
        }),
        ParentalLeaveTemplate,
      )
      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe('otherParentApproval')
      expect(newApplication.assignees).toEqual([otherParentId])

      const finalHelper = new ApplicationTemplateHelper(
        newApplication,
        ParentalLeaveTemplate,
      )
      const [
        hasChangedAgain,
        finalState,
        finalApplication,
      ] = finalHelper.changeState({
        type: DefaultEvents.APPROVE,
      })
      expect(hasChangedAgain).toBe(true)
      expect(finalState).toBe('employerWaitingToAssign')
      expect(finalApplication.assignees).toEqual([])
    })

    it('should assign the application to the other parent approval and then to VMST when the applicant is self employed', () => {
      process.env.VMST_ID = createNationalId('company')

      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            requestRights: {
              isRequestingRights: 'yes',
            },
            otherParentObj: {
              otherParentId,
            },
            employer: {
              isSelfEmployed: 'yes',
            },
            selectedChild: '0',
          },
        }),
        ParentalLeaveTemplate,
      )
      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe('otherParentApproval')
      expect(newApplication.assignees).toEqual([otherParentId])

      const finalHelper = new ApplicationTemplateHelper(
        newApplication,
        ParentalLeaveTemplate,
      )

      const VMST_ID = process.env.VMST_ID
      const [
        hasChangedAgain,
        finalState,
        finalApplication,
      ] = finalHelper.changeState({
        type: DefaultEvents.APPROVE,
      })

      expect(hasChangedAgain).toBe(true)
      expect(finalState).toBe('vinnumalastofnunApproval')
      expect(finalApplication.assignees).toEqual([VMST_ID])
    })

    describe('other parent', () => {
      describe('when spouse is selected', () => {
        it('should assign their national registry id from external data to answers.otherParentId when transitioning from draft', () => {
          const helper = new ApplicationTemplateHelper(
            buildApplication({
              externalData: {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                person: {
                  data: {
                    spouse: {
                      nationalId: otherParentId,
                      name: 'Tester Testerson',
                    },
                  },
                },
              },
              answers: {
                otherParentObj: {
                  chooseOtherParent: SPOUSE,
                },
                employer: {
                  email: 'selfemployed@test.test',
                  isSelfEmployed: YES,
                },
              },
            }),
            ParentalLeaveTemplate,
          )
          const [hasChanged, newState, newApplication] = helper.changeState({
            type: DefaultEvents.SUBMIT,
          })
          expect(hasChanged).toBe(true)
          expect(newState).toBe('vinnumalastofnunApproval')
          expect(newApplication.answers.otherParentObj.otherParentId).toEqual(
            otherParentId,
          )
        })
      })
    })

    describe('allowance', () => {
      it('should remove personalAllowanceFromSpouse on submit, if usePersonalAllowanceFromSpouse is equal to NO and personalAllowanceFromSpouse exists', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              usePersonalAllowanceFromSpouse: NO,
              personalAllowanceFromSpouse: {
                usage: '33%',
                useAsMuchAsPossible: NO,
              },
              employer: {
                isSelfEmployed: 'no',
              },
            },
          }),
          ParentalLeaveTemplate,
        )
        const [hasChanged, _, newApplication] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })
        expect(hasChanged).toBe(true)
        expect(
          newApplication.answers.personalAllowanceFromSpouse,
        ).toBeUndefined()
      })

      it('should remove personalAllowance on submit, if usePersonalAllowance is equal to NO  and personalAllowance exists', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              usePersonalAllowance: NO,
              personalAllowance: {
                usage: '33%',
                useAsMuchAsPossible: NO,
              },
              employer: {
                isSelfEmployed: 'no',
              },
            },
          }),
          ParentalLeaveTemplate,
        )
        const [hasChanged, _, newApplication] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })
        expect(hasChanged).toBe(true)
        expect(newApplication.answers.personalAllowance).toBeUndefined()
      })

      it('should set usage to 100 if useAsMuchAsPossible in personalAllowance is set to YES', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              usePersonalAllowance: YES,
              personalAllowance: {
                usage: '0',
                useAsMuchAsPossible: YES,
              },
              employer: {
                isSelfEmployed: 'no',
              },
            },
          }),
          ParentalLeaveTemplate,
        )

        const answer = {
          useAsMuchAsPossible: YES,
          usage: '100',
        }

        const [hasChanged, _, newApplication] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })

        expect(hasChanged).toBe(true)
        expect(newApplication.answers.personalAllowance).toEqual(answer)
      })

      it('should set usage to 100 if useAsMuchAsPossible in personalAllowanceFromSpouse is set to YES', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              usePersonalAllowanceFromSpouse: YES,
              personalAllowanceFromSpouse: {
                usage: '0',
                useAsMuchAsPossible: YES,
              },
              employer: {
                isSelfEmployed: 'no',
              },
            },
          }),
          ParentalLeaveTemplate,
        )

        const answer = {
          useAsMuchAsPossible: YES,
          usage: '100',
        }

        const [hasChanged, _, newApplication] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })

        expect(hasChanged).toBe(true)
        expect(newApplication.answers.personalAllowanceFromSpouse).toEqual(
          answer,
        )
      })
    })

    describe('privatePensionFund and privatePensionFundPercentage', () => {
      it('should set privatePensionFund and privatePensionFundPercentage to NO_PRIVATE_PENSION_FUND and 0 if use usePrivatePensionFund is NO', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              payments: {
                bank: '123454312300',
                pensionFund: 'id-frjalsi',
                union: NO_UNION,
                privatePensionFund: '',
                privatePensionFundPercentage: '',
              },
              usePrivatePensionFund: NO,
              employer: {
                isSelfEmployed: 'no',
              },
            },
          }),
          ParentalLeaveTemplate,
        )

        const answer = {
          bank: '123454312300',
          pensionFund: 'id-frjalsi',
          union: NO_UNION,
          privatePensionFund: NO_PRIVATE_PENSION_FUND,
          privatePensionFundPercentage: '0',
        }

        const [hasChanged, _, newApplication] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })

        expect(hasChanged).toBe(true)
        expect(newApplication.answers.payments).toEqual(answer)
      })
    })

    describe('union', () => {
      it('should set union to NO_UNION if useUnion is NO', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              payments: {
                bank: '123454312300',
                pensionFund: 'id-frjalsi',
                union: '',
                privatePensionFund: NO_PRIVATE_PENSION_FUND,
                privatePensionFundPercentage: '0',
              },
              useUnion: NO,
              employer: {
                isSelfEmployed: 'no',
              },
            },
          }),
          ParentalLeaveTemplate,
        )

        const answer = {
          bank: '123454312300',
          pensionFund: 'id-frjalsi',
          union: NO_UNION,
          privatePensionFund: NO_PRIVATE_PENSION_FUND,
          privatePensionFundPercentage: '0',
        }

        const [hasChanged, _, newApplication] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })

        expect(hasChanged).toBe(true)
        expect(newApplication.answers.payments).toEqual(answer)
      })
    })
  })

  describe('edit flow', () => {
    // TODO: Unable to Edit after APPROVED
    // it('should create a temp copy of periods when going into the Edit flow', () => {
    //   const periods = [
    //     {
    //       ratio: '100',
    //       endDate: '2021-05-15T00:00:00Z',
    //       startDate: '2021-01-15',
    //     },
    //     {
    //       ratio: '100',
    //       endDate: '2021-06-16',
    //       startDate: '2021-06-01',
    //     },
    //   ]
    //   const helper = new ApplicationTemplateHelper(
    //     buildApplication({
    //       answers: {
    //         periods,
    //       },
    //       state: ApplicationStates.APPROVED,
    //     }),
    //     ParentalLeaveTemplate,
    //   )
    //   const [hasChanged, newState, newApplication] = helper.changeState({
    //     type: DefaultEvents.EDIT,
    //   })
    //   expect(hasChanged).toBe(true)
    //   expect(newState).toBe(ApplicationStates.EDIT_OR_ADD_PERIODS)
    //   expect(newApplication.answers.tempPeriods).toEqual(periods)
    // })

    it('should remove the temp copy of periods when canceling out of the Edit flow', () => {
      const periods = [
        {
          ratio: '100',
          endDate: '2021-05-15T00:00:00Z',
          startDate: '2021-01-15',
        },
        {
          ratio: '100',
          endDate: '2021-06-16',
          startDate: '2021-06-01',
        },
      ]
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            periods,
            tempPeriods: periods,
          },
          state: ApplicationStates.EDIT_OR_ADD_PERIODS,
        }),
        ParentalLeaveTemplate,
      )
      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.ABORT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.APPROVED)
      expect(newApplication.answers.tempPeriods).toEqual(undefined)
    })

    it('should assign the application to the employer when the user submits their edits', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            employer: {
              isSelfEmployed: 'no',
            },
          },
          state: ApplicationStates.EDIT_OR_ADD_PERIODS,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe(
        ApplicationStates.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS,
      )
      expect(newApplication.assignees).toEqual([])
    })
  })

  describe('Spouse rejection', () => {
    it('should remove personalAllowanceFromSpouse on spouse rejection', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            usePersonalAllowanceFromSpouse: YES,
            personalAllowanceFromSpouse: {
              useAsMuchAsPossible: YES,
              usage: '100',
            },
          },
          state: ApplicationStates.OTHER_PARENT_APPROVAL,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.REJECT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.OTHER_PARENT_ACTION)
      expect(newApplication.answers.personalAllowanceFromSpouse).toBeUndefined()
    })

    it('should remove periods on spouse rejection', () => {
      const periods = [
        {
          ratio: '100',
          endDate: '2021-05-15T00:00:00Z',
          startDate: '2021-01-15',
        },
        {
          ratio: '100',
          endDate: '2021-06-16',
          startDate: '2021-06-01',
        },
      ]

      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            periods,
            requestRights: {
              isRequestingRights: YES,
              requestDays: '45',
            },
          },
          state: ApplicationStates.OTHER_PARENT_APPROVAL,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.REJECT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.OTHER_PARENT_ACTION)
      expect(newApplication.answers.periods).toBeUndefined()
    })

    it('should remove validatedPeriods on spouse rejection', () => {
      const validatedPeriods = [
        {
          endDate: '2021-12-16',
          firstPeriodStart: 'estimatedDateOfBirth',
          ratio: '100',
          rawIndex: 0,
          startDate: '2021-06-17',
          useLength: 'yes',
        },
      ]

      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            validatedPeriods,
            requestRights: {
              isRequestingRights: YES,
              requestDays: '45',
            },
          },
          state: ApplicationStates.OTHER_PARENT_APPROVAL,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.REJECT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.OTHER_PARENT_ACTION)
      expect(newApplication.answers.validatedPeriods).toBeUndefined()
    })

    it('should reset value of isRequestiongRights and requestDays on spouse rejection', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            requestRights: {
              isRequestingRights: YES,
              requestDays: '45',
            },
          },
          state: ApplicationStates.OTHER_PARENT_APPROVAL,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.REJECT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.OTHER_PARENT_ACTION)
      expect(newApplication.answers.requestRights).toEqual({
        isRequestingRights: NO,
        requestDays: '0',
      })
    })

    it('should reset value of isGivingRights and giveDays on spouse rejection', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            requestRights: {
              isRequestingRights: YES,
              requestDays: '45',
            },
            giveRights: {
              isGivingRights: YES,
              giveDays: '45',
            },
          },
          state: ApplicationStates.OTHER_PARENT_APPROVAL,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.REJECT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.OTHER_PARENT_ACTION)
      expect(newApplication.answers.giveRights).toEqual({
        isGivingRights: NO,
        giveDays: '0',
      })
    })
  })
})
