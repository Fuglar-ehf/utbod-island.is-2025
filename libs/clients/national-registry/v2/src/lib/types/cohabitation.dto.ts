import { Hjuskapur } from '../../../gen/fetch'
import { logger } from '@island.is/logging'

export interface CohabitationDto {
  cohabitationCode: string
  spouseName: string
  spouseNationalId: string
  lastModified: Date | null
}

export function formatCohabitationDto(
  cohabitation: Hjuskapur | null,
): CohabitationDto | null {
  if (cohabitation == null) {
    return null
  }
  const {
    nafnMaka: spouseName,
    kennitalaMaka: spouseNationalId,
    hjuskaparkodi: cohabitationCode,
    breytt: lastModified,
  } = cohabitation
  if (
    spouseName == null ||
    spouseNationalId == null ||
    cohabitationCode == null
  ) {
    logger.warn(
      'Received partial cohabitation information from the national registry.',
      cohabitation,
    )
    return null
  }
  return {
    spouseName,
    spouseNationalId,
    cohabitationCode,
    lastModified: lastModified ? new Date(lastModified) : null,
  }
}
