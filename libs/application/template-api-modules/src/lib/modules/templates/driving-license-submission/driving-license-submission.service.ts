import { Inject, Injectable } from '@nestjs/common'
import {
  DrivingLicenseService,
  NewDrivingLicenseResult,
} from '@island.is/api/domains/driving-license'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { coreErrorMessages, getValueViaPath } from '@island.is/application/core'
import {
  ApplicationTypes,
  FormValue,
  InstitutionNationalIds,
} from '@island.is/application/types'
import {
  generateDrivingLicenseSubmittedEmail,
  generateDrivingAssessmentApprovalEmail,
} from './emailGenerators'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { FetchError } from '@island.is/clients/middlewares'
import { TemplateApiError } from '@island.is/nest/problem'

const calculateNeedsHealthCert = (healthDeclaration = {}) => {
  return !!Object.values(healthDeclaration).find((val) => val === 'yes')
}

@Injectable()
export class DrivingLicenseSubmissionService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly drivingLicenseService: DrivingLicenseService,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {
    super(ApplicationTypes.DRIVING_LICENSE)
  }

  async createCharge({
    application: { id, answers },
    auth,
  }: TemplateApiModuleActionProps) {
    const applicationFor = getValueViaPath<'B-full' | 'B-temp'>(
      answers,
      'applicationFor',
      'B-full',
    )

    const chargeItemCode = applicationFor === 'B-full' ? 'AY110' : 'AY114'

    const response = await this.sharedTemplateAPIService.createCharge(
      auth,
      id,
      InstitutionNationalIds.SYSLUMENN,
      [chargeItemCode],
    )

    // last chance to validate before the user receives a dummy
    if (!response?.paymentUrl) {
      throw new Error('paymentUrl missing in response')
    }

    return response
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<{ success: boolean }> {
    const { answers } = application
    const nationalId = application.applicant

    const isPayment = await this.sharedTemplateAPIService.getPaymentStatus(
      auth,
      application.id,
    )

    if (!isPayment?.fulfilled) {
      return {
        success: false,
      }
    }

    let result
    try {
      result = await this.createLicense(nationalId, answers)
    } catch (e) {
      this.log('error', 'Creating license failed', {
        e,
        applicationFor: answers.applicationFor,
        jurisdiction: answers.juristictionId,
      })

      throw e
    }

    if (!result.success) {
      throw new Error(`Application submission failed (${result.errorMessage})`)
    }

    try {
      await this.sharedTemplateAPIService.sendEmail(
        generateDrivingLicenseSubmittedEmail,
        application,
      )
    } catch (e) {
      this.log(
        'error',
        'Could not send email to applicant after successful submission',
        { e },
      )
    }

    return {
      success: true,
    }
  }

  private log(lvl: 'error' | 'info', message: string, meta: unknown) {
    this.logger.log(lvl, `[driving-license-submission] ${message}`, meta)
  }

  private async createLicense(
    nationalId: string,
    answers: FormValue,
  ): Promise<NewDrivingLicenseResult> {
    const applicationFor =
      getValueViaPath<'B-full' | 'B-temp'>(answers, 'applicationFor') ??
      'B-full'

    const needsHealthCert = calculateNeedsHealthCert(answers.healthDeclaration)
    const healthRemarks = answers.hasHealthRemarks === 'yes'
    const needsQualityPhoto = answers.willBringQualityPhoto === 'yes'
    const juristictionId = answers.juristiction
    const teacher = answers.drivingInstructor as string
    const email = answers.email as string
    const phone = answers.phone as string

    if (applicationFor === 'B-full') {
      return this.drivingLicenseService.newDrivingLicense(nationalId, {
        juristictionId: juristictionId as number,
        needsToPresentHealthCertificate: needsHealthCert || healthRemarks,
        needsToPresentQualityPhoto: needsQualityPhoto,
      })
    } else if (applicationFor === 'B-temp') {
      return this.drivingLicenseService.newTemporaryDrivingLicense(nationalId, {
        juristictionId: juristictionId as number,
        needsToPresentHealthCertificate: needsHealthCert,
        needsToPresentQualityPhoto: needsQualityPhoto,
        teacherNationalId: teacher,
        email: email,
        phone: phone,
      })
    }

    throw new Error('application for unknown type of license')
  }

  async submitAssessmentConfirmation({
    application,
  }: TemplateApiModuleActionProps) {
    const { answers } = application
    const studentNationalId = (answers.student as { nationalId: string })
      .nationalId
    const teacherNationalId = application.applicant

    try {
      const result = await this.drivingLicenseService.newDrivingAssessment(
        studentNationalId as string,
        teacherNationalId,
      )

      if (result.success) {
        await this.sharedTemplateAPIService.sendEmail(
          generateDrivingAssessmentApprovalEmail,
          application,
        )
        return {
          success: result.success,
        }
      } else {
        throw new Error(
          `Unexpected error (creating driver's license): '${result.errorMessage}'`,
        )
      }
    } catch (e) {
      if (e instanceof Error && e.name === 'FetchError') {
        const err = e as unknown as FetchError
        throw new TemplateApiError(
          {
            title:
              err.problem?.title || coreErrorMessages.failedDataProviderSubmit,
            summary: err.problem?.detail || '',
          },
          400,
        )
      }
    }
  }
}
