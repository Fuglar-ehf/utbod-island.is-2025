import { map } from 'rxjs/operators'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import { CaseFileCategory, User } from '@island.is/judicial-system/types'

import { canLimitedAccessUserViewCaseFile } from '../../file'

@Injectable()
export class LimitedAccessCaseFileInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest()
    const user: User = request.user

    return next.handle().pipe(
      map((theCase) => {
        const caseFiles = theCase.caseFiles?.filter(
          ({ category }: { category: CaseFileCategory }) =>
            canLimitedAccessUserViewCaseFile(
              user,
              theCase.type,
              theCase.state,
              category,
              theCase.defendants,
              theCase.civilClaimants,
            ),
        )

        return { ...theCase, caseFiles }
      }),
    )
  }
}
