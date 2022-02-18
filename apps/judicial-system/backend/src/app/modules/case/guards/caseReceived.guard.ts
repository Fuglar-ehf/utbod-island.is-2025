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
export class CaseReceivedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const theCase = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    if (![CaseState.RECEIVED, ...completedCaseStates].includes(theCase.state)) {
      throw new ForbiddenException('Forbidden for uncompleted cases')
    }

    return true
  }
}
