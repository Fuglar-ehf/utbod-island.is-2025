import { Module } from '@nestjs/common'
import { FinanceClientV2Service } from './financeV2.service'

@Module({
  providers: [FinanceClientV2Service],
  exports: [FinanceClientV2Service],
})
export class FinanceClientV2Module {}
