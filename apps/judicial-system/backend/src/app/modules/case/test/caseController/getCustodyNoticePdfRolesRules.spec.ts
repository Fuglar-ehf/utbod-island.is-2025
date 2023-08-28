import {
  judgeRule,
  prosecutorRule,
  registrarRule,
  staffRule,
} from '../../../../guards'
import { CaseController } from '../../case.controller'

describe('CaseController - Get custody notice pdf rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      CaseController.prototype.getCustodyNoticePdf,
    )
  })

  it('should give permission to four roles', () => {
    expect(rules).toHaveLength(4)
    expect(rules).toContain(prosecutorRule)
    expect(rules).toContain(judgeRule)
    expect(rules).toContain(registrarRule)
    expect(rules).toContain(staffRule)
  })
})
