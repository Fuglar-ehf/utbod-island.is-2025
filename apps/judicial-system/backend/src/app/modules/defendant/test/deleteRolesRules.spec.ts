import { prosecutorRule } from '../../../guards'
import { DefendantController } from '../defendant.controller'

describe('DefendantController - Delete rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      DefendantController.prototype.delete,
    )
  })

  it('should give permission to one role', () => {
    expect(rules).toHaveLength(1)
  })

  it('should give permission to prosecutors', () => {
    expect(rules).toContain(prosecutorRule)
  })
})
