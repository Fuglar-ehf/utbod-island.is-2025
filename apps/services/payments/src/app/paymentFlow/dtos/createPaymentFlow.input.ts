import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsEnum,
  IsArray,
  IsString,
  IsNumber,
  IsObject,
  IsOptional,
  ArrayNotEmpty,
  Length,
  Matches,
  IsPositive,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

import { PaymentMethod } from '../../../types'

export class ChargeInput {
  @IsString()
  @ApiProperty({
    description: 'Charge type',
    type: String,
  })
  chargeType!: string

  @IsString()
  @ApiProperty({
    description: 'Charge item code',
    type: String,
  })
  chargeItemCode!: string

  @IsNumber()
  @IsOptional()
  @IsPositive({ message: 'price must be greater than 0' })
  @ApiProperty({
    description: 'Price of the charge',
    type: Number,
  })
  price?: number

  @IsNumber()
  @IsPositive({ message: 'quantity must be greater than 0' })
  @ApiProperty({
    description: 'Quantity of this item',
    type: Number,
  })
  quantity!: number
}

export class CreatePaymentFlowInput {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Product title to display to the payer',
    type: String,
  })
  productTitle?: string

  @ApiProperty({
    description: 'Charges associated with the payment flow',
    type: [ChargeInput],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true }) // Validate each object in the array
  @Type(() => ChargeInput) // Transform each array item to a Charge instance
  charges!: ChargeInput[]

  @IsString()
  @Length(10, 10, {
    message: 'payerNationalId must be exactly 10 characters long',
  })
  @Matches(/^\d+$/, {
    message: 'payerNationalId must contain only numeric characters',
  })
  @ApiProperty({
    description: 'National id of the payer, can be a company or an individual',
    type: String,
  })
  payerNationalId!: string

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description:
      'Optional identifier for an invoice associated with the payment flow',
    type: String,
  })
  invoiceId?: string

  @ApiProperty({
    description: 'List of allowed payment methods for this payment flow',
    type: [String],
    example: ['card', 'invoice'],
    enum: PaymentMethod,
    isArray: true,
  })
  @IsArray()
  @IsEnum(PaymentMethod, { each: true })
  availablePaymentMethods!: PaymentMethod[]

  @IsString()
  @ApiProperty({
    description: 'URL callback to be called on a successful payment',
    type: String,
  })
  onSuccessUrl!: string

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description:
      'URL callback to be called on payment update events like when the user requests to create invoice rather than directly paying',
    type: String,
  })
  onUpdateUrl?: string

  @IsString()
  @ApiProperty({
    description: 'URL callback to be called on payment error events',
    type: String,
  })
  onErrorUrl!: string

  @IsString()
  @ApiProperty({
    description: 'Identifier for the organization initiating the payment flow',
    type: String,
  })
  organisationId!: string

  @IsObject()
  @IsOptional()
  @ApiPropertyOptional({
    description:
      'Arbitrary JSON data that will be returned on in callbacks (e.g. onSuccess, onUpdate)',
    type: Object,
    example: { customData: 'value' },
  })
  metadata?: object
}
