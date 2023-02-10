import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { IndictmentCountOffense } from '@island.is/judicial-system/types'

registerEnumType(IndictmentCountOffense, { name: 'IndictmentCountOffense' })

@ObjectType()
export class IndictmentCount {
  @Field(() => ID)
  readonly id!: string

  @Field()
  readonly created!: string

  @Field()
  readonly modified!: string

  @Field()
  readonly caseId!: string

  @Field({ nullable: true })
  readonly policeCaseNumber?: string

  @Field({ nullable: true })
  readonly vehicleRegistrationNumber?: string

  @Field({ nullable: true })
  readonly incidentDescription?: string

  @Field({ nullable: true })
  readonly legalArguments?: string

  @Field(() => [IndictmentCountOffense], { nullable: true })
  readonly offenses?: IndictmentCountOffense[]
}
