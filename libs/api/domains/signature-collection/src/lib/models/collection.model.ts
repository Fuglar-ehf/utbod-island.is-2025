import { Field, ID, ObjectType } from '@nestjs/graphql'
import { SignatureCollectionArea } from './area.model'
import { SignatureCollectionCandidate } from './candidate.model'

@ObjectType()
export class SignatureCollection {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string

  @Field(() => [SignatureCollectionArea])
  areas!: SignatureCollectionArea[]

  @Field(() => Date)
  endTime!: Date

  @Field(() => Date)
  startTime!: Date

  @Field(() => [SignatureCollectionCandidate])
  candidates!: SignatureCollectionCandidate[]
}
