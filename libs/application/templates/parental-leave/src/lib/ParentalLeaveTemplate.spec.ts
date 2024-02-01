import { ApplicationTemplateHelper } from '@island.is/application/core'
import {
  Application,
  ApplicationTypes,
  ExternalData,
  FormValue,
  DefaultEvents,
  ApplicationStatus,
  ApplicationContext,
} from '@island.is/application/types'
import ParentalLeaveTemplate from './ParentalLeaveTemplate'
import {
  NO,
  NO_PRIVATE_PENSION_FUND,
  NO_UNION,
  PARENTAL_LEAVE,
  SPOUSE,
  States as ApplicationStates,
  States,
  YES,
  NO_UNEMPLOYED_BENEFITS,
  PARENTAL_GRANT,
} from '../constants'

import { createNationalId } from '@island.is/testing/fixtures'
import { goToState } from './parentalLeaveTemplateUtils'

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
    applicantActors: [],
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
          externalData: {
            person: {
              data: {
                spouse: {
                  nationalId: otherParentId,
                  name: 'Tester Testerson',
                },
              },
              date: new Date(),
              status: 'success',
            },
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
          answers: {
            requestRights: {
              isRequestingRights: 'yes',
            },
            otherParentObj: {
              chooseOtherParent: SPOUSE,
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
            employment: {
              isSelfEmployed: 'no',
              isReceivingUnemploymentBenefits: 'no',
            },
            applicationType: {
              option: PARENTAL_LEAVE,
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
          externalData: {
            person: {
              data: {
                spouse: {
                  nationalId: otherParentId,
                  name: 'Tester Testerson',
                },
              },
              date: new Date(),
              status: 'success',
            },
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
          answers: {
            requestRights: {
              isRequestingRights: 'yes',
            },
            otherParentObj: {
              chooseOtherParent: SPOUSE,
              otherParentId,
            },
            employment: {
              isSelfEmployed: 'no',
              isReceivingUnemploymentBenefits: 'no',
            },
            selectedChild: '0',
            applicationType: {
              option: PARENTAL_LEAVE,
            },
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
      const [hasChangedAgain, finalState, finalApplication] =
        finalHelper.changeState({
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
          externalData: {
            person: {
              data: {
                spouse: {
                  nationalId: otherParentId,
                  name: 'Tester Testerson',
                },
              },
              date: new Date(),
              status: 'success',
            },
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
          answers: {
            requestRights: {
              isRequestingRights: 'yes',
            },
            otherParentObj: {
              chooseOtherParent: SPOUSE,
              otherParentId,
            },
            employment: {
              isSelfEmployed: 'yes',
              isReceivingUnemploymentBenefits: 'no',
            },
            selectedChild: '0',
            applicationType: {
              option: PARENTAL_LEAVE,
            },
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
      const [hasChangedAgain, finalState, finalApplication] =
        finalHelper.changeState({
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
                person: {
                  data: {
                    spouse: {
                      nationalId: otherParentId,
                      name: 'Tester Testerson',
                    },
                  },
                  date: new Date(),
                  status: 'success',
                },
              },
              answers: {
                otherParentObj: {
                  chooseOtherParent: SPOUSE,
                },
                employers: [
                  {
                    email: 'selfemployed@test.test',
                  },
                ],
                employment: {
                  isSelfEmployed: YES,
                  isReceivingUnemploymentBenefits: 'no',
                },
                applicationType: {
                  option: PARENTAL_LEAVE,
                },
              },
            }),
            ParentalLeaveTemplate,
          )
          const [hasChanged, newState, newApplication] = helper.changeState({
            type: DefaultEvents.SUBMIT,
          })
          const newApplicationOtherParentId = (
            newApplication.answers as {
              otherParentObj: { otherParentId: string }
            }
          )?.otherParentObj?.otherParentId

          expect(hasChanged).toBe(true)
          expect(newState).toBe('vinnumalastofnunApproval')
          expect(newApplicationOtherParentId).toEqual(otherParentId)
        })
      })
    })

    describe('allowance', () => {
      it('should remove usage and useAsMuchAsPossible on submit, if usePersonalAllowance (FromSpouse) is equal to NO and personalAllowanceFromSpouse exists', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              personalAllowanceFromSpouse: {
                usePersonalAllowance: NO,
                usage: '33%',
                useAsMuchAsPossible: NO,
              },
              employment: {
                isSelfEmployed: 'no',
                isReceivingUnemploymentBenefits: 'no',
              },
              applicationType: {
                option: PARENTAL_LEAVE,
              },
            },
          }),
          ParentalLeaveTemplate,
        )

        const answer = {
          usePersonalAllowance: NO,
        }

        const [hasChanged, _, newApplication] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })
        expect(hasChanged).toBe(true)
        expect(newApplication.answers.personalAllowanceFromSpouse).toEqual(
          answer,
        )
      })

      it('should remove usage and useAsMuchAsPossible on submit, if usePersonalAllowance is equal to NO and personalAllowance exists', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              personalAllowance: {
                usePersonalAllowance: NO,
                usage: '33%',
                useAsMuchAsPossible: NO,
              },
              employment: {
                isSelfEmployed: 'no',
                isReceivingUnemploymentBenefits: 'no',
              },
              applicationType: {
                option: PARENTAL_LEAVE,
              },
            },
          }),
          ParentalLeaveTemplate,
        )

        const answer = {
          usePersonalAllowance: NO,
        }

        const [hasChanged, _, newApplication] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })
        expect(hasChanged).toBe(true)
        expect(newApplication.answers.personalAllowance).toEqual(answer)
      })

      it('should set usage to 100 if useAsMuchAsPossible in personalAllowance is set to YES', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              personalAllowance: {
                usePersonalAllowance: YES,
                usage: '0',
                useAsMuchAsPossible: YES,
              },
              employment: {
                isSelfEmployed: 'no',
                isReceivingUnemploymentBenefits: 'no',
              },
              applicationType: {
                option: PARENTAL_LEAVE,
              },
            },
          }),
          ParentalLeaveTemplate,
        )

        const answer = {
          usePersonalAllowance: YES,
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
              personalAllowanceFromSpouse: {
                usePersonalAllowance: YES,
                usage: '0',
                useAsMuchAsPossible: YES,
              },
            },
          }),
          ParentalLeaveTemplate,
        )

        const answer = {
          usePersonalAllowance: YES,
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
              employment: {
                isSelfEmployed: 'no',
                isReceivingUnemploymentBenefits: 'no',
              },
              applicationType: {
                option: PARENTAL_LEAVE,
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
              employment: {
                isSelfEmployed: 'no',
                isReceivingUnemploymentBenefits: 'no',
              },
              applicationType: {
                option: PARENTAL_LEAVE,
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

    describe('isSelfEmployed', () => {
      it('should set isReceivingUnemploymentBenefits to NO, unemploymentBenefits to NO_UNEMPLOYED_BENEFITS and unset benefitsFile if isSelfEmployed is YES', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              employment: {
                isSelfEmployed: 'yes',
                isReceivingUnemploymentBenefits: 'yes',
                unemploymentBenefits: 'Vinnumálastofnun (atvinnuleysisbætur)',
              },
              fileUpload: {
                selfEmployedFile: [],
                benefitsFile: [],
              },
              applicationType: {
                option: PARENTAL_LEAVE,
              },
            },
          }),
          ParentalLeaveTemplate,
        )

        const answer = {
          employment: {
            isSelfEmployed: 'yes',
            isReceivingUnemploymentBenefits: 'no',
            unemploymentBenefits: NO_UNEMPLOYED_BENEFITS,
          },
          fileUpload: {
            selfEmployedFile: [],
          },
          applicationType: {
            option: PARENTAL_LEAVE,
          },
        }

        const [hasChanged, _, newApplication] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })

        expect(hasChanged).toBe(true)
        expect(newApplication.answers).toEqual(answer)
      })
      it('should unset selfEmployedFile if isSelfEmployed is NO', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              employment: {
                isSelfEmployed: 'no',
                isReceivingUnemploymentBenefits: 'no',
                unemploymentBenefits: NO_UNEMPLOYED_BENEFITS,
              },
              fileUpload: {
                selfEmployedFile: [],
              },
              applicationType: {
                option: PARENTAL_LEAVE,
              },
            },
          }),
          ParentalLeaveTemplate,
        )

        const answer = {
          employment: {
            isSelfEmployed: 'no',
            isReceivingUnemploymentBenefits: 'no',
            unemploymentBenefits: NO_UNEMPLOYED_BENEFITS,
          },
          fileUpload: {},
          applicationType: {
            option: PARENTAL_LEAVE,
          },
        }

        const [hasChanged, _, newApplication] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })

        expect(hasChanged).toBe(true)
        expect(newApplication.answers).toEqual(answer)
      })
    })

    describe('isReceivingUnemploymentBenefits', () => {
      it('should set unemploymentBenefits to NO_UNEMPLOYED_BENEFITS and unset benefitsFile if isReceivingUnemploymentBenefits is NO', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              employment: {
                isSelfEmployed: 'no',
                isReceivingUnemploymentBenefits: 'no',
                unemploymentBenefits: 'Vinnumálastofnun (atvinnuleysisbætur)',
              },
              fileUpload: {
                benefitsFile: [],
              },
              applicationType: {
                option: PARENTAL_LEAVE,
              },
            },
          }),
          ParentalLeaveTemplate,
        )

        const answer = {
          employment: {
            isSelfEmployed: 'no',
            isReceivingUnemploymentBenefits: 'no',
            unemploymentBenefits: NO_UNEMPLOYED_BENEFITS,
          },
          fileUpload: {},
          applicationType: {
            option: PARENTAL_LEAVE,
          },
        }

        const [hasChanged, _, newApplication] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })

        expect(hasChanged).toBe(true)
        expect(newApplication.answers).toEqual(answer)
      })
    })

    describe('unemploymentBenefits', () => {
      it('should unset benefitsFile if unemploymentBenefits is not union or healthInsurance', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              employment: {
                isSelfEmployed: 'no',
                isReceivingUnemploymentBenefits: 'yes',
                unemploymentBenefits: 'Vinnumálastofnun (atvinnuleysisbætur)',
              },
              fileUpload: {
                benefitsFile: [],
              },
              applicationType: {
                option: PARENTAL_LEAVE,
              },
            },
          }),
          ParentalLeaveTemplate,
        )

        const answer = {
          employment: {
            isSelfEmployed: 'no',
            isReceivingUnemploymentBenefits: 'yes',
            unemploymentBenefits: 'Vinnumálastofnun (atvinnuleysisbætur)',
          },
          fileUpload: {},
          applicationType: {
            option: PARENTAL_LEAVE,
          },
        }

        const [hasChanged, _, newApplication] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })

        expect(hasChanged).toBe(true)
        expect(newApplication.answers).toEqual(answer)
      })
    })

    describe('employers', () => {
      it('should unset employers if isSelfEmployed is YES', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              employers: [
                {
                  email: 'testEmail@test.is',
                  ratio: '100',
                  phoneNumber: '',
                },
              ],
              employment: {
                isSelfEmployed: YES,
                unemploymentBenefits: NO_UNEMPLOYED_BENEFITS,
                isReceivingUnemploymentBenefits: NO,
              },
              fileUpload: {
                selfEmployedFile: [],
              },
              applicationType: {
                option: PARENTAL_LEAVE,
              },
            },
          }),
          ParentalLeaveTemplate,
        )

        const answer = {
          employment: {
            isSelfEmployed: YES,
            unemploymentBenefits: NO_UNEMPLOYED_BENEFITS,
            isReceivingUnemploymentBenefits: NO,
          },
          fileUpload: {
            selfEmployedFile: [],
          },
          applicationType: {
            option: PARENTAL_LEAVE,
          },
        }

        const [hasChanged, _, newApplication] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })

        expect(hasChanged).toBe(true)
        expect(newApplication.answers).toEqual(answer)
      })
      it('should unset employers if isReceivingUnemploymentBenefits is YES', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              employers: [
                {
                  email: 'testEmail@test.is',
                  ratio: '100',
                  phoneNumber: '',
                },
              ],
              employment: {
                isSelfEmployed: NO,
                unemploymentBenefits: 'Vinnumálastofnun (atvinnuleysisbætur)',
                isReceivingUnemploymentBenefits: YES,
              },
              fileUpload: {},
              applicationType: {
                option: PARENTAL_LEAVE,
              },
            },
          }),
          ParentalLeaveTemplate,
        )

        const answer = {
          employment: {
            isSelfEmployed: NO,
            unemploymentBenefits: 'Vinnumálastofnun (atvinnuleysisbætur)',
            isReceivingUnemploymentBenefits: YES,
          },
          fileUpload: {},
          applicationType: {
            option: PARENTAL_LEAVE,
          },
        }

        const [hasChanged, _, newApplication] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })

        expect(hasChanged).toBe(true)
        expect(newApplication.answers).toEqual(answer)
      })
      it('should unset employers and employmentTerminationCertificateFile if employerLastSixMonths is NO', () => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            answers: {
              employerLastSixMonths: NO,
              employers: [
                {
                  email: 'testEmail@test.is',
                  ratio: '100',
                  phoneNumber: '',
                  stillEmployed: NO,
                },
              ],
              fileUpload: {
                employmentTerminationCertificateFile: [],
              },
              applicationType: {
                option: PARENTAL_GRANT,
              },
            },
          }),
          ParentalLeaveTemplate,
        )

        const answer = {
          employerLastSixMonths: NO,
          fileUpload: {},
          applicationType: {
            option: PARENTAL_GRANT,
          },
        }

        const [hasChanged, _, newApplication] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })

        expect(hasChanged).toBe(true)
        expect(newApplication.answers).toEqual(answer)
      })
    })
  })

  describe('edit flow', () => {
    it('should create a temp copy of employers and periods when going into the Edit flow', () => {
      const employers = [
        {
          email: 'testEmail1@test.is',
          ratio: '100',
        },
        {
          email: 'testEmail2@test.is',
          ratio: '100',
        },
      ]
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
            employers,
            periods,
          },
          state: ApplicationStates.APPROVED,
        }),
        ParentalLeaveTemplate,
      )
      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.EDIT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS)
      expect(newApplication.answers.tempEmployers).toEqual(employers)
      expect(newApplication.answers.tempPeriods).toEqual(periods)
    })

    it('should remove the temp copy of employers and periods when canceling out of the Edit flow and go to APPROVED state', () => {
      const employers = [
        {
          email: 'testEmail1@test.is',
          ratio: '100',
        },
        {
          email: 'testEmail2@test.is',
          ratio: '100',
        },
      ]
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
            employers,
            tempEmployers: employers,
            periods,
            tempPeriods: periods,
            previousState: States.APPROVED,
          },
          state: ApplicationStates.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
        }),
        ParentalLeaveTemplate,
      )
      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.ABORT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.APPROVED)
      expect(newApplication.answers.tempEmployers).toEqual(undefined)
      expect(newApplication.answers.tempPeriods).toEqual(undefined)
    })

    it('should remove the temp copy of employers and periods when canceling out of the Edit flow and go to VINNUMALASTOFNUN_APPROVE_EDITS state', () => {
      const employers = [
        {
          email: 'testEmail1@test.is',
          ratio: '100',
        },
        {
          email: 'testEmail2@test.is',
          ratio: '100',
        },
      ]
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
            employers,
            tempEmployers: employers,
            periods,
            tempPeriods: periods,
            previousState: States.VINNUMALASTOFNUN_APPROVE_EDITS,
          },
          state: ApplicationStates.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
        }),
        ParentalLeaveTemplate,
      )
      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.ABORT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe(
        ApplicationStates.VINNUMALASTOFNUN_APPROVE_EDITS_ABORT,
      )
      expect(newApplication.answers.tempEmployers).toEqual(undefined)
      expect(newApplication.answers.tempPeriods).toEqual(undefined)
    })

    it('should remove the temp copy of employers and periods when canceling out of the Edit flow and go to VINNUMALASTOFNUN_APPROVAL state', () => {
      const employers = [
        {
          email: 'testEmail1@test.is',
          ratio: '100',
        },
        {
          email: 'testEmail2@test.is',
          ratio: '100',
        },
      ]
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
            employers,
            tempEmployers: employers,
            periods,
            tempPeriods: periods,
            previousState: States.VINNUMALASTOFNUN_APPROVAL,
          },
          state: ApplicationStates.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
        }),
        ParentalLeaveTemplate,
      )
      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.ABORT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe(
        ApplicationStates.VINNUMALASTOFNUN_APPROVAL_ABORT_CHANGE,
      )
      expect(newApplication.answers.tempEmployers).toEqual(undefined)
      expect(newApplication.answers.tempPeriods).toEqual(undefined)
    })

    it('should assign the application to the employer when the user submits their edits', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            employment: {
              isSelfEmployed: 'no',
              isReceivingUnemploymentBenefits: 'no',
            },
            applicationType: {
              option: PARENTAL_LEAVE,
            },
          },
          state: ApplicationStates.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe(
        ApplicationStates.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS,
      )
    })
  })

  describe('Spouse rejection', () => {
    it('should remove personalAllowanceFromSpouse on spouse rejection', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            personalAllowanceFromSpouse: {
              usePersonalAllowance: YES,
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

test.each([
  {
    data: {
      application: { answers: { previousState: ApplicationStates.APPROVED } },
    } as unknown as ApplicationContext,
    state: ApplicationStates.APPROVED,
    expected: true,
  },
  {
    data: {
      application: { answers: { previousState: ApplicationStates.APPROVED } },
    } as unknown as ApplicationContext,
    state: ApplicationStates.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
    expected: false,
  },
  {
    data: {
      application: {
        answers: {
          previousState: ApplicationStates.VINNUMALASTOFNUN_EDITS_ACTION,
        },
      },
    } as unknown as ApplicationContext,
    state: ApplicationStates.VINNUMALASTOFNUN_EDITS_ACTION,
    expected: true,
  },
])(
  'should return true if previousState is equal to state',
  ({ data, state, expected }) => {
    expect(goToState(data, state)).toBe(expected)
  },
)
