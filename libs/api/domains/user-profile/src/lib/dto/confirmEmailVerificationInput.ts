import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class ConfirmEmailVerificationInput {
  @Field(() => String)
  @IsString()
  hash!: string

  @Field(() => String)
  @IsString()
  email!: string
}
