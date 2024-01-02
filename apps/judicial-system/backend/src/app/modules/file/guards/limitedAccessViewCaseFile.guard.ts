import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import {
  CaseFileCategory,
  defenderCaseFileCategoriesForIndictmentCases,
  defenderCaseFileCategoriesForRestrictionAndInvestigationCases,
  isCompletedCase,
  isDefenceUser,
  isIndictmentCase,
  isInvestigationCase,
  isPrisonSystemUser,
  isRestrictionCase,
  User,
} from '@island.is/judicial-system/types'

import { Case } from '../../case'
import { CaseFile } from '../models/file.model'

@Injectable()
export class LimitedAccessViewCaseFileGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const user: User = request.user

    if (!user) {
      throw new InternalServerErrorException('Missing user')
    }

    const theCase: Case = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    const caseFile: CaseFile = request.caseFile

    if (!caseFile) {
      throw new InternalServerErrorException('Missing case file')
    }

    if (isCompletedCase(theCase.state) && caseFile.category) {
      if (isDefenceUser(user)) {
        if (
          (isRestrictionCase(theCase.type) ||
            isInvestigationCase(theCase.type)) &&
          defenderCaseFileCategoriesForRestrictionAndInvestigationCases.includes(
            caseFile.category,
          )
        ) {
          return true
        }

        if (
          isIndictmentCase(theCase.type) &&
          defenderCaseFileCategoriesForIndictmentCases.includes(
            caseFile.category,
          )
        ) {
          return true
        }
      } else if (isPrisonSystemUser(user)) {
        if (caseFile.category === CaseFileCategory.APPEAL_RULING) {
          return true
        }
      }
    }

    throw new ForbiddenException(`Forbidden for ${user.role}`)
  }
}
