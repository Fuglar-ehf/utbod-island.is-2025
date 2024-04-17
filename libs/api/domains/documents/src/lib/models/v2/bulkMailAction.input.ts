import { IsPersonNationalId } from '@island.is/nest/core'
import { Field, InputType, OmitType, registerEnumType } from '@nestjs/graphql'
import { IsArray, IsBoolean, IsEnum, IsString } from 'class-validator'

export enum MailAction {
  BOOKMARK = 'bookmark',
  ARCHIVE = 'archive',
  READ = 'read',
  UNBOOKMARK = 'unbookmark',
  UNARCHIVE = 'unarchive',
}

registerEnumType(MailAction, { name: 'DocumentsV2MailAction' })

@InputType('DocumentsV2MailActionInput')
export class MailActionInput {
  @Field(() => [String])
  @IsArray()
  documentIds!: Array<string>

  @Field()
  @IsEnum(MailAction)
  action!: MailAction
}
