import { Args, Query, Resolver } from '@nestjs/graphql'
import { ApiScope } from '@island.is/auth/scopes'
import { Inject, UseGuards } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import { VehiclesService } from './api-domains-vehicles.service'
import { VehiclesHistory, VehiclesList } from '../models/usersVehicles.model'
import { Audit } from '@island.is/nest/audit'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { GetVehicleDetailInput } from '../dto/getVehicleDetailInput'
import { VehiclesDetail } from '../models/getVehicleDetail.model'
import { VehiclesVehicleSearch } from '../models/getVehicleSearch.model'
import { GetVehicleSearchInput } from '../dto/getVehicleSearchInput'
import { DownloadServiceConfig } from '@island.is/nest/config'
import type { ConfigType } from '@island.is/nest/config'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.vehicles)
@Resolver()
@Audit({ namespace: '@island.is/api/vehicles' })
export class VehiclesResolver {
  constructor(
    private readonly vehiclesService: VehiclesService,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadServiceConfig: ConfigType<
      typeof DownloadServiceConfig
    >,
  ) {}

  @Query(() => VehiclesList, { name: 'vehiclesList', nullable: true })
  @Audit()
  async getVehicleList(@CurrentUser() user: User) {
    const data = await this.vehiclesService.getVehiclesForUser(
      user,
      false,
      false,
    )
    const downloadServiceURL = `${this.downloadServiceConfig.baseUrl}/download/v1/vehicles/ownership/${user.nationalId}`

    return { ...data, downloadServiceURL }
  }

  @Query(() => VehiclesHistory, { name: 'vehiclesHistoryList', nullable: true })
  @Audit()
  async getVehicleHistory(@CurrentUser() user: User) {
    return await this.vehiclesService.getVehiclesForUser(user, true, true)
  }

  @Query(() => VehiclesDetail, { name: 'vehiclesDetail', nullable: true })
  @Audit()
  async getVehicleDetail(
    @Args('input') input: GetVehicleDetailInput,
    @CurrentUser() user: User,
  ) {
    const data = await this.vehiclesService.getVehicleDetail(user, {
      clientPersidno: user.nationalId,
      permno: input.permno,
      regno: input.regno,
      vin: input.vin,
    })
    const downloadServiceURL = `${this.downloadServiceConfig.baseUrl}/download/v1/vehicles/history/${input.permno}`
    return { ...data, downloadServiceURL }
  }

  @Query(() => Number, {
    name: 'vehiclesSearchLimit',
    nullable: true,
  })
  @Audit()
  async getVehiclesSearchLimit(@CurrentUser() user: User) {
    return await this.vehiclesService.getSearchLimit(user)
  }

  @Query(() => VehiclesVehicleSearch, {
    name: 'vehiclesSearch',
    nullable: true,
  })
  @Audit()
  async getVehicleSearch(
    @Args('input') input: GetVehicleSearchInput,
    @CurrentUser() user: User,
  ) {
    return await this.vehiclesService.getVehiclesSearch(user, input.search)
  }
}
