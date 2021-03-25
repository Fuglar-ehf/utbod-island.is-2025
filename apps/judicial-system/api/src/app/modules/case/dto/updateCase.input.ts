import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import {
  CaseAppealDecision,
  CaseCustodyProvisions,
  CaseCustodyRestrictions,
  CaseDecision,
  CaseGender,
  AccusedPleaDecision,
  UpdateCase,
} from '@island.is/judicial-system/types'

@InputType()
export class UpdateCaseInput implements UpdateCase {
  @Allow()
  @Field()
  readonly id!: string

  @Allow()
  @Field({ nullable: true })
  readonly policeCaseNumber?: string

  @Allow()
  @Field({ nullable: true })
  readonly accusedNationalId?: string

  @Allow()
  @Field({ nullable: true })
  readonly accusedName?: string

  @Allow()
  @Field({ nullable: true })
  readonly accusedAddress?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly accusedGender?: CaseGender

  @Allow()
  @Field({ nullable: true })
  readonly defenderName?: string

  @Allow()
  @Field({ nullable: true })
  readonly defenderEmail?: string

  @Allow()
  @Field({ nullable: true })
  readonly sendRequestToDefender?: boolean

  @Allow()
  @Field({ nullable: true })
  readonly court?: string

  @Allow()
  @Field({ nullable: true })
  readonly arrestDate?: string

  @Allow()
  @Field({ nullable: true })
  readonly requestedCourtDate?: string

  @Allow()
  @Field({ nullable: true })
  readonly requestedCustodyEndDate?: string

  @Allow()
  @Field({ nullable: true })
  readonly otherDemands?: string

  @Allow()
  @Field({ nullable: true })
  readonly lawsBroken?: string

  @Allow()
  @Field(() => [String], { nullable: true })
  readonly custodyProvisions?: CaseCustodyProvisions[]

  @Allow()
  @Field(() => [String], { nullable: true })
  readonly requestedCustodyRestrictions?: CaseCustodyRestrictions[]

  @Allow()
  @Field({ nullable: true })
  readonly requestedOtherRestrictions?: string

  @Allow()
  @Field({ nullable: true })
  readonly caseFacts?: string

  @Allow()
  @Field({ nullable: true })
  readonly legalArguments?: string

  @Allow()
  @Field({ nullable: true })
  readonly comments?: string

  @Allow()
  @Field({ nullable: true })
  readonly prosecutorId?: string

  @Allow()
  @Field({ nullable: true })
  readonly setCourtCaseNumberManually?: boolean

  @Allow()
  @Field({ nullable: true })
  readonly courtCaseNumber?: string

  @Allow()
  @Field({ nullable: true })
  readonly courtDate?: string

  @Allow()
  @Field({ nullable: true })
  readonly courtRoom?: string

  @Allow()
  @Field({ nullable: true })
  readonly courtStartTime?: string

  @Allow()
  @Field({ nullable: true })
  readonly courtEndTime?: string

  @Allow()
  @Field({ nullable: true })
  readonly courtAttendees?: string

  @Allow()
  @Field({ nullable: true })
  readonly policeDemands?: string

  @Allow()
  @Field(() => [String], { nullable: true })
  readonly courtDocuments?: string[]

  @Allow()
  @Field({ nullable: true })
  readonly additionToConclusion?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly accusedPleaDecision?: AccusedPleaDecision

  @Allow()
  @Field({ nullable: true })
  readonly accusedPleaAnnouncement?: string

  @Allow()
  @Field({ nullable: true })
  readonly litigationPresentations?: string

  @Allow()
  @Field({ nullable: true })
  readonly ruling?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly decision?: CaseDecision

  @Allow()
  @Field({ nullable: true })
  readonly custodyEndDate?: string

  @Allow()
  @Field(() => [String], { nullable: true })
  readonly custodyRestrictions?: CaseCustodyRestrictions[]

  @Allow()
  @Field({ nullable: true })
  readonly otherRestrictions?: string

  @Allow()
  @Field({ nullable: true })
  readonly isolationTo?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly accusedAppealDecision?: CaseAppealDecision

  @Allow()
  @Field({ nullable: true })
  readonly accusedAppealAnnouncement?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly prosecutorAppealDecision?: CaseAppealDecision

  @Allow()
  @Field({ nullable: true })
  readonly prosecutorAppealAnnouncement?: string

  @Allow()
  @Field({ nullable: true })
  readonly judgeId?: string

  @Allow()
  @Field({ nullable: true })
  readonly registrarId?: string
}
