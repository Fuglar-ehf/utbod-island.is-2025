import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { DriverCardsApiApi, IndividualApiApi } from '../../gen/fetch/apis'
import {
  DeliveryMethodEnum,
  IsActiveEnum,
  IsValidEnum,
} from '../../gen/fetch/models'
import {
  DriversCardApplicationRequest,
  NewestDriversCard,
  IndividualPhotoAndSignature,
  TachoNetCheckRequest,
} from './digitalTachographDriversCardClient.types'

@Injectable()
export class DigitalTachographDriversCardClient {
  constructor(
    private readonly driversCardApi: DriverCardsApiApi,
    private readonly individualApi: IndividualApiApi,
  ) {}

  private driversCardApiWithAuth(auth: Auth) {
    return this.driversCardApi.withMiddleware(new AuthMiddleware(auth))
  }

  private individualApiWithAuth(auth: Auth) {
    return this.individualApi.withMiddleware(new AuthMiddleware(auth))
  }

  public async checkIfHasActiveCardInTachoNet(
    auth: User,
    request: TachoNetCheckRequest,
  ): Promise<boolean> {
    try {
      // Note: Default value must be null (not undefined or ''), if not supplied
      const defaultValue = null

      const result = await this.driversCardApiWithAuth(
        auth,
      ).v1DrivercardsTachonetcheckPost({
        tachonetCheckRequest: {
          firstName: request.firstName || defaultValue,
          lastName: request.lastName,
          birthDate: request.birthDate,
          birthPlace: request.birthPlace || defaultValue,
          drivingLicenceNumber: request.drivingLicenceNumber || defaultValue,
          drivingLicenceIssuingCountry:
            request.drivingLicenceIssuingCountry || defaultValue,
        },
      })

      return !!result.cards?.find((x) => x.isActive === IsActiveEnum.Yes)
    } catch (e) {
      if (e.status === 404) {
        return false
      }
      throw e
    }
  }

  public async getNewestDriversCard(
    auth: User,
  ): Promise<NewestDriversCard | null> {
    try {
      const result = await this.driversCardApiWithAuth(
        auth,
      ).v1DrivercardsPersidnoNewestGet({
        persidno: auth.nationalId,
      })

      return {
        ssn: result?.personIdNumber || undefined,
        applicationCreatedAt: result?.datetimeOfApplication || undefined,
        cardNumber: result?.cardNumber || undefined,
        cardValidFrom: result?.cardValidFromDatetime || undefined,
        cardValidTo: result?.cardValidToDatetime || undefined,
        isValid: result?.isValid === IsValidEnum.Yes,
      }
    } catch (e) {
      if (e.status === 404) {
        return null
      }
      throw e
    }
  }

  public async saveDriversCard(
    auth: User,
    request: DriversCardApplicationRequest,
  ): Promise<void> {
    const result = await this.driversCardApiWithAuth(auth).v1DrivercardsPost({
      driverCardApplicationRequest: {
        personIdNumber: request.ssn,
        fullName: request.fullName,
        address: request.address,
        postalCode: request.postalCode,
        place: request.place,
        birthCountry: request.birthCountry,
        birthPlace: request.birthPlace,
        emailAddress: request.emailAddress,
        phoneNumber: request.phoneNumber,
        deliveryMethod: request.deliveryMethodIsSend
          ? DeliveryMethodEnum.Send
          : DeliveryMethodEnum.PickUp,
        paymentDatetime: request.paymentReceivedAt,
        photo: request.photo,
        signature: request.signature,
      },
    })
  }

  public async getPhotoAndSignature(
    auth: User,
  ): Promise<IndividualPhotoAndSignature> {
    const result = await this.individualApiWithAuth(
      auth,
    ).v1IndividualPersidnoPhotoandsignatureGet({
      persidno: auth.nationalId,
    })

    return {
      ssn: result.personIdNumber,
      photo: result.photo,
      signature: result.signature,
    }
  }
}
