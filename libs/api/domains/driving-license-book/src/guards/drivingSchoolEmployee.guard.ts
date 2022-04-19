import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { DrivingLicenseBookService } from '../drivingLicenseBook.service'

@Injectable()
export class DrivingSchoolEmployeeGuard implements CanActivate {
  constructor(
    private readonly drivingLicenseBookService: DrivingLicenseBookService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context)
    const user = ctx.getContext().req.user
    return await this.drivingLicenseBookService.isSchoolStaff(user)
  }
}
