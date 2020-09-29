import { IsString, IsOptional, IsEnum } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

import { CaseState } from '@island.is/judicial-system/types'

import {
  CaseCustodyRestrictions,
  CaseCustodyProvisions,
  CaseAppealDecision,
} from '../models'

export class UpdateCaseDto {
  @IsOptional()
  @IsEnum(CaseState)
  @ApiPropertyOptional({ enum: CaseState })
  readonly state: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly policeCaseNumber: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly accusedNationalId: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly accusedName: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly accusedAddress: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly court: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly arrestDate: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly requestedCourtDate: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly requestedCustodyEndDate: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly lawsBroken: string

  @IsOptional()
  @IsEnum(CaseCustodyProvisions, { each: true })
  @ApiPropertyOptional({ enum: CaseCustodyProvisions, isArray: true })
  readonly custodyProvisions: CaseCustodyProvisions[]

  @IsOptional()
  @IsEnum(CaseCustodyRestrictions, { each: true })
  @ApiPropertyOptional({ enum: CaseCustodyRestrictions, isArray: true })
  readonly requestedCustodyRestrictions: CaseCustodyRestrictions[]

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly caseFacts: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly witnessAccounts: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly investigationProgress: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly legalArguments: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly comments: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly courtCaseNumber: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly courtStartTime: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly courtEndTime: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly courtAttendees: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly policeDemands: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly accusedPlea: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly litigationPresentations: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly ruling: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly custodyEndDate: Date

  @IsOptional()
  @IsEnum(CaseCustodyRestrictions, { each: true })
  @ApiPropertyOptional({ enum: CaseCustodyRestrictions, isArray: true })
  readonly custodyRestrictions: CaseCustodyRestrictions[]

  @IsOptional()
  @IsEnum(CaseAppealDecision, { each: true })
  @ApiPropertyOptional({ enum: CaseAppealDecision })
  readonly accusedAppealDecision: CaseAppealDecision

  @IsOptional()
  @IsEnum(CaseAppealDecision, { each: true })
  @ApiPropertyOptional({ enum: CaseAppealDecision })
  readonly prosecutorAppealDecision: CaseAppealDecision
}
