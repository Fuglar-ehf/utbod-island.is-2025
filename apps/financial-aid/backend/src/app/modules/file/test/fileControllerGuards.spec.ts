import { IdsUserGuard, ScopesGuard } from '@island.is/auth-nest-tools'
import { CanActivate } from '@nestjs/common'
import { RolesGuard } from '../../../guards/roles.guard'
import { StaffGuard } from '../../../guards/staff.guard'

import { FileController } from '../file.controller'

describe('FileController - guards', () => {
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata('__guards__', FileController)
  })

  it('should have two guards', () => {
    expect(guards).toHaveLength(2)
  })

  describe('IdsUserGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have IdsUserGuard as guard 0', () => {
      expect(guard).toBeInstanceOf(IdsUserGuard)
    })
  })

  describe('ScopeGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[1]()
    })

    it('should have ScopeGuard as guard 1', () => {
      expect(guard).toBeInstanceOf(ScopesGuard)
    })
  })
})

describe('FileController - Creates a new signed url guards', () => {
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      FileController.prototype.createSignedUrl,
    )
  })

  it('should have one guard', () => {
    expect(guards).toHaveLength(1)
  })

  describe('RolesGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have RolesGuard as guard 0', () => {
      expect(guard).toBeInstanceOf(RolesGuard)
    })
  })
})

describe('FileController - Creates a new signed url for id guards', () => {
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      FileController.prototype.createSignedUrlForId,
    )
  })

  it('should have two guards', () => {
    expect(guards).toHaveLength(2)
  })

  describe('RolesGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have RolesGuard as guard 0', () => {
      expect(guard).toBeInstanceOf(RolesGuard)
    })
  })

  describe('StaffGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[1]()
    })

    it('should have RolesGuard as guard 1', () => {
      expect(guard).toBeInstanceOf(StaffGuard)
    })
  })
})

describe('FileController - Creates files guards', () => {
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      FileController.prototype.createFiles,
    )
  })

  it('should have one guard', () => {
    expect(guards).toHaveLength(1)
  })

  describe('RolesGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have RolesGuard as guard 0', () => {
      expect(guard).toBeInstanceOf(RolesGuard)
    })
  })
})
