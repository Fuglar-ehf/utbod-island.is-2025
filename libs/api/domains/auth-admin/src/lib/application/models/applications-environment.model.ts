import { Field, ID, ObjectType } from '@nestjs/graphql'

import { Environment } from '../../models/environment'
import { TranslatedValue } from '../../models/translated-value.model'

@ObjectType('AuthAdminApplicationEnvironment')
export class ApplicationEnvironment {
  @Field(() => ID)
  id!: string

  @Field(() => Environment)
  environment!: Environment

  @Field()
  name!: string

  @Field(() => [TranslatedValue])
  displayName!: TranslatedValue[]

  @Field(() => [String])
  callbackUrls!: string[]
}
