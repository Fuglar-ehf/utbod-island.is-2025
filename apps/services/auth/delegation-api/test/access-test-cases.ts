import {
  createCurrentUser,
  createNationalId,
} from '@island.is/testing/fixtures'
import { AuthScope } from '@island.is/auth/scopes'
import { User } from '@island.is/auth-nest-tools'
import { ConfigType } from '@island.is/nest/config'
import { DelegationConfig } from '@island.is/auth-api-lib'
import { CreateCustomDelegation, CreateDomain } from './fixtures/types'

export interface DomainAssertion {
  name: string
  scopes: Array<{ name: string }>
}

export interface TestCase {
  user: User
  customScopeRules?: ConfigType<typeof DelegationConfig>['customScopeRules']
  delegations?: CreateCustomDelegation[]
  accessTo?: string[]
  domains: CreateDomain[]
  expected: DomainAssertion[]
}

export const accessTestCases: Record<string, TestCase> = {
  // Normal user should be able to grant delegations for scopes allowing explicit delegation grants.
  happyCase: {
    user: createCurrentUser({ scope: [AuthScope.delegations] }),
    domains: [
      {
        name: 'd1',
        apiScopes: [
          {
            name: 's1',
            allowExplicitDelegationGrant: true,
          },
        ],
      },
    ],
    expected: [
      {
        name: 'd1',
        scopes: [
          {
            name: 's1',
          },
        ],
      },
    ],
  },
  // Should not see scopes unless they allow explicit delegation grants.
  noExplicitDelegationGrant: {
    user: createCurrentUser({ scope: [AuthScope.delegations] }),
    domains: [
      {
        name: 'd1',
        apiScopes: [
          {
            name: 's1',
            allowExplicitDelegationGrant: false,
          },
        ],
      },
    ],
    expected: [],
  },
  // Procuring holder should only see scopes they have access to.
  procuringHolderScopes: {
    user: createCurrentUser({
      nationalIdType: 'company',
      delegationType: 'ProcurationHolder',
      scope: [AuthScope.delegations],
    }),
    domains: [
      {
        name: 'd1',
        apiScopes: [
          {
            name: 's1',
            allowExplicitDelegationGrant: true,
            grantToProcuringHolders: true,
          },
          {
            name: 's2',
            allowExplicitDelegationGrant: true,
            grantToProcuringHolders: false,
          },
          {
            name: 's3',
            allowExplicitDelegationGrant: false,
            grantToProcuringHolders: true,
          },
        ],
      },
    ],
    expected: [
      {
        name: 'd1',
        scopes: [
          {
            name: 's1',
          },
        ],
      },
    ],
  },
  // Can grant forward custom delegations which you have.
  customDelegationScopes: {
    user: createCurrentUser({
      nationalIdType: 'company',
      delegationType: 'Custom',
      scope: [AuthScope.delegations],
    }),
    delegations: [
      {
        domainName: 'd1',
        scopes: [
          {
            scopeName: 's1',
          },
          {
            scopeName: 's2',
          },
        ],
      },
    ],
    domains: [
      {
        name: 'd1',
        apiScopes: [
          {
            name: 's1',
            allowExplicitDelegationGrant: true,
          },
          {
            name: 's2',
            allowExplicitDelegationGrant: false,
          },
        ],
      },
    ],
    expected: [
      {
        name: 'd1',
        scopes: [
          {
            name: 's1',
          },
        ],
      },
    ],
  },
  // Custom delegations should not leak between users.
  unrelatedCustomDelegations: {
    user: createCurrentUser({
      nationalIdType: 'company',
      delegationType: 'Custom',
      scope: [AuthScope.delegations],
    }),
    delegations: [
      {
        domainName: 'd1',
        fromNationalId: createNationalId('company'),
        scopes: [
          {
            scopeName: 's1',
          },
        ],
      },
    ],
    domains: [
      {
        name: 'd1',
        apiScopes: [
          {
            name: 's1',
            allowExplicitDelegationGrant: true,
          },
        ],
      },
    ],
    expected: [],
  },
  // Company actor should not see access controlled scopes except as procuration holder or custom delegation.
  accessControlledCompanyScopes: {
    user: createCurrentUser({
      nationalIdType: 'company',
      scope: [AuthScope.delegations],
      delegationType: ['ProcurationHolder', 'Custom'],
    }),
    accessTo: ['s1', 's2', 's3'],
    delegations: [
      {
        domainName: 'd1',
        scopes: [{ scopeName: 's2' }],
      },
    ],
    domains: [
      {
        name: 'd1',
        apiScopes: [
          {
            name: 's1',
            allowExplicitDelegationGrant: true,
            grantToProcuringHolders: true,
            isAccessControlled: true,
          },
          {
            name: 's2',
            allowExplicitDelegationGrant: true,
            isAccessControlled: true,
          },
          {
            name: 's3',
            allowExplicitDelegationGrant: true,
            isAccessControlled: true,
          },
        ],
      },
    ],
    expected: [
      {
        name: 'd1',
        scopes: [{ name: 's1' }, { name: 's2' }],
      },
    ],
  },
  // Should see scopes configured for specific types of delegation.
  customScopeRulesIncluded: {
    user: createCurrentUser({
      nationalIdType: 'company',
      scope: [AuthScope.delegations],
      delegationType: ['ProcurationHolder', 'Custom'],
    }),
    customScopeRules: [
      { scopeName: 's1', onlyForDelegationType: ['ProcurationHolder'] },
      { scopeName: 's2', onlyForDelegationType: ['Custom'] },
      { scopeName: 's3', onlyForDelegationType: ['LegalGuardian'] },
      { scopeName: 's4', onlyForDelegationType: ['PersonalRepresentative'] },
    ],
    domains: [
      {
        name: 'd1',
        apiScopes: [
          { name: 's1', allowExplicitDelegationGrant: true },
          { name: 's2', allowExplicitDelegationGrant: true },
          { name: 's3', allowExplicitDelegationGrant: true },
          { name: 's4', allowExplicitDelegationGrant: true },
        ],
      },
    ],
    delegations: [
      {
        domainName: 'd1',
        scopes: [
          { scopeName: 's1' },
          { scopeName: 's2' },
          { scopeName: 's3' },
          { scopeName: 's4' },
        ],
      },
    ],
    expected: [
      {
        name: 'd1',
        scopes: [{ name: 's1' }, { name: 's2' }],
      },
    ],
  },
  // Should not see scopes configured for other types of delegation.
  customScopeRulesExcluded: {
    user: createCurrentUser({
      scope: [AuthScope.delegations],
    }),
    customScopeRules: [
      { scopeName: 's1', onlyForDelegationType: ['ProcurationHolder'] },
      { scopeName: 's2', onlyForDelegationType: ['Custom'] },
      { scopeName: 's3', onlyForDelegationType: ['LegalGuardian'] },
      { scopeName: 's4', onlyForDelegationType: ['PersonalRepresentative'] },
    ],
    domains: [
      {
        name: 'd1',
        apiScopes: [
          { name: 's1', allowExplicitDelegationGrant: true },
          { name: 's2', allowExplicitDelegationGrant: true },
          { name: 's3', allowExplicitDelegationGrant: true },
          { name: 's4', allowExplicitDelegationGrant: true },
        ],
      },
    ],
    delegations: [
      {
        domainName: 'd1',
        scopes: [
          { scopeName: 's1' },
          { scopeName: 's2' },
          { scopeName: 's3' },
          { scopeName: 's4' },
        ],
      },
    ],
    expected: [],
  },
}
