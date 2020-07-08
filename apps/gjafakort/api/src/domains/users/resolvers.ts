import { logger } from '@island.is/logging'
import { UserInputError, ApolloError } from 'apollo-server-express'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

import { ConfirmCodeError } from './errors'
import { authorize } from '../auth'
import * as userService from './service'
import {
  CreateUserApplicationInput,
  ConfirmMobileInput,
  VerifyUserApplicationInput,
} from '../../types'

const validateMobile = (mobile: string) => {
  const ICELAND_COUNTRY_CODE = 'IS'
  if (!mobile) {
    throw new UserInputError('Mobile number is required')
  }
  const phone = parsePhoneNumberFromString(mobile, ICELAND_COUNTRY_CODE)
  if (!phone.isValid()) {
    throw new UserInputError('Mobile number is invalid')
  }
  if (phone.country !== ICELAND_COUNTRY_CODE) {
    throw new UserInputError('Icelandic mobile number is required')
  }
  return {
    mobileNumber: phone.nationalNumber.toString(),
    countryCode: phone.countryCallingCode.toString(),
  }
}

class UserResolver {
  @authorize()
  public async getUserApplication(
    _1,
    _2,
    { user, dataSources: { applicationApi } },
  ) {
    let application = await userService.getApplication(user.ssn, applicationApi)
    if (!application) {
      return null
    }
    if (!application.data.verified && user.mobile) {
      const { mobileNumber, countryCode } = validateMobile(user.mobile)
      if (
        mobileNumber === application.data.mobileNumber &&
        countryCode === application.data.countryCode
      ) {
        const verified = true
        application = await userService.updateApplication(
          application.id,
          user.ssn,
          verified,
          applicationApi,
        )
      }
    }
    return {
      id: application.id,
      mobileNumber: application.data.mobileNumber,
      countryCode: application.data.countryCode,
      verified: application.data.verified,
    }
  }

  @authorize({ role: 'developer' })
  public async fetchGetUserApplication(
    _1,
    { ssn },
    { dataSources: { applicationApi } },
  ) {
    const application = await userService.getApplication(ssn, applicationApi)
    if (!application) {
      return null
    }

    return {
      id: application.id,
      mobileNumber: application.data.mobileNumber,
      countryCode: application.data.countryCode,
      verified: application.data.verified,
      logs: application.AuditLogs?.map((auditLog) => ({
        id: auditLog.id,
        created: auditLog.created,
        state: auditLog.state,
        title: auditLog.title,
        data: JSON.stringify(auditLog.data),
        authorSSN: auditLog.authorSSN,
      })),
    }
  }

  @authorize({ role: 'developer' })
  public getUserApplicationCount(_1, _2, { dataSources: { applicationApi } }) {
    return userService.getApplicationCount(applicationApi)
  }

  @authorize()
  public async createUserApplication(
    _1,
    { input }: { input: CreateUserApplicationInput },
    { user, dataSources: { applicationApi } },
  ) {
    const mobile = user.mobile || input.mobile
    const { mobileNumber, countryCode } = validateMobile(mobile)
    if (!user.mobile) {
      const match = await userService.verifyConfirmCode(
        user.ssn,
        mobileNumber,
        input.confirmCode,
      )
      if (match !== true) {
        throw new ConfirmCodeError()
      }
    }

    const application = await userService.createApplication(
      user.ssn,
      mobileNumber,
      countryCode,
      applicationApi,
    )

    return {
      application: {
        id: application.id,
        mobileNumber: application.data.mobileNumber,
        countryCode: application.data.countryCode,
        verified: application.data.verified,
      },
    }
  }

  @authorize()
  public async verifyUserApplication(
    _1,
    { input }: { input: VerifyUserApplicationInput },
    { user, dataSources: { applicationApi } },
  ) {
    const { mobileNumber } = validateMobile(input.mobile)
    const match = await userService.verifyConfirmCode(
      user.ssn,
      mobileNumber,
      input.confirmCode,
    )
    if (match !== true) {
      throw new ConfirmCodeError()
    }

    let application = await userService.getApplication(user.ssn, applicationApi)
    if (!application) {
      return null
    }

    const verified = true
    application = await userService.updateApplication(
      application.id,
      user.ssn,
      verified,
      applicationApi,
    )

    return {
      application: {
        id: application.id,
        mobileNumber: application.data.mobileNumber,
        countryCode: application.data.countryCode,
        verified: application.data.verified,
      },
    }
  }

  @authorize()
  public async getGiftCards(
    _1,
    _2,
    { user, dataSources: { applicationApi, yayApi } },
  ) {
    const application = await userService.getApplication(
      user.ssn,
      applicationApi,
    )
    if (!application) {
      return []
    }
    const {
      data: { mobileNumber, countryCode },
    } = application
    let giftCards = await yayApi.getGiftCards(mobileNumber, countryCode)
    if (!application.data.verified) {
      giftCards = giftCards.filter(
        (giftCard) => giftCard.identifier === application.id,
      )
    }
    return giftCards.map(({ identifier, ...giftCard }) => ({
      ...giftCard,
      applicationId: identifier,
    }))
  }

  @authorize()
  public async getGiftCardCode(
    _1,
    args,
    { user, dataSources: { applicationApi, yayApi } },
  ) {
    const application = await userService.getApplication(
      user.ssn,
      applicationApi,
    )
    if (!application) {
      return null
    }

    const {
      data: { mobileNumber, countryCode },
    } = application
    const giftCardCode = await yayApi.getGiftCardCode(
      args.giftCardId,
      mobileNumber,
      countryCode,
    )

    return {
      code: giftCardCode.code,
      expiryDate: giftCardCode.expiryDate,
      pollingUrl: giftCardCode.pollingUrl,
    }
  }

  @authorize()
  public async giveGift(
    _1,
    { input: { giftCardId, recipientMobileNumber, message } },
    { user, dataSources: { applicationApi, yayApi } },
  ) {
    const application = await userService.getApplication(
      user.ssn,
      applicationApi,
    )
    if (!application) {
      throw new ApolloError('No application found')
    } else if (!application.data.verified) {
      throw new ApolloError('Phone number not verified')
    }

    const {
      data: { mobileNumber, countryCode },
    } = application
    try {
      await yayApi.giveGift({
        mobileNumber,
        countryCode,
        giftCardId,
        fromName: user.name,
        giftToMobileNumber: recipientMobileNumber,
        giftToCountryCode: countryCode,
        personalMessage: message,
      })

      return { success: true }
    } catch (err) {
      logger.error(err)
      throw new ApolloError('Could not give gift')
    }
  }

  @authorize()
  public async confirmMobile(
    _1,
    { input }: { input: ConfirmMobileInput },
    { user, dataSources: { novaApi } },
  ) {
    const { mobileNumber } = validateMobile(input.mobile)
    await userService.sendConfirmCode(user.ssn, mobileNumber, novaApi)

    return {
      success: true,
      mobile: mobileNumber,
    }
  }
}

const resolver = new UserResolver()
export default {
  Query: {
    giftCardCode: resolver.getGiftCardCode,
    giftCards: resolver.getGiftCards,
    userApplication: resolver.getUserApplication,
    userApplicationCount: resolver.getUserApplicationCount,
  },
  Mutation: {
    fetchUserApplication: resolver.fetchGetUserApplication,
    createUserApplication: resolver.createUserApplication,
    giveGift: resolver.giveGift,
    verifyUserApplication: resolver.verifyUserApplication,
    confirmMobile: resolver.confirmMobile,
  },
}
