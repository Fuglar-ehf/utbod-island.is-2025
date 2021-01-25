import { Field, ObjectType, ID } from '@nestjs/graphql'

import { Eligibility } from './eligibility.model'

@ObjectType()
export class DrivingLicense {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  issued!: string

  @Field(() => String)
  expires!: string

  @Field(() => Boolean)
  isProvisional!: boolean

  @Field(() => [Eligibility])
  eligibilities!: Eligibility[]
}
