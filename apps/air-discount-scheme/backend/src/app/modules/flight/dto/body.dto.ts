import {
  IsOptional,
  IsObject,
  IsEnum,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsString,
  IsNumber,
  IsISO8601,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

import { Airlines, States } from '@island.is/air-discount-scheme/consts'
import {
  Travel,
  RangeInput,
  PeriodInput,
  FlightLegsInput,
} from '@island.is/air-discount-scheme/types'

export class CreateFlightLegBody {
  @IsString()
  @ApiProperty()
  readonly origin!: string

  @IsString()
  @ApiProperty()
  readonly destination!: string

  @IsNumber()
  @ApiProperty()
  readonly originalPrice!: number

  @IsNumber()
  @ApiProperty()
  readonly discountPrice!: number

  @IsISO8601()
  @ApiProperty()
  readonly date!: Date

  @IsOptional()
  @IsEnum([Airlines.norlandair])
  @ApiProperty({ enum: [Airlines.norlandair] })
  readonly cooperation?: string
}

export class CreateFlightBody {
  @IsISO8601()
  @ApiProperty()
  readonly bookingDate!: Date

  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateFlightLegBody)
  @ApiProperty({ type: [CreateFlightLegBody] })
  readonly flightLegs!: CreateFlightLegBody[]
}

export class GetFlightLegsBody implements FlightLegsInput {
  @IsOptional()
  @IsEnum(Object.keys(Airlines))
  airline?: string

  @IsOptional()
  @IsEnum(Object.keys(Airlines))
  cooperation?: string

  @IsOptional()
  @IsObject()
  flightLeg?: Travel

  @IsOptional()
  @IsObject()
  period?: PeriodInput

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @IsEnum(States)
  state?: string[]

  @IsOptional()
  @IsObject()
  age?: RangeInput

  @IsOptional()
  @IsEnum(['kk', 'kvk', 'hvk'])
  gender?: 'kk' | 'kvk' | 'hvk'

  @IsOptional()
  @IsNumber()
  postalCode?: number
}

export class ConfirmInvoiceBody extends GetFlightLegsBody {}
