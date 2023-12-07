import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import {
  VehicleSearchApi,
  BasicVehicleInformationGetRequest,
  PublicVehicleSearchApi,
  VehicleDtoListPagedResponse,
  VehicleSearchDto,
  PersidnoLookupResultDto,
} from '@island.is/clients/vehicles'
import {
  CanregistermileagePermnoGetRequest,
  GetMileageReadingRequest,
  MileageReadingApi,
  PostMileageReadingModel,
  PutMileageReadingModel,
  RequiresmileageregistrationPermnoGetRequest,
  RootPostRequest,
  RootPutRequest,
} from '@island.is/clients/vehicles-mileage'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import type { Auth, User } from '@island.is/auth-nest-tools'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { basicVehicleInformationMapper } from '../utils/basicVehicleInformationMapper'
import { VehiclesDetail, VehiclesExcel } from '../models/getVehicleDetail.model'
import { GetVehiclesForUserInput } from '../dto/getVehiclesForUserInput'
import { VehicleMileageOverview } from '../models/getVehicleMileage.model'
import isSameDay from 'date-fns/isSameDay'

const LOG_CATEGORY = 'vehicle-service'
const UNAUTHORIZED_LOG = 'Vehicle user authorization failed'

const isReadDateToday = (d?: Date) => {
  if (!d) {
    return false
  }

  const today = new Date()
  const inputDate = new Date(d)

  return isSameDay(today, inputDate)
}

@Injectable()
export class VehiclesService {
  constructor(
    private vehiclesApi: VehicleSearchApi,
    private mileageReadingApi: MileageReadingApi,
    private readonly featureFlagService: FeatureFlagService,
    @Inject(PublicVehicleSearchApi)
    private publicVehiclesApi: PublicVehicleSearchApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  private getVehiclesWithAuth(auth: Auth) {
    return this.vehiclesApi.withMiddleware(new AuthMiddleware(auth))
  }

  private getMileageWithAuth(auth: Auth) {
    return this.mileageReadingApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getVehiclesForUser(
    auth: User,
    input: GetVehiclesForUserInput,
  ): Promise<VehicleDtoListPagedResponse> {
    return await this.getVehiclesWithAuth(
      auth,
    ).vehicleHistoryRequestedPersidnoGet({
      requestedPersidno: auth.nationalId,
      showDeregistered: input.showDeregeristered,
      showHistory: input.showHistory,
      page: input.page,
      pageSize: input.pageSize,
      type: input.type,
      dtFrom: input.dateFrom,
      dtTo: input.dateTo,
      permno: input.permno
        ? input.permno.length < 5
          ? `${input.permno}*`
          : `${input.permno}`
        : undefined,
    })
  }

  async getVehiclesForUserOldService(
    auth: User,
    showDeregistered: boolean,
    showHistory: boolean,
  ): Promise<PersidnoLookupResultDto> {
    return await this.getVehiclesWithAuth(auth).vehicleHistoryGet({
      requestedPersidno: auth.nationalId,
      showDeregistered: showDeregistered,
      showHistory: showHistory,
    })
  }

  async getExcelVehiclesForUser(auth: User): Promise<VehiclesExcel> {
    const res = await this.getVehiclesWithAuth(auth).ownershipReportDataGet({
      ssn: auth.nationalId,
    })

    return {
      persidno: res.persidno ?? undefined,
      name: res.name ?? undefined,
      vehicles: res.vehicles?.map((item) =>
        basicVehicleInformationMapper(item),
      ),
    }
  }

  async getPublicVehicleSearch(search: string) {
    const data = await this.publicVehiclesApi.publicVehicleSearchGet({
      search,
    })
    return data
  }

  async getSearchLimit(auth: User): Promise<number | null> {
    const res = await this.getVehiclesWithAuth(auth).searchesRemainingGet()
    if (!res) return null
    return res
  }

  async getVehicleDetail(
    auth: User,
    input: BasicVehicleInformationGetRequest,
  ): Promise<VehiclesDetail | null> {
    const res = await this.getVehiclesWithAuth(auth).basicVehicleInformationGet(
      {
        clientPersidno: input.clientPersidno,
        permno: input.permno,
        regno: input.regno,
        vin: input.vin,
      },
    )

    if (!res) return null

    return basicVehicleInformationMapper(res)
  }

  private async hasVehicleServiceAuth(
    auth: User,
    permno: string,
  ): Promise<void> {
    try {
      await this.getVehicleDetail(auth, {
        clientPersidno: auth.nationalId,
        permno,
      })
    } catch (e) {
      if (e.status === 401 || e.status === 403) {
        this.logger.error(UNAUTHORIZED_LOG, {
          category: LOG_CATEGORY,
          error: e,
        })
        throw new UnauthorizedException(UNAUTHORIZED_LOG)
      }
      throw e as Error
    }
  }

  async getVehiclesSearch(
    auth: User,
    search: string,
  ): Promise<VehicleSearchDto | null> {
    const res = await this.getVehiclesWithAuth(auth).vehicleSearchGet({
      search,
    })
    const { data } = res
    if (!data) return null
    return data[0]
  }

  async getVehicleMileage(
    auth: User,
    input: GetMileageReadingRequest,
  ): Promise<VehicleMileageOverview | null> {
    const featureFlagOn = await this.featureFlagService.getValue(
      Features.servicePortalVehicleMileagePageEnabled,
      false,
      auth,
    )

    if (!featureFlagOn) {
      return null
    }

    await this.hasVehicleServiceAuth(auth, input.permno)

    const res = await this.getMileageWithAuth(auth).getMileageReading({
      permno: input.permno,
    })

    const latestDate = res?.[0]?.readDate

    return {
      data: res,
      permno: input.permno,
      editing: isReadDateToday(latestDate ?? undefined),
    }
  }

  async postMileageReading(
    auth: User,
    input: RootPostRequest['postMileageReadingModel'],
  ): Promise<PostMileageReadingModel | null> {
    if (!input) return null

    await this.hasVehicleServiceAuth(auth, input.permno)

    const res = await this.getMileageWithAuth(auth).rootPost({
      postMileageReadingModel: input,
    })

    return res
  }

  async putMileageReading(
    auth: User,
    input: RootPutRequest['putMileageReadingModel'],
  ): Promise<PutMileageReadingModel | null> {
    if (!input) return null

    await this.hasVehicleServiceAuth(auth, input.permno)

    const res = await this.getMileageWithAuth(auth).rootPut({
      putMileageReadingModel: input,
    })
    return res
  }

  async canRegisterMileage(
    auth: User,
    input: CanregistermileagePermnoGetRequest,
  ): Promise<boolean> {
    const featureFlagOn = await this.featureFlagService.getValue(
      Features.servicePortalVehicleMileagePageEnabled,
      false,
      auth,
    )

    if (!featureFlagOn) {
      return false
    }

    const res = await this.getMileageWithAuth(auth).canregistermileagePermnoGet(
      {
        permno: input.permno,
      },
    )

    if (typeof res === 'string') {
      return res === 'true'
    }
    return res
  }

  async requiresMileageRegistration(
    auth: User,
    input: RequiresmileageregistrationPermnoGetRequest,
  ): Promise<boolean> {
    const featureFlagOn = await this.featureFlagService.getValue(
      Features.servicePortalVehicleMileagePageEnabled,
      false,
      auth,
    )

    if (!featureFlagOn) {
      return false
    }

    const res = await this.getMileageWithAuth(
      auth,
    ).requiresmileageregistrationPermnoGet({
      permno: input.permno,
    })

    if (typeof res === 'string') {
      return res === 'true'
    }
    return res
  }
}
