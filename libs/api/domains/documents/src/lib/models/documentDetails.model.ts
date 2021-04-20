import { DocumentDTO } from '@island.is/clients/documents'
import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class DocumentDetails {
  @Field(() => String)
  fileType: string

  @Field(() => String)
  content?: string

  @Field(() => String)
  html: string

  @Field(() => String)
  url: string

  static fromDocumentDTO(dto: DocumentDTO) {
    const doc = new DocumentDetails()
    doc.content = dto.content
    doc.fileType = dto.fileType
    doc.html = dto.htmlContent
    doc.url = dto.url
    return doc
  }
}
