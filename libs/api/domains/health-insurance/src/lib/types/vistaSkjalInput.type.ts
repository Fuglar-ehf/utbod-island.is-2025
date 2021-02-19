import { InputType, Field } from '@nestjs/graphql'
import {
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsOptional,
  IsDate,
  IsIn,
  MaxDate,
  IsEmail,
} from 'class-validator'

@InputType()
export class VistaSkjalInput {
  @Field(() => String)
  @IsNotEmpty()
  applicationNumber!: string

  @Field(() => Date)
  @IsNotEmpty()
  @IsDate()
  @MaxDate(new Date(Date.now()))
  applicationDate!: Date

  @Field(() => String, { nullable: true })
  @IsOptional()
  @MaxLength(10)
  @MinLength(10)
  nationalId?: string

  @Field(() => String)
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(15)
  foreignNationalId!: string

  @Field(() => String)
  @IsNotEmpty()
  @MaxLength(100)
  name!: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @MaxLength(100)
  address?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @MaxLength(100)
  postalAddress?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @MaxLength(100)
  citizenship?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @MaxLength(4)
  countryCode?: string

  @Field(() => String)
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  email!: string

  @Field(() => String)
  @IsNotEmpty()
  @MaxLength(20)
  phoneNumber!: string

  @Field(() => Date)
  @IsNotEmpty()
  @IsDate()
  residenceDateFromNationalRegistry!: Date

  @Field(() => Date)
  @IsNotEmpty()
  @IsDate()
  residenceDateUserThink!: Date

  @Field(() => String)
  @IsNotEmpty()
  @IsIn(['S', 'P', 'O'])
  userStatus!: 'S' | 'P' | 'O'

  @Field(() => Number)
  @IsNotEmpty()
  @IsIn([0, 1])
  isChildrenFollowed!: 0 | 1

  @Field(() => String)
  @IsNotEmpty()
  previousCountry!: string

  @Field(() => String)
  @IsNotEmpty()
  previousCountryCode!: string

  @Field(() => String)
  @IsNotEmpty()
  previousIssuingInstitution!: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  additionalInformation?: string

  @Field(() => Number)
  @IsNotEmpty()
  @IsIn([0, 1])
  isHealthInsuredInPreviousCountry!: 0 | 1

  @Field(() => [String], { nullable: true })
  @IsOptional()
  attachmentsFileNames?: string[]
}
