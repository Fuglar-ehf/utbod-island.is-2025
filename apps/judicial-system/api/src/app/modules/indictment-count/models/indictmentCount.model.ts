import { GraphQLJSONObject } from 'graphql-type-json'

import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import type { SubstanceMap } from '@island.is/judicial-system/types'
import { IndictmentCountOffense } from '@island.is/judicial-system/types'

registerEnumType(IndictmentCountOffense, { name: 'IndictmentCountOffense' })

@ObjectType()
export class IndictmentCount {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String, { nullable: true })
  readonly created?: string

  @Field(() => String, { nullable: true })
  readonly modified?: string

  @Field(() => ID, { nullable: true })
  readonly caseId?: string

  @Field(() => String, { nullable: true })
  readonly policeCaseNumber?: string

  @Field(() => String, { nullable: true })
  readonly vehicleRegistrationNumber?: string

  @Field(() => [IndictmentCountOffense], { nullable: true })
  readonly offenses?: IndictmentCountOffense[]

  @Field(() => GraphQLJSONObject, { nullable: true })
  readonly substances?: SubstanceMap

  @Field(() => [[Number, Number]], { nullable: true })
  readonly lawsBroken?: [number, number][]

  @Field(() => String, { nullable: true })
  readonly incidentDescription?: string

  @Field(() => String, { nullable: true })
  readonly legalArguments?: string
}
