import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

import { Inject, Injectable } from '@nestjs/common'
import {
  VehicleSearchApi,
  BasicVehicleInformationGetRequest,
  BasicVehicleInformationTechnicalMass,
  BasicVehicleInformationTechnicalAxle,
  PersidnoLookup,
  VehicleSearch,
} from '@island.is/clients/vehicles'
import { VehiclesAxle, VehiclesDetail } from '../models/getVehicleDetail.model'
import { ApolloError } from 'apollo-server-express'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import type { Auth, User } from '@island.is/auth-nest-tools'

/** Category to attach each log message to */
const LOG_CATEGORY = 'vehicles-service'

// 1kW equals 1.359622 metric horsepower.
const KW_TO_METRIC_HP = 1.359622

@Injectable()
export class VehiclesService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    @Inject(VehicleSearchApi)
    private vehiclesApi: VehicleSearchApi,
  ) {}

  handleError(error: any, detail?: string): ApolloError | null {
    this.logger.error(detail || 'Vehicles error', {
      error: JSON.stringify(error),
      category: LOG_CATEGORY,
    })
    throw new ApolloError('Failed to resolve request', error.status)
  }

  private handle4xx(error: any, detail?: string): ApolloError | null {
    if (error.status === 403 || error.status === 404) {
      return null
    }
    return this.handleError(error, detail)
  }

  private getVehiclesWithAuth(auth: Auth) {
    return this.vehiclesApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getVehiclesForUser(
    auth: User,
    showDeregistered: boolean,
    showHistory: boolean,
  ): Promise<PersidnoLookup | null | ApolloError> {
    try {
      const res = await this.getVehiclesWithAuth(auth).vehicleHistoryGet({
        requestedPersidno: auth.nationalId,
        showDeregistered: showDeregistered,
        showHistory: showHistory,
      })
      const { data } = res
      if (!data) return {}
      return data
    } catch (e) {
      return this.handle4xx(e, 'Failed to get vehicle list')
    }
  }

  async getVehiclesSearch(
    auth: User,
    search: string,
  ): Promise<VehicleSearch | null | ApolloError> {
    try {
      const res = await this.getVehiclesWithAuth(auth).vehicleSearchGet({
        search,
      })
      const { data } = res
      if (!data) return null
      return data[0]
    } catch (e) {
      return this.handle4xx(e, 'Failed to get vehicle search')
    }
  }

  async getSearchLimit(auth: User): Promise<number | null | ApolloError> {
    try {
      const res = await this.getVehiclesWithAuth(auth).searchesRemainingGet()
      if (!res) return null
      return res
    } catch (e) {
      return this.handle4xx(e, 'Failed to get vehicle search limit')
    }
  }

  async getVehicleDetail(
    auth: User,
    input: BasicVehicleInformationGetRequest,
  ): Promise<VehiclesDetail | null | ApolloError> {
    try {
      const res = await this.getVehiclesWithAuth(
        auth,
      ).basicVehicleInformationGet({
        clientPersidno: input.clientPersidno,
        permno: input.permno,
        regno: input.regno,
        vin: input.vin,
      })
      const { data } = res

      if (!data) return null
      const newestInspection = data.inspections?.sort((a, b) => {
        if (a && b && a.date && b.date)
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        else return 0
      })[0]

      const axleMaxWeight =
        (data.techincal?.mass?.massdaxle1
          ? data.techincal?.mass?.massdaxle1
          : 0) +
        (data.techincal?.mass?.massdaxle2
          ? data.techincal?.mass?.massdaxle2
          : 0) +
        (data.techincal?.mass?.massdaxle3
          ? data.techincal?.mass?.massdaxle3
          : 0) +
        (data.techincal?.mass?.massdaxle4
          ? data.techincal?.mass?.massdaxle4
          : 0) +
        (data.techincal?.mass?.massdaxle5
          ? data.techincal?.mass?.massdaxle5
          : 0)

      const numberOfAxles = data.techincal?.axle?.axleno ?? 0

      const axles: VehiclesAxle[] = []

      if (
        data &&
        data.techincal &&
        data.techincal.axle &&
        data.techincal.mass
      ) {
        for (let i = 1; i <= numberOfAxles; i++) {
          axles.push({
            axleMaxWeight:
              data.techincal.mass[
                `massdaxle${i}` as keyof BasicVehicleInformationTechnicalMass
              ],
            wheelAxle: data.techincal.axle[
              `wheelaxle${i}` as keyof BasicVehicleInformationTechnicalAxle
            ]?.toString(),
          })
        }
      }

      const year =
        data.modelyear ??
        data.productyear ??
        (data.firstregdate ? new Date(data?.firstregdate).getFullYear() : null)

      const operators = data.operators?.filter((x) => x.current)
      const coOwners = data.owners?.find((x) => x.current)?.coOwners
      const owner = data.owners?.find((x) => x.current === true)

      const userNationalId = input.clientPersidno
      const isOwner = userNationalId === owner?.persidno
      const isCoOwner = coOwners?.some(
        (person) => person.persidno === userNationalId,
      )
      const isOperator = operators?.some(
        (person) => person.persidno === userNationalId,
      )

      if ((!isOwner && !isCoOwner && !isOperator) || !userNationalId) {
        this.logger.warn('No match for user ID in vehicle response')
        return null
      }

      const response: VehiclesDetail = {
        mainInfo: {
          model: data.make,
          subModel: data.vehcom ?? '' + data.speccom ?? '',
          regno: data.regno,
          year: year,
          co2: data?.techincal?.co2,
          weightedCo2: data?.techincal?.weightedCo2,
          co2Wltp: data?.techincal?.co2Wltp,
          weightedCo2Wltp: data?.techincal?.weightedco2Wltp,
          cubicCapacity: data.techincal?.capacity,
          trailerWithBrakesWeight: data.techincal?.tMassoftrbr,
          trailerWithoutBrakesWeight: data.techincal?.tMassoftrunbr,
        },
        basicInfo: {
          model: data.make,
          regno: data.regno,
          subModel: data.vehcom ?? '' + data.speccom ?? '',
          permno: data.permno,
          verno: data.vin,
          year: year,
          country: data.country,
          preregDateYear: data.preregdate?.slice(0, 4), // "2013-09-26" return only year as string
          formerCountry: data.formercountry,
          importStatus: data._import,
        },
        registrationInfo: {
          firstRegistrationDate: data.firstregdate,
          preRegistrationDate: data.preregdate,
          newRegistrationDate: data.newregdate ?? data.firstregdate,
          vehicleGroup: data.techincal?.vehgroup,
          color: data.color,
          reggroup: data.plates?.[0].reggroup ?? null,
          reggroupName: data.plates?.[0]?.reggroupname ?? null,
          passengers: data.techincal?.pass,
          useGroup: data.usegroup,
          driversPassengers: data.techincal?.passbydr,
          standingPassengers: data.techincal?.standingno,
          plateLocation: data.platestoragelocation,
          specialName: data.speccom,
          plateStatus: data.platestatus,
        },
        currentOwnerInfo: {
          owner: owner?.fullname,
          nationalId: owner?.persidno,
          address: owner?.address,
          postalcode: owner?.postalcode,
          city: owner?.city,
          dateOfPurchase: owner?.purchasedate,
        },
        inspectionInfo: {
          type: newestInspection?.type,
          date: newestInspection?.date,
          result: newestInspection?.result,
          nextInspectionDate: data.nextinspectiondate,
          lastInspectionDate: data.inspections?.[0]?.date ?? null,
          insuranceStatus: data.insurancestatus,
          mortages: data?.fees?.hasEncumbrances,
          carTax: data?.fees?.gjold?.bifreidagjald,
          inspectionFine: data?.fees?.inspectionfine,
        },
        technicalInfo: {
          engine: data.techincal?.engine,
          totalWeight: data.techincal?.mass?.massladen,
          cubicCapacity: data.techincal?.capacity,
          capacityWeight: data.techincal?.mass?.massofcomb,
          length: data.techincal?.size?.length,
          vehicleWeight: data.techincal?.mass?.massinro,
          width: data.techincal?.size?.width,
          trailerWithoutBrakesWeight: data.techincal?.tMassoftrunbr,
          horsepower: data.techincal?.maxNetPower
            ? Math.round(data.techincal.maxNetPower * KW_TO_METRIC_HP * 10) / 10
            : null,
          trailerWithBrakesWeight: data.techincal?.tMassoftrbr,
          carryingCapacity: data.techincal?.mass?.masscapacity,
          axleTotalWeight: axleMaxWeight,
          axles: axles,
          tyres: {
            axle1: data.techincal?.tyre?.tyreaxle1,
            axle2: data.techincal?.tyre?.tyreaxle2,
            axle3: data.techincal?.tyre?.tyreaxle3,
            axle4: data.techincal?.tyre?.tyreaxle4,
            axle5: data.techincal?.tyre?.tyreaxle5,
          },
        },
        ownersInfo:
          data.owners?.map((x) => {
            const ownerAdderss = x.address
              ? `${x.address}${x.postalcode || x.city ? ', ' : ''}${
                  x.postalcode ? `${x.postalcode} ` : ''
                }${x.city ?? ''}`
              : undefined
            return {
              name: x.fullname,
              nationalId: x.persidno,
              address: ownerAdderss,
              dateOfPurchase: x.purchasedate,
            }
          }) || [],
        coOwners:
          coOwners?.map((x) => {
            return {
              owner: x.fullname,
              nationalId: x.persidno,
              address: x.address,
              postalCode: x.postalcode,
              city: x.city,
            }
          }) || [],
        operators:
          operators?.map((operator) => {
            return {
              nationalId: operator.persidno,
              name: operator.fullname,
              address: operator.address,
              postalcode: operator.postalcode,
              city: operator.city,
              startDate: operator.startdate,
              endDate: operator.enddate,
            }
          }) || undefined,
      }
      return response
    } catch (e) {
      return this.handle4xx(e, 'Failed to get vehicle details')
    }
  }
}
