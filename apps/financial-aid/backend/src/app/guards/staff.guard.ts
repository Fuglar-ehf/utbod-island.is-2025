import { RolesRule, StaffRole } from '@island.is/financial-aid/shared/lib'
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { getUserFromContext } from '../lib'
import { StaffService } from '../modules/staff'

@Injectable()
export class StaffGuard implements CanActivate {
  constructor(
    private staffService: StaffService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const user = getUserFromContext(context)
    const request = context.switchToHttp().getRequest()

    if (!user || user.service !== RolesRule.VEITA) {
      return false
    }

    const staff = await this.staffService.findByNationalId(user.nationalId)

    if (!staff || staff.active === false) {
      return false
    }

    const staffRolesRule =
      this.reflector.get<StaffRole[]>(
        'staff-roles-rules',
        context.getHandler(),
      ) ?? []

    const rule = staffRolesRule.some((r) => staff.roles.includes(r))

    if (rule === false && staffRolesRule.length > 0) {
      return false
    }

    request.staff = staff

    return true
  }
}
