import {
  Injectable,
  CanActivate,
  ExecutionContext,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common'

import { CaseType } from '@island.is/judicial-system/types'

@Injectable()
export class CaseTypeGuard implements CanActivate {
  constructor(readonly allowedCaseTypes: CaseType[]) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const theCase = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    if (!this.allowedCaseTypes.includes(theCase.type)) {
      throw new ForbiddenException(`Forbidden for ${theCase.type} cases`)
    }

    return true
  }
}
