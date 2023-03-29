import { Inject, Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import {
  applicationCheck,
  ChangeCoOwnerOfVehicleAnswers,
  getChargeItemCodes,
} from '@island.is/application/templates/transport-authority/change-co-owner-of-vehicle'
import {
  OwnerChangeValidation,
  VehicleOwnerChangeClient,
} from '@island.is/clients/transport-authority/vehicle-owner-change'
import { VehicleOperatorsClient } from '@island.is/clients/transport-authority/vehicle-operators'
import {
  VehicleDebtStatus,
  VehicleServiceFjsV1Client,
} from '@island.is/clients/vehicle-service-fjs-v1'
import { VehicleSearchApi } from '@island.is/clients/vehicles'
import { EmailRecipient, EmailRole } from './types'
import {
  getAllRoles,
  getRecipients,
  getRecipientBySsn,
} from './change-co-owner-of-vehicle.utils'
import {
  ChargeFjsV2ClientService,
  getChargeId,
} from '@island.is/clients/charge-fjs-v2'
import { TemplateApiError } from '@island.is/nest/problem'
import {
  generateRequestReviewEmail,
  generateApplicationSubmittedEmail,
  generateApplicationRejectedEmail,
} from './emailGenerators'
import {
  generateRequestReviewSms,
  generateApplicationSubmittedSms,
  generateApplicationRejectedSms,
} from './smsGenerators'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'

@Injectable()
export class ChangeCoOwnerOfVehicleService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly vehicleOwnerChangeClient: VehicleOwnerChangeClient,
    private readonly vehicleOperatorsClient: VehicleOperatorsClient,
    private readonly chargeFjsV2ClientService: ChargeFjsV2ClientService,
    private readonly vehicleServiceFjsV1Client: VehicleServiceFjsV1Client,
    private readonly vehiclesApi: VehicleSearchApi,
  ) {
    super(ApplicationTypes.CHANGE_CO_OWNER_OF_VEHICLE)
  }

  private vehiclesApiWithAuth(auth: Auth) {
    return this.vehiclesApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getCurrentVehiclesWithOwnerchangeChecks({
    auth,
  }: TemplateApiModuleActionProps) {
    const result = await this.vehiclesApiWithAuth(auth).currentVehiclesGet({
      persidNo: auth.nationalId,
      showOwned: true,
      showCoowned: false,
      showOperated: false,
    })

    return await Promise.all(
      result?.map(async (vehicle) => {
        let validation: OwnerChangeValidation | undefined
        let debtStatus: VehicleDebtStatus | undefined

        // Only validate if fewer than 5 items
        if (result.length <= 5) {
          // Get debt status
          debtStatus = await this.vehicleServiceFjsV1Client.getVehicleDebtStatus(
            auth,
            vehicle.permno || '',
          )

          // Get validation
          validation = await this.vehicleOwnerChangeClient.validateVehicleForOwnerChange(
            auth,
            vehicle.permno || '',
          )
        }

        return {
          permno: vehicle.permno || undefined,
          make: vehicle.make || undefined,
          color: vehicle.color || undefined,
          role: vehicle.role || undefined,
          isDebtLess: debtStatus?.isDebtLess,
          validationErrorMessages: validation?.hasError
            ? validation.errorMessages
            : null,
        }
      }),
    )
  }

  async validateApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    const answers = application.answers as ChangeCoOwnerOfVehicleAnswers

    const permno = answers?.pickVehicle?.plate
    const ownerSsn = answers?.owner?.nationalId
    const ownerEmail = answers?.owner?.email

    const createdStr = application.created.toISOString()

    const currentOperators = await this.vehicleOperatorsClient.getOperators(
      auth,
      permno,
    )

    const currentOwnerChange = await this.vehicleOwnerChangeClient.getNewestOwnerChange(
      auth,
      permno,
    )

    const filteredOldCoOwners = answers?.ownerCoOwners?.filter(
      ({ wasRemoved }) => wasRemoved !== 'true',
    )
    const filteredNewCoOwners = answers?.coOwners?.filter(
      ({ wasRemoved }) => wasRemoved !== 'true',
    )
    const filteredCoOwners = [
      ...(filteredOldCoOwners ? filteredOldCoOwners : []),
      ...(filteredNewCoOwners ? filteredNewCoOwners : []),
    ]

    const result = await this.vehicleOwnerChangeClient.validateAllForOwnerChange(
      auth,
      {
        permno: permno,
        seller: {
          ssn: ownerSsn,
          email: ownerEmail,
        },
        buyer: {
          ssn: ownerSsn,
          email: ownerEmail,
        },
        dateOfPurchase: new Date(application.created),
        dateOfPurchaseTimestamp: createdStr.substring(11, createdStr.length),
        saleAmount: currentOwnerChange?.saleAmount,
        insuranceCompanyCode: currentOwnerChange?.insuranceCompanyCode,
        operators: currentOperators?.map((operator) => ({
          ssn: operator.ssn || '',
          // Note: It should be ok that the email we send in is empty, since we dont get
          // the email when fetching current operators, and according to them (SGS), they
          // are not using the operator email in their API (not being saved in their DB)
          email: null,
          isMainOperator: operator.isMainOperator || false,
        })),
        coOwners: filteredCoOwners.map((x) => ({
          ssn: x.nationalId,
          email: x.email,
        })),
      },
    )

    // If we get any error messages, we will just throw an error with a default title
    // We will fetch these error messages again through graphql in the template, to be able
    // to translate the error message
    if (result.hasError && result.errorMessages?.length) {
      throw new TemplateApiError(
        {
          title: applicationCheck.validation.alertTitle,
          summary: applicationCheck.validation.alertTitle,
        },
        400,
      )
    }
  }

  async createCharge({ application, auth }: TemplateApiModuleActionProps) {
    try {
      const SAMGONGUSTOFA_NATIONAL_ID = '5405131040'

      const answers = application.answers as ChangeCoOwnerOfVehicleAnswers

      const chargeItemCodes = getChargeItemCodes(answers)

      if (chargeItemCodes?.length <= 0) {
        throw new Error('Það var hvorki bætt við né eytt meðeiganda')
      }

      const result = this.sharedTemplateAPIService.createCharge(
        auth,
        application.id,
        SAMGONGUSTOFA_NATIONAL_ID,
        chargeItemCodes,
        [{ name: 'vehicle', value: answers?.pickVehicle?.plate }],
      )
      return result
    } catch (exeption) {
      return { id: '', paymentUrl: '' }
    }
  }

  // Notify everyone that has been added to the application that they need to review
  async initReview({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<Array<EmailRecipient>> {
    // 1. Validate payment

    // 1a. Make sure a paymentUrl was created
    const { paymentUrl } = application.externalData.createCharge.data as {
      paymentUrl: string
    }
    if (!paymentUrl) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    // 1b. Make sure payment is fulfilled (has been paid)
    const payment:
      | { fulfilled: boolean }
      | undefined = await this.sharedTemplateAPIService.getPaymentStatus(
      auth,
      application.id,
    )
    if (!payment?.fulfilled) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    // 2. Notify users that need to review

    // 2a. Get list of users that need to review
    const answers = application.answers as ChangeCoOwnerOfVehicleAnswers
    const recipientList = getRecipients(answers, [
      EmailRole.currentCoOwner,
      EmailRole.addedCoOwner,
    ])

    // 2b. Send email/sms individually to each recipient
    for (let i = 0; i < recipientList.length; i++) {
      if (recipientList[i].email) {
        await this.sharedTemplateAPIService
          .sendEmail(
            (props) => generateRequestReviewEmail(props, recipientList[i]),
            application,
          )
          .catch(() => {
            this.logger.error(
              `Error sending email about initReview to ${recipientList[i].email}`,
            )
          })
      }

      if (recipientList[i].phone) {
        await this.sharedTemplateAPIService
          .sendSms(
            (_, options) =>
              generateRequestReviewSms(application, options, recipientList[i]),
            application,
          )
          .catch(() => {
            this.logger.error(
              `Error sending sms about initReview to ${recipientList[i].phone}`,
            )
          })
      }
    }

    return recipientList
  }

  async rejectApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    // 1. Delete charge so that the seller gets reimburshed
    const chargeId = getChargeId(application)
    if (chargeId) {
      const status = await this.chargeFjsV2ClientService.getChargeStatus(
        chargeId,
      )

      // Make sure charge has not been deleted yet (will otherwise end in error here and wont continue)
      if (status !== 'cancelled') {
        await this.chargeFjsV2ClientService.deleteCharge(chargeId)
      }
    }

    // 2. Notify everyone in the process that the application has been withdrawn

    // 2a. Get list of users that need to be notified
    const answers = application.answers as ChangeCoOwnerOfVehicleAnswers
    const recipientList = getRecipients(answers, getAllRoles())

    // 2b. Send email/sms individually to each recipient about success of withdrawing application
    const rejectedByRecipient = getRecipientBySsn(answers, auth.nationalId)
    for (let i = 0; i < recipientList.length; i++) {
      if (recipientList[i].email) {
        await this.sharedTemplateAPIService
          .sendEmail(
            (props) =>
              generateApplicationRejectedEmail(
                props,
                recipientList[i],
                rejectedByRecipient,
              ),
            application,
          )
          .catch(() => {
            this.logger.error(
              `Error sending email about rejectApplication to ${recipientList[i].email}`,
            )
          })
      }

      if (recipientList[i].phone) {
        await this.sharedTemplateAPIService
          .sendSms(
            () =>
              generateApplicationRejectedSms(
                application,
                recipientList[i],
                rejectedByRecipient,
              ),
            application,
          )
          .catch(() => {
            this.logger.error(
              `Error sending sms about rejectApplication to ${recipientList[i].phone}`,
            )
          })
      }
    }
  }

  // After everyone has reviewed (and approved), then submit the application, and notify everyone involved it was a success
  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    // 1. Validate payment

    // 1a. Make sure a paymentUrl was created
    const { paymentUrl } = application.externalData.createCharge.data as {
      paymentUrl: string
    }
    if (!paymentUrl) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    // 1b. Make sure payment is fulfilled (has been paid)
    const isPayment:
      | { fulfilled: boolean }
      | undefined = await this.sharedTemplateAPIService.getPaymentStatus(
      auth,
      application.id,
    )

    if (!isPayment?.fulfilled) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    // 2. Submit the application

    const answers = application.answers as ChangeCoOwnerOfVehicleAnswers
    const createdStr = application.created.toISOString()

    // Note: Need to be sure that the user that created the application is the seller when submitting application to SGS
    if (answers?.owner?.nationalId !== application.applicant) {
      throw new TemplateApiError(
        {
          title: applicationCheck.submitApplication.sellerNotValid,
          summary: applicationCheck.submitApplication.sellerNotValid,
        },
        400,
      )
    }

    const permno = answers?.pickVehicle?.plate
    const ownerSsn = answers?.owner?.nationalId
    const ownerEmail = answers?.owner?.email

    const filteredOldCoOwners = answers?.ownerCoOwners?.filter(
      ({ wasRemoved }) => wasRemoved !== 'true',
    )
    const filteredNewCoOwners = answers?.coOwners?.filter(
      ({ wasRemoved }) => wasRemoved !== 'true',
    )
    const filteredCoOwners = [
      ...(filteredOldCoOwners ? filteredOldCoOwners : []),
      ...(filteredNewCoOwners ? filteredNewCoOwners : []),
    ]

    const currentOwnerChange = await this.vehicleOwnerChangeClient.getNewestOwnerChange(
      auth,
      permno,
    )

    const currentOperators = await this.vehicleOperatorsClient.getOperators(
      auth,
      permno,
    )

    await this.vehicleOwnerChangeClient.saveOwnerChange(auth, {
      permno: permno,
      seller: {
        ssn: ownerSsn,
        email: ownerEmail,
      },
      buyer: {
        ssn: ownerSsn,
        email: ownerEmail,
      },
      dateOfPurchase: new Date(application.created),
      dateOfPurchaseTimestamp: createdStr.substring(11, createdStr.length),
      saleAmount: currentOwnerChange?.saleAmount,
      insuranceCompanyCode: currentOwnerChange?.insuranceCompanyCode,
      operators: currentOperators?.map((operator) => ({
        ssn: operator.ssn || '',
        // Note: It should be ok that the email we send in is empty, since we dont get
        // the email when fetching current operators, and according to them (SGS), they
        // are not using the operator email in their API (not being saved in their DB)
        email: null,
        isMainOperator: operator.isMainOperator || false,
      })),
      coOwners: filteredCoOwners.map((x) => ({
        ssn: x.nationalId,
        email: x.email,
      })),
    })

    // 3. Notify everyone in the process that the application has successfully been submitted

    // 3a. Get list of users that need to be notified
    const recipientList = getRecipients(answers, getAllRoles())

    // 3b. Send email/sms individually to each recipient about success of submitting application
    for (let i = 0; i < recipientList.length; i++) {
      if (recipientList[i].email) {
        await this.sharedTemplateAPIService
          .sendEmail(
            (props) =>
              generateApplicationSubmittedEmail(props, recipientList[i]),
            application,
          )
          .catch(() => {
            this.logger.error(
              `Error sending email about submitApplication to ${recipientList[i].email}`,
            )
          })
      }

      if (recipientList[i].phone) {
        await this.sharedTemplateAPIService
          .sendSms(
            () =>
              generateApplicationSubmittedSms(application, recipientList[i]),
            application,
          )
          .catch(() => {
            this.logger.error(
              `Error sending sms about submitApplication to ${recipientList[i].phone}`,
            )
          })
      }
    }
  }
}
