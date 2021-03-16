import { Inject, UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { User } from '@island.is/judicial-system/types'
import { AuditedAction } from '@island.is/judicial-system/audit-trail'
import {
  CurrentGraphQlUser,
  JwtGraphQlAuthGuard,
} from '@island.is/judicial-system/auth'

import { BackendAPI } from '../../../services'
import { AuditService } from '../audit'
import { Case } from '../case'
import { CreateCustodyCourtCaseInput } from './dto'
import { CourtService } from './court.service'

@UseGuards(JwtGraphQlAuthGuard)
@Resolver()
export class CourtResolver {
  constructor(
    private readonly auditService: AuditService,
    private readonly courtService: CourtService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Mutation(() => Case, { nullable: true })
  async createCustodyCourtCase(
    @Args('input', { type: () => CreateCustodyCourtCaseInput })
    input: CreateCustodyCourtCaseInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<Case> {
    const { caseId, policeCaseNumber } = input

    this.logger.debug(`Creating custody court case for case ${caseId}`)

    return this.auditService.audit(
      user.id,
      AuditedAction.CREATE_CUSTODY_COURT_CASE,
      backendApi.updateCase(caseId, {
        courtCaseNumber: await this.courtService.createCustodyCourtCase(
          policeCaseNumber,
        ),
      }),
      caseId,
    )
  }
}
