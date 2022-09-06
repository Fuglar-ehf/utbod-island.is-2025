import { Field, ObjectType, ID } from '@nestjs/graphql'
import { IOrganization } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { OrganizationTag, mapOrganizationTag } from './organizationTag.model'
import { FooterItem, mapFooterItem } from './footerItem.model'
import { mapNamespace, Namespace } from './namespace.model'
import { GenericTag, mapGenericTag } from './genericTag.model'

@ObjectType()
export class Organization {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  shortTitle?: string

  @Field({ nullable: true })
  description?: string

  @Field()
  slug!: string

  @Field(() => [OrganizationTag])
  tag?: Array<OrganizationTag>

  @Field(() => Image, { nullable: true })
  logo?: Image | null

  @Field({ nullable: true })
  link?: string

  @Field(() => [FooterItem])
  footerItems?: Array<FooterItem>

  @Field()
  phone?: string

  @Field()
  email?: string

  @Field(() => String, { nullable: true })
  serviceWebTitle?: string | null

  @Field(() => Boolean, { nullable: true })
  serviceWebEnabled?: boolean

  @Field(() => Number, { nullable: true })
  serviceWebPopularQuestionCount?: number

  @Field(() => Namespace, { nullable: true })
  namespace!: Namespace | null

  @Field(() => Image, { nullable: true })
  serviceWebFeaturedImage!: Image | null

  @Field(() => [GenericTag])
  publishedMaterialSearchFilterGenericTags!: GenericTag[]

  @Field(() => Boolean, { nullable: true })
  showsUpOnTheOrganizationsPage?: boolean
}

export const mapOrganization = ({
  fields,
  sys,
}: IOrganization): Organization => {
  return {
    id: sys.id,
    title: fields.title?.trim() ?? '',
    shortTitle: fields.shortTitle ?? '',
    description: fields.description ?? '',
    slug: fields.slug?.trim() ?? '',
    tag: (fields.tag ?? []).map(mapOrganizationTag),
    logo: fields.logo ? mapImage(fields.logo) : null,
    link: fields.link ?? '',
    footerItems: (fields.footerItems ?? []).map(mapFooterItem),
    phone: fields.phone ?? '',
    email: fields.email ?? '',
    serviceWebTitle: fields.serviceWebTitle ?? '',
    serviceWebEnabled: Boolean(fields.serviceWebEnabled),
    serviceWebPopularQuestionCount: fields.serviceWebPopularQuestionCount ?? 0,
    namespace: fields.namespace ? mapNamespace(fields.namespace) : null,
    serviceWebFeaturedImage: fields.serviceWebFeaturedImage
      ? mapImage(fields.serviceWebFeaturedImage)
      : null,
    publishedMaterialSearchFilterGenericTags: fields.publishedMaterialSearchFilterGenericTags
      ? fields.publishedMaterialSearchFilterGenericTags.map(mapGenericTag)
      : [],
    showsUpOnTheOrganizationsPage: fields.showsUpOnTheOrganizationsPage ?? true,
  }
}
