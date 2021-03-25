import { Injectable, Inject } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  SyslumennService,
  Person,
  Attachment,
  PersonType,
} from '@island.is/api/domains/syslumenn'
import {
  CRCApplication,
  Override,
  getSelectedChildrenFromExternalData,
} from '@island.is/application/templates/children-residence-change'
import * as AWS from 'aws-sdk'
import { SharedTemplateApiService } from '../../shared'
import { generateApplicationSubmittedEmail } from './emailGenerators/applicationSubmitted'
import { Application } from '@island.is/application/core'

export const PRESIGNED_BUCKET = 'PRESIGNED_BUCKET'

type props = Override<
  TemplateApiModuleActionProps,
  { application: CRCApplication }
>

@Injectable()
export class ChildrenResidenceChangeService {
  s3: AWS.S3

  constructor(
    private readonly syslumennService: SyslumennService,
    @Inject(PRESIGNED_BUCKET) private readonly presignedBucket: string,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {
    this.s3 = new AWS.S3()
  }

  async submitApplication({ application }: props) {
    const { answers, externalData } = application
    const { nationalRegistry } = externalData
    const applicant = nationalRegistry.data
    const s3FileName = `children-residence-change/${application.id}.pdf`
    const file = await this.s3
      .getObject({ Bucket: this.presignedBucket, Key: s3FileName })
      .promise()
    const fileContent = file.Body as Buffer

    const selectedChildren = getSelectedChildrenFromExternalData(
      applicant.children,
      answers.selectChild,
    )

    const otherParent = selectedChildren[0].otherParent

    if (!fileContent) {
      throw new Error('File content was undefined')
    }

    const attachment: Attachment = {
      name: `Lögheimilisbreyting-barns-${applicant.nationalId}.pdf`,
      content: fileContent.toString('base64'),
    }

    const parentA: Person = {
      name: applicant.fullName,
      ssn: applicant.nationalId,
      phoneNumber: answers.parentA.phoneNumber,
      email: answers.parentA.email,
      homeAddress: applicant.address.streetName,
      postalCode: applicant.address.postalCode,
      city: applicant.address.city,
      signed: true,
      type: PersonType.Plaintiff,
    }

    const parentB: Person = {
      name: otherParent.fullName,
      ssn: otherParent.nationalId,
      phoneNumber: answers.parentB.phoneNumber,
      email: answers.parentB.email,
      homeAddress: otherParent.address.streetName,
      postalCode: otherParent.address.postalCode,
      city: otherParent.address.city,
      signed: true,
      type: PersonType.CounterParty,
    }

    const participants: Array<Person> = selectedChildren.map((child) => {
      return {
        name: child.fullName,
        ssn: child.nationalId,
        // TODO: change address when we handle that both parents can
        // apply for the change regardless of where the children currently live
        homeAddress: parentA.homeAddress,
        postalCode: parentA.postalCode,
        city: parentA.city,
        signed: false,
        type: PersonType.Child,
      }
    })

    participants.push(parentA, parentB)

    const extraData = {
      interviewRequested: answers.interview,
      reasonForChildrenResidenceChange: answers.residenceChangeReason ?? '',
      transferExpirationDate:
        answers.selectDuration[0] === 'permanent'
          ? answers.selectDuration[0]
          : answers.selectDuration[1],
    }

    const response = await this.syslumennService.uploadData(
      participants,
      attachment,
      extraData,
    )

    await this.sharedTemplateAPIService.sendEmailWithAttachment(
      generateApplicationSubmittedEmail,
      (application as unknown) as Application,
      fileContent.toString('binary'),
      answers.parentA.email,
    )

    await this.sharedTemplateAPIService.sendEmailWithAttachment(
      generateApplicationSubmittedEmail,
      (application as unknown) as Application,
      fileContent.toString('binary'),
      answers.parentB.email,
    )

    return response
  }
}
