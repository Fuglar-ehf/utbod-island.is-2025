import {
  assistantTransitionRule,
  judgeTransitionRule,
  prosecutorTransitionRule,
  registrarTransitionRule,
  prosecutorRepresentativeTransitionRule,
} from '../../guards/rolesRules'
import { CaseController } from '../../case.controller'

describe('CaseController - Transition rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      CaseController.prototype.transition,
    )
  })

  it('should give permission to five roles', () => {
    expect(rules).toHaveLength(5)
    expect(rules).toContain(prosecutorTransitionRule)
    expect(rules).toContain(prosecutorRepresentativeTransitionRule)
    expect(rules).toContain(judgeTransitionRule)
    expect(rules).toContain(registrarTransitionRule)
    expect(rules).toContain(assistantTransitionRule)
  })
})
