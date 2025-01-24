import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Documentation } from '@island.is/nest/swagger'

import { PaymentFlowService } from './paymentFlow.service'
import { CreatePaymentFlowDTO } from './dtos/createPaymentFlow.dto'
import { GetPaymentFlowDTO } from './dtos/getPaymentFlow.dto'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { CreatePaymentFlowInput } from './dtos/createPaymentFlow.input'

type CreatePaymentUrlResponse = { url: string }

@UseGuards(FeatureFlagGuard)
@FeatureFlag(Features.isIslandisPaymentEnabled)
@ApiTags('payments')
@Controller({
  path: 'payments',
  version: ['1'],
})
export class PaymentFlowController {
  constructor(private readonly paymentFlowService: PaymentFlowService) {}

  @Get(':id')
  @Documentation({
    description: 'Retrieves payment flow information by ID.',
    response: { status: 200, type: GetPaymentFlowDTO },
  })
  getPaymentFlow(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<GetPaymentFlowDTO | null> {
    return this.paymentFlowService.getPaymentFlow(id)
  }

  @Post()
  @Documentation({
    description: 'Creates a new PaymentFlow.',
    response: { status: 200, type: CreatePaymentFlowDTO },
  })
  createPaymentUrl(
    @Body() paymentInfo: CreatePaymentFlowInput,
  ): Promise<CreatePaymentFlowDTO> {
    return this.paymentFlowService.createPaymentUrl(paymentInfo)
  }
}
