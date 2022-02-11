import { Field, InputType } from '@nestjs/graphql'
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator'
import { Locale } from '../types/locales.enum'
import { DataStatus } from '../types/dataStatus.enum'

@InputType()
export class CreateUserProfileInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  mobilePhoneNumber?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  locale?: Locale

  @Field(() => String, { nullable: true })
  @IsOptional()
  email?: string

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  documentNotifications?: boolean

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsEnum(DataStatus)
  emailStatus?: DataStatus

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsEnum(DataStatus)
  mobileStatus?: DataStatus

  @Field(() => String, { nullable: true })
  @IsOptional()
  emailCode?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  smsCode?: string

  // Temporary merge with islyklar service
  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  canNudge?: boolean
}
