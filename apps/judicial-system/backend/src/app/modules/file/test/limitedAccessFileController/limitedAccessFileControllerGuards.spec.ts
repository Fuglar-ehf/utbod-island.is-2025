import { CanActivate } from '@nestjs/common'

import { JwtAuthGuard, RolesGuard } from '@island.is/judicial-system/auth'

import {
  CaseCompletedGuard,
  CaseDefenderGuard,
  LimitedAccessCaseExistsGuard,
} from '../../../case'
import { LimitedAccessFileController } from '../../limitedAccessFile.controller'

describe('LimitedAccessFileController - guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata('__guards__', LimitedAccessFileController)
  })

  it('should have five guards', () => {
    expect(guards).toHaveLength(5)
  })

  describe('JwtAuthGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have JwtAuthGuard as quard 1', () => {
      expect(guard).toBeInstanceOf(JwtAuthGuard)
    })
  })

  describe('RolesGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[1]()
    })

    it('should have RolesGuard as quard 2', () => {
      expect(guard).toBeInstanceOf(RolesGuard)
    })
  })

  describe('LimitedAccessCaseExistsGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[2]()
    })

    it('should have LimitedAccessCaseExistsGuard as quard 3', () => {
      expect(guard).toBeInstanceOf(LimitedAccessCaseExistsGuard)
    })
  })

  describe('CaseCompletedGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[3]()
    })

    it('should have CaseCompletedGuard as quard 4', () => {
      expect(guard).toBeInstanceOf(CaseCompletedGuard)
    })
  })

  describe('CaseDefenderGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[4]()
    })

    it('should have CaseDefenderGuard as quard 5', () => {
      expect(guard).toBeInstanceOf(CaseDefenderGuard)
    })
  })
})
