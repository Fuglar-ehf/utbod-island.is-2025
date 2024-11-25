import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { OperatorApi } from '../../gen/fetch/apis'
import {
  Operator,
  OperatorChangeValidation,
} from './vehicleOperatorsClient.types'
import {
  getCleanMessagesFromRequestResult,
  getCleanMessagesFromTryCatch,
  ValidationMessage,
} from '@island.is/clients/transport-authority/vehicle-owner-change'
import { MileageReadingApi } from '@island.is/clients/vehicles-mileage'
import { logger } from '@island.is/logging'
import { ReturnTypeMessage } from '../../gen/fetch'

@Injectable()
export class VehicleOperatorsClient {
  constructor(
    private readonly operatorsApi: OperatorApi,
    private readonly mileageReadingApi: MileageReadingApi,
  ) {}

  private operatorsApiWithAuth(auth: Auth) {
    return this.operatorsApi.withMiddleware(new AuthMiddleware(auth))
  }

  private mileageReadingApiWithAuth(auth: Auth) {
    return this.mileageReadingApi.withMiddleware(new AuthMiddleware(auth))
  }

  public async getOperators(auth: User, permno: string): Promise<Operator[]> {
    const result = await this.operatorsApiWithAuth(auth).permnoGet({
      apiVersion: '3.0',
      apiVersion2: '3.0',
      permno: permno,
    })

    return result.map((item) => ({
      startDate: item.startDate,
      endDate: item.endDate,
      ssn: item.persidno,
      name: item.name,
      isMainOperator: item.mainOperator,
      operatorSerialNumber: item.operatorSerialNumber,
    }))
  }

  public async validateVehicleForOperatorChange(
    auth: User,
    permno: string,
  ): Promise<OperatorChangeValidation> {
    // Get current mileage reading
    let currentMileage = 0
    try {
      const mileageReadings = await this.mileageReadingApiWithAuth(
        auth,
      ).getMileageReading({ permno })
      currentMileage = mileageReadings?.[0]?.mileage || 0
    } catch (e) {
      logger.error(e)
      return {
        hasError: true,
        errorMessages: [{ defaultMessage: e.message }],
      }
    }

    return await this.validateAllForOperatorChange(
      auth,
      permno,
      null,
      currentMileage + 1,
    )
  }

  public async validateAllForOperatorChange(
    auth: User,
    permno: string,
    operators: Operator[] | null,
    mileage: number | null,
  ): Promise<OperatorChangeValidation> {
    let result: ReturnTypeMessage[] | undefined
    let errorMessages: ValidationMessage[] | undefined
    let infoMessages: ValidationMessage[] | undefined

    // In case we dont have the operators selected yet,
    // then we will send in the owner as operator
    // Note: it is not possible to validate application if operators array is empty
    // (even though that is what we might want to do)
    if (!operators || operators.length === 0) {
      operators = [{ ssn: auth.nationalId, isMainOperator: true }]
    }

    try {
      result = await this.operatorsApiWithAuth(auth).withoutcontractPost({
        apiVersion: '3.0',
        apiVersion2: '3.0',
        postOperatorsWithoutContractModel: {
          permno: permno,
          startDate: new Date(),
          reportingPersonIdNumber: auth.nationalId,
          mileage: mileage,
          operators: operators.map((operator) => ({
            personIdNumber: operator.ssn || '',
            mainOperator: operator.isMainOperator ? 1 : 0,
          })),
          onlyRunFlexibleWarning: true, // to make sure we are only validating
        },
      })
    } catch (e) {
      // Note: We had to wrap in try-catch to get the error messages, because if this action results in error,
      // we get 4xx error (instead of 200 with error messages) with the error messages in the body
      errorMessages = getCleanMessagesFromTryCatch(e, 'ERROR')
      infoMessages = getCleanMessagesFromTryCatch(e, 'INFO')
    }

    if (result) {
      infoMessages = getCleanMessagesFromRequestResult(result, 'INFO')
    }

    return {
      hasError: !!errorMessages?.length,
      errorMessages,
      infoMessages,
    }
  }

  // Note: When calling this endpoint we should make sure that the person that
  // created the application (and chose the new operators), is the current owner
  // of the vehicle (since the API does not do any such validation)
  public async saveOperators(
    auth: User,
    permno: string,
    operators: Operator[],
    mileage?: number | null,
  ): Promise<OperatorChangeValidation> {
    let result: ReturnTypeMessage[] | undefined
    let errorMessages: ValidationMessage[] | undefined
    let infoMessages: ValidationMessage[] | undefined

    if (operators.length === 0) {
      try {
        //TODOx 204 er void - tala við SGS
        result = await this.operatorsApiWithAuth(auth).closeWithoutcontractPost(
          {
            apiVersion: '3.0',
            apiVersion2: '3.0',
            postCloseOperatorsWithoutContractModel: {
              permno: permno,
              endDate: new Date(),
              reportingPersonIdNumber: auth.nationalId,
            },
          },
        )
      } catch (e) {
        errorMessages = getCleanMessagesFromTryCatch(e, 'ERROR')
        infoMessages = getCleanMessagesFromTryCatch(e, 'INFO')
      }
    } else {
      try {
        result = await this.operatorsApiWithAuth(auth).withoutcontractPost({
          apiVersion: '3.0',
          apiVersion2: '3.0',
          postOperatorsWithoutContractModel: {
            permno: permno,
            startDate: new Date(),
            reportingPersonIdNumber: auth.nationalId,
            onlyRunFlexibleWarning: false,
            mileage: mileage,
            operators: operators.map((operator) => ({
              personIdNumber: operator.ssn || '',
              mainOperator: operator.isMainOperator ? 1 : 0,
            })),
          },
        })
      } catch (e) {
        errorMessages = getCleanMessagesFromTryCatch(e, 'ERROR')
        infoMessages = getCleanMessagesFromTryCatch(e, 'INFO')
      }
    }

    if (result) {
      infoMessages = getCleanMessagesFromRequestResult(result, 'INFO')
    }

    return {
      hasError: !!errorMessages?.length,
      errorMessages,
      infoMessages,
    }
  }
}
