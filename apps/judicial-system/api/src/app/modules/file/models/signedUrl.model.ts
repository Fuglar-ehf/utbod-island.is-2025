import { Field, ID, ObjectType } from '@nestjs/graphql'

import { SignedUrl as TSignedUrl } from '@island.is/judicial-system/types'

@ObjectType()
export class SignedUrl implements TSignedUrl {
  @Field()
  readonly url!: string
}
