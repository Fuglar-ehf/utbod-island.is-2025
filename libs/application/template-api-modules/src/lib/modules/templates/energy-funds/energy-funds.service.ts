import { Inject, Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import { EnergyFundsAnswers } from '@island.is/application/templates/energy-funds'
import { VehicleMiniDto, VehicleSearchApi } from '@island.is/clients/vehicles'
import { TemplateApiError } from '@island.is/nest/problem'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { coreErrorMessages } from '@island.is/application/core'
import { EnergyFundsClientService } from '@island.is/clients/energy-funds'
import format from 'date-fns/format'
import { VehiclesCurrentVehicle } from './types'

@Injectable()
export class EnergyFundsService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly energyFundsClientService: EnergyFundsClientService,
    private readonly vehiclesApi: VehicleSearchApi,
  ) {
    super(ApplicationTypes.ENERGY_FUNDS)
  }

  private vehiclesApiWithAuth(auth: Auth) {
    return this.vehiclesApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getCurrentVehiclesWithDetails({ auth }: TemplateApiModuleActionProps) {
    const results = await this.vehiclesApiWithAuth(auth).currentVehiclesGet({
      persidNo: auth.nationalId,
      showOwned: true,
      showCoowned: false,
      showOperated: false,
    })

    let onlyElectricVehicles: Array<VehiclesCurrentVehicle> = []
    onlyElectricVehicles = results.filter(
      (x) => x.fuelCode && parseInt(x.fuelCode) === 3,
    )

    if (onlyElectricVehicles.length < 5) {
      onlyElectricVehicles = await Promise.all(
        onlyElectricVehicles.map(async (vehicle: VehicleMiniDto) => {
          const vehicleGrant =
            await this.energyFundsClientService.getCatalogValueForVehicle(
              auth,
              vehicle,
            )
          return {
            ...vehicle,
            vehicleGrant: vehicleGrant?.priceAmount,
            vehicleGrantItemCode: vehicleGrant?.itemCode,
          }
        }),
      )
    }

    const onlyElectricVehiclesWithGrant = onlyElectricVehicles.filter(
      (x) => x.vehicleGrant !== undefined,
    )

    // Validate that user has at least 1 vehicle that fulfills requirements
    if (
      !onlyElectricVehiclesWithGrant ||
      !onlyElectricVehiclesWithGrant.length
    ) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.electricVehicleListEmptyOwner,
          summary: coreErrorMessages.electricVehicleListEmptyOwner,
        },
        400,
      )
    }

    return await Promise.all(
      onlyElectricVehiclesWithGrant?.map(async (vehicle) => {
        let hasReceivedSubsidy: boolean | undefined

        // Only validate if fewer than 5 items
        if (onlyElectricVehiclesWithGrant.length < 5) {
          // Get subsidy status
          hasReceivedSubsidy =
            await this.energyFundsClientService.checkVehicleSubsidyAvilability(
              auth,
              vehicle.vin || '',
            )
        }

        return {
          permno: vehicle.permno,
          vin: vehicle.vin,
          make: vehicle.make,
          color: vehicle.color,
          role: vehicle.role,
          firstRegistrationDate: vehicle.firstRegistrationDate,
          newRegistrationDate: vehicle.newRegistrationDate,
          fuelCode: vehicle.fuelCode,
          vehicleRegistrationCode: vehicle.vehicleRegistrationCode,
          importCode: vehicle.importCode,
          vehicleGrant: vehicle.vehicleGrant,
          vehicleGrantItemCode: vehicle.vehicleGrantItemCode,
          hasReceivedSubsidy: hasReceivedSubsidy,
        }
      }),
    )
  }

  async submitApplication({
    auth,
    application,
  }: TemplateApiModuleActionProps): Promise<void> {
    const applicationAnswers = application.answers as EnergyFundsAnswers
    const currentVehicleList = application.externalData?.currentVehicles
      ?.data as Array<VehiclesCurrentVehicle>
    const currentvehicleDetails = currentVehicleList.find(
      (x) => x.permno === applicationAnswers.selectVehicle.plate,
    )

    const answers = {
      nationalId: auth.nationalId,
      vIN: applicationAnswers?.selectVehicle.vin,
      carNumber: applicationAnswers?.selectVehicle.plate,
      carType: (currentvehicleDetails && currentvehicleDetails.make) || '',
      itemcode:
        (currentvehicleDetails && currentvehicleDetails.vehicleGrantItemCode) ||
        '',
      purchasePrice:
        (applicationAnswers?.vehicleDetails.price &&
          parseInt(applicationAnswers?.vehicleDetails.price)) ||
        0,
      registrationDate: currentvehicleDetails
        ? format(
            new Date(currentvehicleDetails.firstRegistrationDate || ''),
            'yyyy-MM-dd',
          )
        : '',
      subsidyAmount:
        (currentvehicleDetails && currentvehicleDetails.vehicleGrant) || 0,
    }

    await this.energyFundsClientService.submitEnergyFundsApplication(auth, {
      subsidyInput: answers,
    })
  }
}
