import partition from 'lodash/partition'
import { DomainAssertion, TestCase } from '../../../../test/access-test-cases'

export const partitionDomainsByScopeAccess = (testCase: TestCase) => {
  const accessible: DomainAssertion[] = []
  const inaccessible: DomainAssertion[] = []

  testCase.domains.forEach((domain) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const name = domain.name!
    const scopes = (domain.apiScopes ?? []).map((scope) => ({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      name: scope.name!,
    }))
    const expectedDomain = testCase.expected.find(
      (expected) => expected.name === name,
    )

    if (expectedDomain) {
      const [accessibleScopes, inaccessibleScopes] = partition(
        scopes,
        (scope) =>
          expectedDomain.scopes.find(
            (expected) => expected.name === scope.name,
          ),
      )

      accessible.push({ name, scopes: accessibleScopes })
      if (inaccessibleScopes.length > 0) {
        inaccessible.push({ name, scopes: inaccessibleScopes })
      }
    } else {
      inaccessible.push({ name, scopes })
    }
  })
  return [accessible, inaccessible]
}
