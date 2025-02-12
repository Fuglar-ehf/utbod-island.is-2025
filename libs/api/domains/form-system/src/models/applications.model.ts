import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Section } from './section.model'
import { LanguageType } from './languageType.model'
import { Dependency } from './form.model'
import { ValueDto } from './value.model'
import { FormCertificationTypeDto } from './certification.model'
import { FormApplicantTypeDto } from './applicant.model'

@ObjectType('FormSystemApplicationEventDto')
export class ApplicationEventDto {
  @Field(() => String, { nullable: true })
  eventType?: string

  @Field(() => Boolean, { nullable: true })
  isFileEvent?: boolean

  @Field(() => Date, { nullable: true })
  created?: Date

}

@ObjectType('FormSystemApplication')
export class Application {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => LanguageType, { nullable: true })
  organizationName?: LanguageType

  @Field(() => String, { nullable: true })
  formId?: string

  @Field(() => LanguageType, { nullable: true })
  formName?: LanguageType

  @Field(() => Boolean, { nullable: true })
  isTest?: boolean

  @Field(() => String, { nullable: true })
  slug?: string

  @Field(() => Date, { nullable: true })
  created?: Date

  @Field(() => Date, { nullable: true })
  modified?: Date

  @Field(() => Date, { nullable: true })
  submittedAt?: Date

  @Field(() => [Dependency], { nullable: 'itemsAndList' })
  dependencies?: Dependency[]

  @Field(() => [String], { nullable: 'itemsAndList' })
  completed?: string[]

  @Field(() => String, { nullable: true })
  status?: string

  @Field(() => [ApplicationEventDto], { nullable: 'itemsAndList' })
  events?: ApplicationEventDto[]

  @Field(() => [Section], { nullable: 'itemsAndList' })
  sections?: Section[]

  @Field(() => [ValueDto], { nullable: 'itemsAndList' })
  files?: ValueDto[]

  @Field(() => [FormCertificationTypeDto], { nullable: 'itemsAndList' })
  certificationTypes?: FormCertificationTypeDto[]

  @Field(() => [FormApplicantTypeDto], { nullable: 'itemsAndList' })
  applicantTypes?: FormApplicantTypeDto[]
}


