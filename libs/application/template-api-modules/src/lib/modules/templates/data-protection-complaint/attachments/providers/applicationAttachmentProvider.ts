import { ApplicationWithAttachments as Application } from '@island.is/application/core'
import { DocumentInfo } from '@island.is/clients/data-protection-complaint'
import { AttachmentType } from '../../models/attachments'
import { AttachmentS3Service } from '../attachment-s3.service'
import { Injectable } from '@nestjs/common'

export interface DocumentBuildInfo {
  key: string
  name: string
  type: AttachmentType
}

export interface AttachmentAnswer {
  name: string
  type: AttachmentType
}

@Injectable()
export class ApplicationAttachmentProvider {
  constructor(private attachmentService: AttachmentS3Service) {}

  public async getFiles(
    attachmentAnswers: string[],
    application: Application,
  ): Promise<DocumentInfo[]> {
    const files = await this.attachmentService.getFiles(
      application,
      attachmentAnswers,
    )
    return files.map((file) => {
      return {
        subject: 'Kvörtun',
        content: file.fileContent,
        fileName: file.fileName,
        type: this.mapAnswerToType(file.answerKey),
      }
    })
  }

  private mapAnswerToType(answer: string): AttachmentType {
    switch (answer) {
      case 'complaint.documents':
        return AttachmentType.OTHER
      case 'commissions.documents':
        return AttachmentType.POWEROFATTORNEY
      default:
        throw new Error('Invalid attachment type')
    }
  }
}
