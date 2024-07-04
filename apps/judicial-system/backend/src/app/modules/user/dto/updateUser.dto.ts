import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

import { UserRole } from '@island.is/judicial-system/types'

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly name?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly title?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly mobileNumber?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly email?: string

  @IsOptional()
  @IsEnum(UserRole)
  @ApiPropertyOptional({ enum: UserRole })
  readonly role?: UserRole

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly institutionId?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly active?: boolean

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly canConfirmIndictment?: boolean
}
