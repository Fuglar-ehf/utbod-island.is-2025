import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator'

import { Locale } from '../../user-profile/types/localeTypes'
import { DataStatus } from '../../user-profile/types/dataStatusTypes'

export class UserProfileDto {
  @ApiProperty()
  @IsString()
  readonly nationalId: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  readonly email?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly mobilePhoneNumber?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(Locale)
  readonly locale?: Locale

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  readonly mobilePhoneNumberVerified?: boolean

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  readonly emailVerified?: boolean

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  readonly documentNotifications?: boolean

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly profileImageUrl?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  readonly needsNudge?: boolean | null
}
