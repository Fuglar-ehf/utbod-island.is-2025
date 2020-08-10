import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Link } from '../link.model'
import { Slice } from './slice.model'

@ObjectType()
export class PageHeaderSlice {
  constructor(initializer: PageHeaderSlice) {
    Object.assign(this, initializer)
  }

  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  introduction: string

  @Field()
  navigationText: string

  @Field(() => [Link])
  links: Link[]

  @Field(() => [Slice])
  slices: Array<typeof Slice>
}
