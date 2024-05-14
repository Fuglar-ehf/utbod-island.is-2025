import {
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common'

import {
  CaseAppealState,
  CaseState,
  completedCaseStates,
  courtOfAppealsRoles,
  districtCourtRoles,
  InstitutionType,
  prosecutionRoles,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { ViewCaseFileGuard } from '../viewCaseFile.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Then

describe('View Case File Guard', () => {
  const mockRequest = jest.fn()
  let givenWhenThen: GivenWhenThen

  beforeEach(() => {
    givenWhenThen = (): Then => {
      const guard = new ViewCaseFileGuard()
      const then = {} as Then

      try {
        then.result = guard.canActivate({
          switchToHttp: () => ({ getRequest: mockRequest }),
        } as unknown as ExecutionContext)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe.each(prosecutionRoles)('role %s', (role) => {
    describe.each(Object.keys(CaseState))(
      'can view case files for %s cases',
      (state) => {
        let then: Then

        beforeEach(() => {
          mockRequest.mockImplementationOnce(() => ({
            user: {
              role,
              institution: { type: InstitutionType.PROSECUTORS_OFFICE },
            },
            case: { state },
          }))

          then = givenWhenThen()
        })

        it('should activate', () => {
          expect(then.result).toBe(true)
        })
      },
    )
  })

  describe.each(districtCourtRoles)('role %s', (role) => {
    describe.each([
      CaseState.SUBMITTED,
      CaseState.RECEIVED,
      CaseState.MAIN_HEARING,
      ...completedCaseStates,
    ])('can view case files for %s cases', (state) => {
      let then: Then

      beforeEach(() => {
        mockRequest.mockImplementationOnce(() => ({
          user: { role, institution: { type: InstitutionType.DISTRICT_COURT } },
          case: { state },
        }))

        then = givenWhenThen()
      })

      it('should activate', () => {
        expect(then.result).toBe(true)
      })
    })

    describe.each(
      Object.keys(CaseState).filter(
        (state) =>
          ![
            CaseState.SUBMITTED,
            CaseState.RECEIVED,
            CaseState.MAIN_HEARING,
            ...completedCaseStates,
          ].includes(state as CaseState),
      ),
    )('can not view case files for %s cases', (state) => {
      let then: Then

      beforeEach(() => {
        mockRequest.mockImplementationOnce(() => ({
          user: { role, institution: { type: InstitutionType.DISTRICT_COURT } },
          case: { state },
        }))

        then = givenWhenThen()
      })

      it('should throw ForbiddenException', () => {
        expect(then.error).toBeInstanceOf(ForbiddenException)
        expect(then.error.message).toBe(`Forbidden for ${role}`)
      })
    })
  })

  describe.each(courtOfAppealsRoles)('role %s', (role) => {
    describe.each(completedCaseStates)('%s cases', (state) => {
      const accessibleCaseAppealStates = [
        CaseAppealState.RECEIVED,
        CaseAppealState.COMPLETED,
        CaseAppealState.WITHDRAWN,
      ]

      describe.each(accessibleCaseAppealStates)(
        'can view case files for %s cases',
        (appealState) => {
          let then: Then

          beforeEach(() => {
            mockRequest.mockImplementationOnce(() => ({
              user: {
                role,
                institution: { type: InstitutionType.COURT_OF_APPEALS },
              },
              case: { state, appealState },
            }))

            then = givenWhenThen()
          })

          it('should activate', () => {
            expect(then.result).toBe(true)
          })
        },
      )

      describe.each([
        undefined,
        ...Object.values(CaseAppealState).filter(
          (state) => !accessibleCaseAppealStates.includes(state),
        ),
      ])('can not view case files for %s cases', (appealState) => {
        let then: Then

        beforeEach(() => {
          mockRequest.mockImplementationOnce(() => ({
            user: {
              role,
              institution: { type: InstitutionType.COURT_OF_APPEALS },
            },
            case: { state, appealState },
          }))

          then = givenWhenThen()
        })

        it('should throw ForbiddenException', () => {
          expect(then.error).toBeInstanceOf(ForbiddenException)
          expect(then.error.message).toBe(`Forbidden for ${role}`)
        })
      })
    })

    describe.each(
      Object.keys(CaseState).filter(
        (state) => !completedCaseStates.includes(state as CaseState),
      ),
    )('%s cases', (state) => {
      describe.each([undefined, ...Object.values(CaseAppealState)])(
        'can not view case files for %s cases',
        (appealState) => {
          let then: Then

          beforeEach(() => {
            mockRequest.mockImplementationOnce(() => ({
              user: {
                role,
                institution: { type: InstitutionType.COURT_OF_APPEALS },
              },
              case: { state, appealState },
            }))

            then = givenWhenThen()
          })

          it('should throw ForbiddenException', () => {
            expect(then.error).toBeInstanceOf(ForbiddenException)
            expect(then.error.message).toBe(`Forbidden for ${role}`)
          })
        },
      )
    })
  })

  describe.each(Object.keys(CaseState))('in state %s', (state) => {
    describe.each(
      Object.keys(UserRole).filter(
        (role) =>
          ![
            ...prosecutionRoles,
            ...districtCourtRoles,
            ...courtOfAppealsRoles,
          ].includes(role as UserRole),
      ),
    )('role %s', (role) => {
      let then: Then

      beforeEach(() => {
        mockRequest.mockImplementationOnce(() => ({
          user: { role },
          case: { state },
        }))

        then = givenWhenThen()
      })

      it('should throw ForbiddenException', () => {
        expect(then.error).toBeInstanceOf(ForbiddenException)
        expect(then.error.message).toBe(`Forbidden for ${role}`)
      })
    })
  })

  describe('missing user', () => {
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({}))

      then = givenWhenThen()
    })

    it('should throw InternalServerErrorException', () => {
      expect(then.error).toBeInstanceOf(InternalServerErrorException)
      expect(then.error.message).toBe('Missing user')
    })
  })

  describe('missing case', () => {
    const user = {} as User
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({ user }))

      then = givenWhenThen()
    })

    it('should throw InternalServerErrorException', () => {
      expect(then.error).toBeInstanceOf(InternalServerErrorException)
      expect(then.error.message).toBe('Missing case')
    })
  })
})
