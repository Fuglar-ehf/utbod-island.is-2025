import { StateLifeCycle } from '@island.is/application/types'

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  ONEACCEPTED = 'oneAccepted',
  TWOACCEPTED = 'twoAccepted',
  SIGNING = 'signing',
}

export enum Roles {
  APPLICANT = 'applicant',
}

export const pruneAfterDays = (Days: number): StateLifeCycle => {
  return {
    shouldBeListed: false,
    shouldBePruned: true,
    whenToPrune: Days * 24 * 3600 * 1000,
  }
}
