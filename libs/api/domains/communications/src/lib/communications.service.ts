import { Inject, Injectable } from '@nestjs/common'
import { ValidationFailed } from '@island.is/nest/problem'
import { EmailService } from '@island.is/email-service'
import { ZendeskService } from '@island.is/clients/zendesk'
import { ContentfulRepository, localeMap } from '@island.is/cms'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ContactUsInput } from './dto/contactUs.input'
import { TellUsAStoryInput } from './dto/tellUsAStory.input'
import {
  ServiceWebFormsInput,
  ServiceWebFormsInputWithInstitutionEmail,
} from './dto/serviceWebForms.input'
import { getTemplate as getContactUsTemplate } from './emailTemplates/contactUs'
import { getTemplate as getTellUsAStoryTemplate } from './emailTemplates/tellUsAStory'
import { getTemplate as getServiceWebFormsTemplate } from './emailTemplates/serviceWebForms'

type SendEmailInput =
  | ContactUsInput
  | TellUsAStoryInput
  | ServiceWebFormsInputWithInstitutionEmail

@Injectable()
export class CommunicationsService {
  constructor(
    private readonly emailService: EmailService,
    private readonly zendeskService: ZendeskService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}
  emailTypeTemplateMap = {
    contactUs: getContactUsTemplate,
    tellUsAStory: getTellUsAStoryTemplate,
    serviceWebForms: getServiceWebFormsTemplate,
  }

  getEmailTemplate(input: SendEmailInput) {
    if (this.emailTypeTemplateMap[input.type]) {
      return this.emailTypeTemplateMap[input.type](input as never)
    } else {
      throw new Error('Message type is not supported')
    }
  }

  async getInputWithInstitutionEmail(
    input: ServiceWebFormsInput,
  ): Promise<ServiceWebFormsInputWithInstitutionEmail> {
    const institutionSlug = input.institutionSlug

    const contentfulRespository = new ContentfulRepository()

    const result = await contentfulRespository.getLocalizedEntries(
      localeMap['is'],
      {
        ['content_type']: 'organization',
        'fields.slug': institutionSlug,
      },
    )

    const errors: Record<string, string> = {}

    const item = result?.items?.[0]

    if (!item) {
      errors[
        'institutionSlug'
      ] = `Unexpected institution slug "${institutionSlug}"`
    }

    const institutionEmail = (item?.fields as { email?: string })?.email

    if (!institutionEmail) {
      errors['institutionEmail'] = 'Institution email not found'
    }

    if (Object.keys(errors).length) {
      throw new ValidationFailed(errors)
    }

    return {
      ...input,
      institutionEmail: institutionEmail!,
    }
  }

  async sendEmail(input: SendEmailInput): Promise<boolean> {
    this.logger.info('Sending email', { type: input.type })
    try {
      const emailOptions = this.getEmailTemplate(input)
      await this.emailService.sendEmail(emailOptions)
      return true
    } catch (error) {
      this.logger.error('Failed to send email', { message: error.message })
      // we dont want the client to see these errors since they might contain sensitive data
      throw new Error('Failed to send message')
    }
  }

  async sendZendeskTicket(input: ContactUsInput): Promise<boolean> {
    const name = input.name.trim()
    const email = input.email.trim().toLowerCase()
    const subject = input.subject
    const message = input.message
    const phone = input.phone

    let user = await this.zendeskService.getUserByEmail(email)

    if (!user) {
      user = await this.zendeskService.createUser(name, email, phone)
    }

    await this.zendeskService.submitTicket({
      message,
      requesterId: user.id,
      subject,
      tags: ['web'],
    })

    return true
  }
}
