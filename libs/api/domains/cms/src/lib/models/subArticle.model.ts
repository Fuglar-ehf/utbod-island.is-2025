import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ISubArticle } from '../generated/contentfulTypes'
import { mapDocument, SliceUnion } from '../unions/slice.union'

@ObjectType()
export class SubArticle {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  slug!: string

  @Field(() => [SliceUnion])
  body: Array<typeof SliceUnion> = []

  @Field({ nullable: true })
  showTableOfContents?: boolean
}

export const mapSubArticle = ({ sys, fields }: ISubArticle): SubArticle => ({
  id: sys.id,
  title: fields.title ?? '',
  slug: fields.slug ?? '',
  body: fields.content ? mapDocument(fields.content, sys.id + ':body') : [],
  showTableOfContents: fields.showTableOfContents ?? false,
})
