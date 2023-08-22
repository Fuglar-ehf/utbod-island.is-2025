import {
  judgeRule,
  prosecutorRule,
  registrarRule,
  representativeRule,
} from '../../../../guards'
import { FileController } from '../../file.controller'

describe('FileController - Delete case file rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      FileController.prototype.deleteCaseFile,
    )
  })

  it('should give permission to four role', () => {
    expect(rules).toHaveLength(4)
    expect(rules).toContain(prosecutorRule)
    expect(rules).toContain(representativeRule)
    expect(rules).toContain(judgeRule)
    expect(rules).toContain(registrarRule)
  })
})
