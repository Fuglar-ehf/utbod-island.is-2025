import { Field, ObjectType, Int } from '@nestjs/graphql'
import { Field as FieldModel } from './field.model'
import { FormCertificationType } from './formCertificationType.model'
import { FormApplicant } from './formApplicant.model'
import { Section } from './section.model'
import { ListType } from './listItem.model'
import { LanguageType } from './languageType.model'
import { Screen as ScreenModel } from './screen.model'
import { FieldType } from './fieldType.model'

@ObjectType('FormSystemDependency')
export class Dependency {
  @Field(() => String, { nullable: true })
  parentProp?: string

  @Field(() => [String], { nullable: 'itemsAndList' })
  childProps?: string[]
}

@ObjectType('FormSystemForm')
export class Form {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  organizationId?: string

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => String, { nullable: true })
  slug?: string

  @Field(() => Date, { nullable: true })
  invalidationDate?: Date

  @Field(() => Date, { nullable: true })
  created?: Date

  @Field(() => Date, { nullable: true })
  modified?: Date

  @Field(() => Boolean, { nullable: true })
  isTranslated?: boolean

  @Field(() => Int, { nullable: true })
  applicationDaysToRemove?: number

  @Field(() => Int, { nullable: true })
  derivedFrom?: number

  @Field(() => Boolean, { nullable: true })
  stopProgressOnValidatingScreen?: boolean

  @Field(() => LanguageType, { nullable: true })
  completedMessage?: LanguageType

  @Field(() => [FormCertificationType], { nullable: 'itemsAndList' })
  certificationTypes?: FormCertificationType[]

  @Field(() => [FormApplicant], { nullable: 'itemsAndList' })
  applicants?: FormApplicant[]

  @Field(() => [Section], { nullable: 'itemsAndList' })
  sections?: Section[]

  @Field(() => [ScreenModel], { nullable: 'itemsAndList' })
  screens?: ScreenModel[]

  @Field(() => [FieldModel], { nullable: 'itemsAndList' })
  fields?: FieldModel[]

  @Field(() => [Dependency], { nullable: 'itemsAndList' })
  dependencies?: Dependency[]
}

@ObjectType('FormSystemFormResponse')
export class FormResponse {
  @Field(() => Form, { nullable: true })
  form?: Form

  @Field(() => [FieldType], { nullable: 'itemsAndList' })
  fieldTypes?: FieldType[]

  @Field(() => [FormCertificationType], { nullable: 'itemsAndList' })
  certificationTypes?: FormCertificationType[]

  @Field(() => [ListType], { nullable: 'itemsAndList' })
  listTypes?: ListType[]

  @Field(() => [Form], { nullable: 'itemsAndList' })
  forms?: Form[]
}
