import { Query, Resolver, Args } from '@nestjs/graphql'
import { ForbiddenException, Inject, UseGuards } from '@nestjs/common'
import graphqlTypeJson from 'graphql-type-json'

import { ApiScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  Scopes,
} from '@island.is/auth-nest-tools'
import { FinanceClientService } from '@island.is/clients/finance'
import { Audit } from '@island.is/nest/audit'
import { DownloadServiceConfig } from '@island.is/nest/config'
import type { ConfigType } from '@island.is/nest/config'

import { GetFinancialOverviewInput } from './dto/getOverview.input'
import { GetCustomerRecordsInput } from './dto/getCustomerRecords.input'
import { GetDocumentsListInput } from './dto/getDocumentsList.input'
import { GetFinanceDocumentInput } from './dto/getFinanceDocument.input'
import { GetAnnualStatusDocumentInput } from './dto/getAnnualStatusDocument.input'
import { CustomerChargeType } from './models/customerChargeType.model'
import { FinanceDocumentModel } from './models/financeDocument.model'
import { CustomerTapsControlModel } from './models/customerTapsControl.model'
import { DocumentsListModel } from './models/documentsList.model'
import { CustomerRecords } from './models/customerRecords.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.financeOverview)
@Resolver()
@Audit({ namespace: '@island.is/api/finance' })
export class FinanceResolver {
  constructor(
    private financeService: FinanceClientService,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadServiceConfig: ConfigType<
      typeof DownloadServiceConfig
    >,
  ) {}

  @Query(() => graphqlTypeJson)
  @Audit()
  async getFinanceStatus(@CurrentUser() user: User) {
    const financeStatus = await this.financeService.getFinanceStatus(
      user.nationalId,
      user,
    )
    return {
      ...financeStatus,
      downloadServiceURL: `${this.downloadServiceConfig.baseUrl}/download/v1/finance/`,
    }
  }

  @Query(() => graphqlTypeJson, { nullable: true })
  @Audit()
  async getFinanceStatusDetails(
    @CurrentUser() user: User,
    @Args('input') input: GetFinancialOverviewInput,
  ) {
    return this.financeService.getFinanceStatusDetails(
      user.nationalId,
      input.orgID,
      input.chargeTypeID,
      user,
    )
  }

  @Query(() => CustomerChargeType, { nullable: true })
  @Audit()
  async getCustomerChargeType(@CurrentUser() user: User) {
    return this.financeService.getCustomerChargeType(user.nationalId, user)
  }

  @Query(() => CustomerRecords, { nullable: true })
  @Audit()
  async getCustomerRecords(
    @CurrentUser() user: User,
    @Args('input') input: GetCustomerRecordsInput,
  ) {
    return this.financeService.getCustomerRecords(
      user.nationalId,
      input.chargeTypeID,
      input.dayFrom,
      input.dayTo,
      user,
    )
  }

  @Query(() => DocumentsListModel)
  @Scopes(ApiScope.financeOverview, ApiScope.financeSalary)
  @Audit()
  async getDocumentsList(
    @CurrentUser() user: User,
    @Args('input') input: GetDocumentsListInput,
  ) {
    if (
      input.listPath === 'employeeClaims' &&
      !user.scope.includes(ApiScope.financeSalary)
    ) {
      throw new ForbiddenException()
    }

    const documentsList = await this.financeService.getDocumentsList(
      user.nationalId,
      input.dayFrom,
      input.dayTo,
      input.listPath,
      user,
    )
    return {
      ...documentsList,
      downloadServiceURL: `${this.downloadServiceConfig.baseUrl}/download/v1/finance/`,
    }
  }

  @Query(() => FinanceDocumentModel, { nullable: true })
  @Audit()
  async getFinanceDocument(
    @CurrentUser() user: User,
    @Args('input') input: GetFinanceDocumentInput,
  ) {
    return this.financeService.getFinanceDocument(
      user.nationalId,
      input.documentID,
      user,
    )
  }

  @Query(() => FinanceDocumentModel, { nullable: true })
  @Audit()
  async getAnnualStatusDocument(
    @CurrentUser() user: User,
    @Args('input') input: GetAnnualStatusDocumentInput,
  ) {
    return this.financeService.getAnnualStatusDocument(
      user.nationalId,
      input.year,
      user,
    )
  }

  @Query(() => CustomerTapsControlModel, { nullable: true })
  @Audit()
  async getCustomerTapControl(@CurrentUser() user: User) {
    return this.financeService.getCustomerTapControl(user.nationalId, user)
  }
}
