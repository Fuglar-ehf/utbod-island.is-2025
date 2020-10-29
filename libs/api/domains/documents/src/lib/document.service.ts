import { Injectable, NotFoundException } from '@nestjs/common'
import { Document } from './models/document.model'
import {
  CustomersApi,
  CategoryDTO,
  DocumentInfoDTO,
  DocumentDTO,
} from '../../gen/fetch/'
import { ListDocumentsInput } from './dto/listDocumentsInput'
import { logger } from '@island.is/logging'
import { DocumentDetails } from './models/documentDetails.model'
import { DocumentCategory } from './models/documentCategory.model'

@Injectable()
export class DocumentService {
  constructor(private customersApi: CustomersApi) {}

  async findByDocumentId(
    natReg: string,
    documentId: string,
  ): Promise<DocumentDetails> {
    try {
      const rawDocumentDTO = await this.customersApi.customersDocument({
        kennitala: natReg,
        messageId: documentId,
        authenticationType: 'LOW',
      })

      const documentDTO: DocumentDTO = {
        ...rawDocumentDTO,
        fileType: rawDocumentDTO.fileType || '',
        content: rawDocumentDTO.content || '',
        htmlContent: rawDocumentDTO.htmlContent || '',
        url: rawDocumentDTO.url || '',
      }

      return DocumentDetails.fromDocumentDTO(documentDTO)
    } catch (exception) {
      logger.error(exception)
      throw new NotFoundException('Error fetching document')
    }
  }

  async listDocuments(input: ListDocumentsInput): Promise<Document[]> {
    try {
      const body = await this.customersApi.customersListDocuments({
        kennitala: input.natReg,
      })
      return body.messages.reduce(function (
        result: Document[],
        documentMessage: DocumentInfoDTO,
      ) {
        if (documentMessage)
          result.push(Document.fromDocumentInfo(documentMessage))
        return result
      },
      [])
    } catch (exception) {
      logger.error(exception)
      return []
    }
  }

  async getCategories(natReg: string): Promise<DocumentCategory[]> {
    try {
      const body = await this.customersApi.customersCategories({
        kennitala: natReg,
      })
      return body.categories.reduce(function (
        result: DocumentCategory[],
        category: CategoryDTO,
      ) {
        if (category) result.push(DocumentCategory.fromCategoryDTO(category))
        return result
      },
      [])
    } catch (exception) {
      logger.error(exception)
      return []
    }
  }
}
