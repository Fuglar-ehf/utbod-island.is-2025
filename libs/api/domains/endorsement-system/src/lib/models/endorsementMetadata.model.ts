import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class EndorsementMetadata {
  @Field({ nullable: true })
  fullName!: string | null
}
