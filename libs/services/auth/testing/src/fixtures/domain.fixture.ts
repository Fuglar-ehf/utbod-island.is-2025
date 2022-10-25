import faker from 'faker'
import { createNationalId } from '@island.is/testing/fixtures'
import { Domain } from '@island.is/auth-api-lib'

export type CreateDomain = Pick<Domain, 'name' | 'description' | 'nationalId'>

export const createDomain = ({
  name,
  description,
  nationalId,
}: Partial<CreateDomain> = {}): CreateDomain => {
  return {
    name: name ?? faker.random.word(),
    description: description ?? faker.lorem.sentence(),
    nationalId: nationalId ?? createNationalId('company'),
  }
}
