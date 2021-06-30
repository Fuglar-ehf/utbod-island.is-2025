import { Endorsement } from '../../types/schema'
import { constituencyMapper, EndorsementListTags } from '../../constants'

export const PAGE_SIZE = 10

export function paginate(
  endorsements: Endorsement[] | undefined,
  pageSize: number,
  pageNumber: number,
) {
  if (endorsements === undefined) return
  else {
    return endorsements.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize,
    )
  }
}

export function calculateTotalPages(endorsementsLength: number | undefined) {
  if (endorsementsLength === undefined) return 0
  else {
    return Math.ceil(endorsementsLength / PAGE_SIZE)
  }
}

export function minAndMaxEndorsements(constituency: EndorsementListTags) {
  const maxEndorsements =
    constituencyMapper[constituency as EndorsementListTags]
      .parliamentary_seats * 40
  const minEndorsements =
    constituencyMapper[constituency as EndorsementListTags]
      .parliamentary_seats * 30
  return { minEndorsements, maxEndorsements }
}
