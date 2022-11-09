import faker from 'faker'

import {
  ApiScope,
  Delegation,
  DelegationDTO,
  DelegationDTOMapper,
  DelegationScope,
  MergedDelegationDTO,
} from '@island.is/auth-api-lib'
import { CreateDelegation } from '@island.is/services/auth/testing'

/**
 * Helper to match complete object when the received object has gone over the "wire"
 * and was JSON stringified.
 * @param received The SUT object recevied
 * @param expected The expected object to be matched against the received object
 */
export const expectMatchingObject = (
  received: DelegationDTO | DelegationDTO[],
  expected: DelegationDTO | DelegationDTO[],
) => {
  if (Array.isArray(received)) {
    sortDelegations(received)
  }
  if (Array.isArray(expected)) {
    sortDelegations(expected)
  }

  expect(received).toMatchObject(JSON.parse(JSON.stringify(expected)))
}

/**
 * Helper to match complete object when the received object has gone over the "wire"
 * and was JSON stringified.
 * @param received The SUT object recevied
 * @param expected The expected object to be matched against the received object
 */
export const expectMatchingMergedDelegations = (
  received: MergedDelegationDTO | MergedDelegationDTO[],
  expected: MergedDelegationDTO | MergedDelegationDTO[],
) => {
  if (Array.isArray(received)) {
    sortMergedDelegations(received)
  }
  if (Array.isArray(expected)) {
    sortMergedDelegations(expected)
  }

  expect(received).toMatchObject(JSON.parse(JSON.stringify(expected)))
}

/**
 * Sorts the delegation by id parameter to use for consistent expecting
 * @param delegations
 */
const sortDelegations = (delegations: DelegationDTO[]) => {
  delegations.sort((a, b) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return a.id === b.id ? 0 : a.id! < b.id! ? -1 : 1
  })
}

export type NameIdTuple = [name: string, id: string]

export const getFakeName = () =>
  faker.fake('{{name.firstName}} {{name.lastName}}')

/**
 * Sorts the merged delegation by fromNationalId parameter to use for consistent expecting
 * @param delegations
 */
const sortMergedDelegations = (delegations: MergedDelegationDTO[]) => {
  delegations.sort((a, b) => {
    return a.fromNationalId === b.fromNationalId
      ? 0
      : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      a.fromNationalId! < b.fromNationalId!
      ? -1
      : 1
  })
}

export async function createDelegationModels(
  model: typeof Delegation,
  creationModels: CreateDelegation[],
) {
  await model.bulkCreate(creationModels, {
    include: [
      {
        model: DelegationScope,
        as: 'delegationScopes',
      },
    ],
  })
}

export async function findExpectedMergedDelegationModels(
  model: typeof Delegation,
  modelIds: string,
  allowedScopes?: string[],
): Promise<MergedDelegationDTO>
export async function findExpectedMergedDelegationModels(
  model: typeof Delegation,
  modelIds: string[],
  allowedScopes?: string[],
): Promise<MergedDelegationDTO[]>
export async function findExpectedMergedDelegationModels(
  model: typeof Delegation,
  modelIds: string | string[],
  allowedScopes?: string[],
): Promise<MergedDelegationDTO | MergedDelegationDTO[]> {
  const expectedModels = await findExpectedDelegationModels(
    model,
    Array.isArray(modelIds) ? modelIds : [modelIds],
    allowedScopes,
  )

  if (Array.isArray(modelIds)) {
    return expectedModels.map((delegation) =>
      DelegationDTOMapper.toMergedDelegationDTO(delegation),
    )
  } else {
    return DelegationDTOMapper.toMergedDelegationDTO(expectedModels[0])
  }
}

export async function findExpectedDelegationModels(
  model: typeof Delegation,
  modelIds: string,
  allowedScopes?: string[],
): Promise<DelegationDTO>
export async function findExpectedDelegationModels(
  model: typeof Delegation,
  modelIds: string[],
  allowedScopes?: string[],
): Promise<DelegationDTO[]>
export async function findExpectedDelegationModels(
  model: typeof Delegation,
  modelIds: string | string[],
  allowedScopes?: string[],
): Promise<DelegationDTO | DelegationDTO[]> {
  const expectedModels = await model.findAll({
    where: {
      id: modelIds,
    },
    include: [
      {
        model: DelegationScope,
        as: 'delegationScopes',
        include: [
          {
            model: ApiScope,
            as: 'apiScope',
            where: {
              allowExplicitDelegationGrant: true,
            },
          },
        ],
      },
    ],
  })

  if (allowedScopes) {
    for (const expectedModel of expectedModels) {
      expectedModel.delegationScopes = expectedModel.delegationScopes?.filter(
        (s) => allowedScopes.includes(s.scopeName),
      )
    }
  }

  if (Array.isArray(modelIds)) {
    return expectedModels.map((delegation) => delegation.toDTO())
  } else {
    return expectedModels[0].toDTO()
  }
}
