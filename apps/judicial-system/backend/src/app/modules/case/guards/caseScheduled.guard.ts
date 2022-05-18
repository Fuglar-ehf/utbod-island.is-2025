import {
  Injectable,
  CanActivate,
  ExecutionContext,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common'

import {
  CaseState,
  completedCaseStates,
} from '@island.is/judicial-system/types'

@Injectable()
export class CaseScheduledGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const theCase = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    if (
      !(theCase.state === CaseState.RECEIVED && theCase.courtDate) &&
      !completedCaseStates.includes(theCase.state)
    ) {
      throw new ForbiddenException('Forbidden for unscheduled cases')
    }

    return true
  }
}
