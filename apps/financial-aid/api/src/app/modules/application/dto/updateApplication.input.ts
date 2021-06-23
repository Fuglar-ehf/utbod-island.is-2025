import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import {
  UpdateApplication,
  ApplicationState,
} from '@island.is/financial-aid/shared'

@InputType()
export class UpdateApplicationInput implements UpdateApplication {
  @Allow()
  @Field()
  readonly id!: string

  @Allow()
  @Field(() => String)
  readonly state!: ApplicationState
}
