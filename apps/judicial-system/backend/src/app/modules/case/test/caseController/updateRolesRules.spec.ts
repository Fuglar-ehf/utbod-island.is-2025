import {
  assistantUpdateRule,
  judgeUpdateRule,
  prosecutorUpdateRule,
  registrarUpdateRule,
  prosecutorRepresentativeUpdateRule,
} from '../../guards/rolesRules'
import { CaseController } from '../../case.controller'

describe('CaseController - Update rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata('roles-rules', CaseController.prototype.update)
  })

  it('should give permission to five roles', () => {
    expect(rules).toHaveLength(5)
    expect(rules).toContain(prosecutorUpdateRule)
    expect(rules).toContain(prosecutorRepresentativeUpdateRule)
    expect(rules).toContain(judgeUpdateRule)
    expect(rules).toContain(registrarUpdateRule)
    expect(rules).toContain(assistantUpdateRule)
  })
})
