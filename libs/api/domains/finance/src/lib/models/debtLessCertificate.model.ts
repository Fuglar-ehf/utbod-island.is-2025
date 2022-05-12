import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DebtLessCertificateErrorData {
  @Field()
  code!: number

  @Field()
  message!: string

  @Field()
  help!: string

  @Field()
  trackingId!: string

  @Field()
  param!: string
}

@ObjectType()
export class DebtLessCertificateError {
  @Field()
  code!: number

  @Field()
  message!: string

  @Field(() => [DebtLessCertificateErrorData])
  errors!: DebtLessCertificateErrorData[]
}

@ObjectType()
export class DebtLessCertificateResultData {
  @Field()
  type!: string

  @Field()
  document!: string
}

@ObjectType()
export class DebtLessCertificateResult {
  @Field()
  debtLess!: boolean

  @Field(() => DebtLessCertificateResultData, { nullable: true })
  certificate!: DebtLessCertificateResultData
}

@ObjectType()
export class DebtLessCertificateModel {
  @Field(() => DebtLessCertificateResult, { nullable: true })
  debtLessCertificateResult?: DebtLessCertificateResult

  @Field(() => DebtLessCertificateError, { nullable: true })
  error?: DebtLessCertificateError
}
