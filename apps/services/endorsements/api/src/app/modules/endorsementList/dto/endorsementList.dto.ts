import {
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
  IsObject,
  IsBoolean,
  IsDate,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ValidationRuleDto } from './validationRule.dto'
import { ApiProperty } from '@nestjs/swagger'
import { EndorsementTag } from '../constants'
import { EndorsementMetadataDto } from './endorsementMetadata.dto'
export class EndorsementListDto {
  @ApiProperty()
  @IsString()
  title!: string

  @ApiProperty({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  description = ''

  @ApiProperty({ type: [EndorsementMetadataDto], nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => EndorsementMetadataDto)
  @IsArray()
  endorsementMetadata = [] as EndorsementMetadataDto[]

  @ApiProperty({ enum: EndorsementTag, isArray: true, nullable: true })
  @IsOptional()
  @IsArray()
  @IsEnum(EndorsementTag, { each: true })
  tags = [] as EndorsementTag[]

  @ApiProperty({ type: [ValidationRuleDto], nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ValidationRuleDto)
  @IsArray()
  validationRules = [] as ValidationRuleDto[]

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsObject()
  meta = {}

  @ApiProperty({ type: Date })
  @IsDate()
  @Type(() => Date)
  closedDate!: Date

  @ApiProperty({ type: Date })
  @IsDate()
  @Type(() => Date)
  openedDate!: Date

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  adminLock!: boolean
}
