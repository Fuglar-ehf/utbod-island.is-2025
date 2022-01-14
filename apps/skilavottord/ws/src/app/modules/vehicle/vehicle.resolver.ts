import { Inject, NotFoundException, forwardRef } from '@nestjs/common'
import { Query, Resolver, Mutation, Args, Int } from '@nestjs/graphql'
import parse from 'date-fns/parse'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { RecyclingRequestTypes } from '../recyclingRequest'
import { Authorize, CurrentUser, User, Role } from '../auth'

import { VehicleModel, VehicleConnection } from './vehicle.model'
import { VehicleService } from './vehicle.service'
import { SamgongustofaService } from '../samgongustofa'

@Authorize()
@Resolver(() => VehicleModel)
export class VehicleResolver {
  constructor(
    private vehicleService: VehicleService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @Inject(forwardRef(() => SamgongustofaService))
    private samgongustofaService: SamgongustofaService,
  ) {}

  @Authorize({ roles: [Role.developer, Role.recyclingFund] })
  @Query(() => VehicleConnection)
  async skilavottordAllDeregisteredVehicles(
    @Args('first', { type: () => Int }) first: number,
    @Args('after') after: string,
  ): Promise<VehicleConnection> {
    const {
      pageInfo,
      totalCount,
      data,
    } = await this.vehicleService.findAllByFilter(first, after, {
      requestType: RecyclingRequestTypes.deregistered,
    })
    return {
      pageInfo,
      count: totalCount,
      items: data,
    }
  }

  @Authorize({
    roles: [Role.developer, Role.recyclingCompany],
  })
  @Query(() => VehicleConnection)
  async skilavottordRecyclingPartnerVehicles(
    @CurrentUser() user: User,
    @Args('first', { type: () => Int }) first: number,
    @Args('after') after: string,
  ): Promise<VehicleConnection> {
    if (!user.partnerId) {
      return {
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: '',
          endCursor: '',
        },
        count: 0,
        items: [],
      }
    }
    const {
      pageInfo,
      totalCount,
      data,
    } = await this.vehicleService.findAllByFilter(first, after, {
      partnerId: user.partnerId,
      requestType: RecyclingRequestTypes.deregistered,
    })
    return {
      pageInfo,
      count: totalCount,
      items: data,
    }
  }

  @Query(() => VehicleModel)
  async skilavottordVehicleById(
    @Args('permno') permno: string,
  ): Promise<VehicleModel> {
    const vehicle = await this.vehicleService.findByVehicleId(permno)
    this.logger.info(
      'skilavottordVehicleById response:' + JSON.stringify(vehicle, null, 2),
    )
    return vehicle
  }

  @Mutation(() => Boolean)
  async createSkilavottordVehicle(
    @CurrentUser() user: User,
    @Args('permno') permno: string,
  ) {
    const vehicle = await this.samgongustofaService.getUserVehicle(
      user.nationalId,
      permno,
    )
    if (!vehicle) {
      this.logger.error(
        `User does not have right to call createSkilavottordVehicle action`,
      )
      throw new NotFoundException(`User does not have this vehicle`)
    }

    const newVehicle = new VehicleModel()
    newVehicle.vinNumber = vehicle.vinNumber
    newVehicle.newregDate = parse(
      vehicle.firstRegDate,
      'dd.MM.yyyy',
      new Date(),
    )
    newVehicle.vehicleColor = vehicle.color
    newVehicle.vehicleType = vehicle.type
    newVehicle.ownerNationalId = user.nationalId
    newVehicle.vehicleId = vehicle.permno
    return await this.vehicleService.create(newVehicle)
  }
}
