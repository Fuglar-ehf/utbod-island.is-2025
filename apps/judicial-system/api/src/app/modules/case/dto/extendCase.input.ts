import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ExtendCaseInput {
  @Allow()
  @Field()
  readonly id!: string
}
