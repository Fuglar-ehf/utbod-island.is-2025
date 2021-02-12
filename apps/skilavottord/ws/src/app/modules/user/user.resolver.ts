import { Query, Resolver } from '@nestjs/graphql'
import { User } from './models'
import { Authorize, AuthService, CurrentUser, AuthUser } from '../auth'
import { Role } from '../auth/auth.types'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Inject } from '@nestjs/common'

@Resolver(() => User)
export class UserResolver {
  constructor(
    private authService: AuthService,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  @Authorize({ throwOnUnAuthorized: false })
  @Query(() => User, { nullable: true })
  skilavottordUser(@CurrentUser() user: AuthUser): User {
    this.logger.info(`--- skilavottordUser starting ---`)
    if (!user) {
      this.logger.info(`  - User does not exist`)
      return null
    }
    this.logger.info(`  - User exists`)
    const currUser = new User()

    currUser.nationalId = user.nationalId
    currUser.name = user.name
    currUser.mobile = user.mobile

    const authService = new AuthService()

    const RoleUser: AuthUser = {
      nationalId: user.nationalId,
      mobile: user.mobile,
      name: user.name,
    }

    let RoleForUser: Role = 'citizen' // citizen is the deault role
    RoleForUser = authService.getRole(RoleUser)

    currUser.role = RoleForUser
    if (
      currUser.nationalId === '1811673949' ||
      currUser.nationalId === '2405843609' ||
      currUser.nationalId === '2811638099'
    ) {
      currUser.partnerId = '104' // This is partner Id for Hringras, to be fixed later
    } else if (
      currUser.nationalId === '2211692989' ||
      currUser.nationalId === '2808714009' ||
      currUser.nationalId === '3108654949' ||
      currUser.nationalId === '2512942099' ||
      currUser.nationalId === '0306942609'
    ) {
      currUser.partnerId = '221' // This is partner Id for Fura, to be fixed later
    } else if (
      currUser.role === 'recyclingCompany' ||
      currUser.role === 'developer'
    ) {
      currUser.partnerId = '110' // This is partner Id for Vaka, to be fixed later
    } else {
      currUser.partnerId = null // Normal citizen user
    }
    /* this.logger.info(
      `  - skilavottordUser returning  ${currUser.name} - ${currUser.nationalId} - ${currUser.mobile} - ${currUser.role} - ${currUser.partnerId}`,
    )*/
    this.logger.info(`--- skilavottordUser ending ---`)

    return currUser
  }
}
