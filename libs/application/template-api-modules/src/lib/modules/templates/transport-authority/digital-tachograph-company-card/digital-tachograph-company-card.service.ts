import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { ChargeItemCode } from '@island.is/shared/constants'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'

@Injectable()
export class DigitalTachographCompanyCardService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {
    super(ApplicationTypes.DIGITAL_TACHOGRAPH_COMPANY_CARD)
  }

  async createCharge({
    application: { id },
    auth,
  }: TemplateApiModuleActionProps) {
    try {
      const SAMGONGUSTOFA_NATIONAL_ID = '5405131040'

      const result = this.sharedTemplateAPIService.createCharge(
        auth,
        id,
        SAMGONGUSTOFA_NATIONAL_ID,
        [ChargeItemCode.TRANSPORT_AUTHORITY_DIGITAL_TACHOGRAPH_COMPANY_CARD],
      )
      return result
    } catch (exeption) {
      return { id: '', paymentUrl: '' }
    }
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const { paymentUrl } = application.externalData.createCharge.data as {
      paymentUrl: string
    }
    if (!paymentUrl) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

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
  }
}
