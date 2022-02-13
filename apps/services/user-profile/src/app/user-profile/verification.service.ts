import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { EmailVerification } from './emailVerification.model'
import { randomInt, randomBytes } from 'crypto'
import addMilliseconds from 'date-fns/addMilliseconds'
import { ConfirmEmailDto } from './dto/confirmEmailDto'
import { UserProfile } from '../user-profile/userProfile.model'
import { UserProfileService } from '../user-profile/userProfile.service'
import { SmsVerification } from './smsVerification.model'
import { CreateUserProfileDto } from '../user-profile/dto/createUserProfileDto'
import { SmsService } from '@island.is/nova-sms'
import { EmailService } from '@island.is/email-service'
import environment from '../../environments/environment'
import { CreateSmsVerificationDto } from './dto/createSmsVerificationDto'
import { ConfirmSmsDto } from './dto/confirmSmsDto'
import { ConfirmationDtoResponse } from './dto/confirmationResponseDto'

export const SMS_VERIFICATION_MAX_AGE = 5 * 60 * 1000
export const SMS_VERIFICATION_MAX_TRIES = 5

/**
  *- email verification procedure
    *- New user
      *- User confirms before User profile Creation
      *- Create email confirmation
      *- Confirm Directly with emailCode
      *- On profile creation check for confirmation and mark email as verified
    *- Update user
      *- Create email confirmation
      *- Confirm Directly with code
      *- update email check db for confirmation save email as verified


  *- SMS verification procedure
    *- New user
      *- User confirms before User profile Creation
      *- Create sms confirmation
      *- Confirm Directly with smsCode
      *- On profile creation check for confirmation and mark phone as verified
    *- Update user
      *- Create sms confirmation
      *- Confirm Directly with code
      *- update Phonenumber check db for confirmation save phone as verified
 */
@Injectable()
export class VerificationService {
  constructor(
    @InjectModel(EmailVerification)
    private emailVerificationModel: typeof EmailVerification,
    @InjectModel(SmsVerification)
    private smsVerificationModel: typeof SmsVerification,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private readonly userProfileService: UserProfileService,
    private readonly smsService: SmsService,
    @Inject(EmailService)
    private readonly emailService: EmailService,
  ) {}

  async createEmailVerification(
    nationalId: string,
    email: string,
  ): Promise<EmailVerification | null> {
    const emailCode = randomInt(0, 999999).toString().padStart(6, '0')

    const [record] = await this.emailVerificationModel.upsert(
      { nationalId, email, hash: emailCode, created: new Date() },
      {
        returning: true,
      },
    )

    if (record) {
      this.sendConfirmationEmail(record)
    }

    return record
  }

  async createSmsVerification(
    createSmsVerification: CreateSmsVerificationDto,
  ): Promise<SmsVerification | null> {
    const code = randomInt(0, 999999).toString().padStart(6, '0')
    const verification = {
      ...createSmsVerification,
      tries: 0,
      smsCode: code,
      created: new Date(),
    }

    const [record] = await this.smsVerificationModel.upsert(verification, {
      returning: true,
    })
    if (record) {
      this.sendConfirmationSms(record)
    }

    return record
  }

  async confirmEmail(
    confirmEmailDto: ConfirmEmailDto,
    nationalId: string,
  ): Promise<ConfirmationDtoResponse> {
    const verification = await this.emailVerificationModel.findOne({
      where: { nationalId },
    })

    if (!verification) {
      return {
        message: `Email verification does not exist for this user`,
        confirmed: false,
      }
    }

    const expiration = addMilliseconds(
      verification.created,
      SMS_VERIFICATION_MAX_AGE,
    )
    if (expiration < new Date()) {
      return {
        message: 'Email verification is expired',
        confirmed: false,
      }
    }

    if (confirmEmailDto.hash !== verification.hash) {
      // TODO: Add tries?
      return {
        message: `Email verification with hash ${confirmEmailDto.hash} does not exist`,
        confirmed: false,
      }
    }

    await this.emailVerificationModel.update(
      { confirmed: true },
      {
        where: { nationalId },
        returning: true,
      },
    )

    return {
      message: 'Email confirmed',
      confirmed: true,
    }
  }

  async confirmSms(
    confirmSmsDto: ConfirmSmsDto,
    nationalId: string,
  ): Promise<ConfirmationDtoResponse> {
    const verification = await this.smsVerificationModel.findOne({
      where: { nationalId },
    })

    if (!verification) {
      return {
        message: `Sms verification does not exist for this user`,
        confirmed: false,
      }
    }

    const expiration = addMilliseconds(
      verification.created,
      SMS_VERIFICATION_MAX_AGE,
    )
    if (expiration < new Date()) {
      return {
        message: 'SMS verification is expired',
        confirmed: false,
      }
    }

    if (verification.tries >= SMS_VERIFICATION_MAX_TRIES) {
      return {
        message:
          'Too many failed SMS verifications. Please restart verification.',
        confirmed: false,
      }
    }

    if (confirmSmsDto.code !== verification.smsCode) {
      await verification.increment({ tries: 1 })
      const remaining = SMS_VERIFICATION_MAX_TRIES - verification.tries
      return {
        message: `SMS code is not a match. ${remaining} tries remaining.`,
        confirmed: false,
      }
    }

    await this.smsVerificationModel.update(
      { confirmed: true },
      {
        where: { nationalId },
        returning: true,
      },
    )
    return {
      message: 'SMS confirmed',
      confirmed: true,
    }
  }

  async sendConfirmationEmail(verification: EmailVerification) {
    try {
      await this.emailService.sendEmail({
        from: {
          name: environment.email.fromName,
          address: environment.email.fromEmail,
        },
        to: [
          {
            name: '',
            address: verification.email,
          },
        ],
        subject: `Staðfesting netfangs á Ísland.is`,
        html: `Þú hefur skráð netfangið þitt á Mínum síðum á Ísland.is. Vinsamlegast staðfestu
        skráninguna með því að afrita kóðann hér að neðan yfir á skráningarsíðuna:
        <br /><br /><span
          style="font-size: 18px; padding: 3px; border-style: 1px solid #D1D1D1"
          >${verification.hash}</span
        ><br />
        <br />Ef kóðinn er ekki lengur í gildi biðjum við þig að endurtaka
        skráninguna á Ísland.is. <br /><br />Ef þú kannast ekki við að hafa sett inn
        þetta netfang, vinsamlegast hunsaðu þennan póst.`,
      })
    } catch (exception) {
      this.logger.error(exception)
    }
  }

  async sendConfirmationSms(verification: SmsVerification) {
    try {
      const response = await this.smsService.sendSms(
        verification.mobilePhoneNumber,
        `Staðfestingarkóði fyrir Mínar síður : ${verification.smsCode}`,
      )
      return response
    } catch (exception) {
      this.logger.error(exception)
    }
  }

  async removeSmsVerification(nationalId: string) {
    await this.smsVerificationModel.destroy({
      where: { nationalId },
    })
  }

  async removeEmailVerification(nationalId: string) {
    await this.emailVerificationModel.destroy({
      where: { nationalId },
    })
  }

  async isPhoneNumberVerified(
    createUserProfileDto: CreateUserProfileDto,
  ): Promise<boolean> {
    const { nationalId, mobilePhoneNumber } = createUserProfileDto
    const verification = await this.smsVerificationModel.findOne({
      where: { nationalId },
    })
    if (!verification) return false
    return (
      verification.confirmed &&
      verification.mobilePhoneNumber === mobilePhoneNumber
    )
  }

  async isEmailVerified(
    createUserProfileDto: CreateUserProfileDto,
  ): Promise<boolean> {
    const { nationalId, email } = createUserProfileDto
    const verification = await this.emailVerificationModel.findOne({
      where: { nationalId },
    })
    if (!verification) return false
    return verification.confirmed && verification.email === email
  }
}
