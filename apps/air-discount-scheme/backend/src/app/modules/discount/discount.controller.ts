import {
  Controller,
  Param,
  Post,
  Get,
  NotFoundException,
  Inject,
  forwardRef,
  UseGuards,
  BadRequestException,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'

import { Discount } from './discount.model'
import {
  CreateDiscountCodeParams,
  GetCurrentDiscountByNationalIdParams,
} from './dto'
import { DiscountService } from './discount.service'
import { FlightService } from '../flight'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User as AuthUser } from '@island.is/auth-nest-tools'
import { UserService } from '../user/user.service'
import { AuthGuard } from '../common'
import { GetUserByDiscountCodeParams } from '../user/dto'
import { AirlineUser } from '../user/user.model'

@ApiTags('Users')
@Controller('api/public')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class PublicDiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Get('discounts/:discountCode/user')
  @ApiOkResponse({ type: AirlineUser })
  async getUserByDiscountCode(
    @Param() params: GetUserByDiscountCodeParams,
  ): Promise<AirlineUser> {
    const discount = await this.discountService.getDiscountByDiscountCode(
      params.discountCode,
    )
    if (!discount) {
      throw new BadRequestException('Discount code is invalid')
    }

    if (!discount.user) {
      throw new NotFoundException(`User<${discount.nationalId}> not found`)
    }

    // Constructor masks nationalId
    const airlineUser = new AirlineUser(discount.user, discount.user.fund)
    return airlineUser
  }
}

@Controller('api/private')
export class PrivateDiscountController {
  constructor(
    private readonly discountService: DiscountService,
    @Inject(forwardRef(() => FlightService))
    private readonly flightService: FlightService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  @Get('users/:nationalId/discounts/current')
  @ApiExcludeEndpoint()
  getCurrentDiscountByNationalId(
    @Param() params: GetCurrentDiscountByNationalIdParams,
  ): Promise<Discount | null> {
    return this.discountService.getDiscountByNationalId(params.nationalId)
  }

  @UseGuards(IdsUserGuard, ScopesGuard)
  @Scopes('@vegagerdin.is/air-discount-scheme-scope')
  @Post('users/:nationalId/discounts')
  @ApiExcludeEndpoint()
  async createDiscountCode(
    @Param() params: CreateDiscountCodeParams,
    @CurrentUser() auth: AuthUser,
  ): Promise<Discount> {
    const user = await this.userService.getUserInfoByNationalId(
      params.nationalId,
      auth,
    )
    if (!user) {
      throw new NotFoundException(`User<${params.nationalId}> not found`)
    }

    const unConnectedFlights = await this.flightService.findThisYearsConnectableFlightsByNationalId(
      params.nationalId,
    )

    return this.discountService.createDiscountCode(
      user,
      params.nationalId,
      unConnectedFlights,
    )
  }
}
