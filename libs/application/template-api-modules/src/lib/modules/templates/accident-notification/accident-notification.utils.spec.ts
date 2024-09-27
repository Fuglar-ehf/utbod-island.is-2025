import {
  AccidentNotificationAnswers,
  AccidentTypeEnum,
  AttachmentsEnum,
  FishermanWorkplaceAccidentShipLocationEnum,
  PowerOfAttorneyUploadEnum,
  ReviewApprovalEnum,
  StudiesAccidentTypeEnum,
  WhoIsTheNotificationForEnum,
  WorkAccidentTypeEnum,
  OnBehalf,
  StudiesAccidentLocationEnum,
} from '@island.is/application/templates/accident-notification'
import * as utils from './accident-notification.utils'
import {
  AccidentNotificationAttachment,
  AttachmentTypeEnum,
} from './types/attachments'
import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
  FormValue,
} from '@island.is/application/types'

describe('applicationAnswersToXml', () => {
  it.each([
    AccidentTypeEnum.SPORTS,
    AccidentTypeEnum.RESCUEWORK,
    AccidentTypeEnum.STUDIES,
  ])(
    'should map correctly for a person reporting an injury for themselves, injured in sports, rescue work or studies, with no employer involved',
    (accidentType) => {
      const attachments = getDefaultAttachments()
      const answers = getFullBasicAnswers()

      answers.accidentType.radioButton = accidentType
      answers.companyInfo = undefined

      const result = utils.applicationAnswersToXml(answers, attachments)

      expect(result.includes('Fullname Fullname')).toBeTruthy()
      expect(result.includes('7654321')).toBeTruthy()
      expect(result.includes('1234564321')).toBeTruthy()
      expect(result.includes('1999-09-19')).toBeTruthy()
      expect(result.includes('Somewhere')).toBeTruthy()
      expect(result.includes('InjurcyCertDoc.pdf')).toBeTruthy()
      expect(result.includes('PoliceReportDoc.pdf')).toBeTruthy()

      expect(result.includes('Some Kid')).toBeFalsy()
      expect(result.includes('Fullername Fullername')).toBeFalsy()
      expect(result.includes('Company EHF')).toBeFalsy()
    },
  )

  it.each([
    { type: AccidentTypeEnum.HOMEACTIVITIES, fisherman: false },
    { type: AccidentTypeEnum.WORK, fisherman: false },
    { type: AccidentTypeEnum.WORK, fisherman: true },
  ])(
    'should map correctly for a person reporting an injury for themselves, injured in at home or at work, with employer involved',
    (data) => {
      const attachments = getDefaultAttachments()
      const answers = getFullBasicAnswers()

      answers.accidentType.radioButton = data.type
      answers.workMachineRadio = 'yes'
      if (data.fisherman)
        answers.workAccident.type = WorkAccidentTypeEnum.FISHERMAN

      const result = utils.applicationAnswersToXml(answers, attachments)

      expect(result.includes('Fullname Fullname')).toBeTruthy()
      expect(result.includes('7654321')).toBeTruthy()
      expect(result.includes('1234564321')).toBeTruthy()
      expect(result.includes('1999-09-19')).toBeTruthy()
      expect(result.includes('Somewhere')).toBeTruthy()
      expect(result.includes('InjurcyCertDoc.pdf')).toBeTruthy()
      expect(result.includes('PoliceReportDoc.pdf')).toBeTruthy()

      expect(result.includes('Some Kid')).toBeFalsy()
      expect(result.includes('Fullername Fullername')).toBeFalsy()

      const isHomeAccident = data.type === AccidentTypeEnum.HOMEACTIVITIES
      expect(result.includes('Company EHF')).toBe(!isHomeAccident)
      expect(result.includes('homeAccidentAddress123')).toBe(isHomeAccident)
      expect(result.includes('homeAccidentAddress123PortalCode100')).toBe(
        isHomeAccident,
      )
      expect(result.includes('wtfIsCommunityHere?Kopavogur')).toBe(
        isHomeAccident,
      )
      expect(result.includes('more detail about home accident')).toBe(
        isHomeAccident,
      )

      if (!isHomeAccident) {
        expect(result.includes('SomeShipName')).toBe(data.fisherman)
        expect(result.includes('SomeShipCharacters')).toBe(data.fisherman)
        expect(
          result.includes('description of machine that messed someone up'),
        ).toBe(!data.fisherman)
      }
    },
  )

  it.each([
    {
      for: WhoIsTheNotificationForEnum.ME,
      someoneElse: false,
      shouldHaveCompanyInfo: false,
    },
    {
      for: WhoIsTheNotificationForEnum.POWEROFATTORNEY,
      someoneElse: true,
      shouldHaveCompanyInfo: false,
    },
    {
      for: WhoIsTheNotificationForEnum.JURIDICALPERSON,
      someoneElse: true,
      shouldHaveCompanyInfo: true,
    },
    {
      for: WhoIsTheNotificationForEnum.CHILDINCUSTODY,
      someoneElse: true,
      shouldHaveCompanyInfo: false,
    },
  ])(
    'should map correctly for a person reporting an injury for themselves, someone else, juridical person, or their child, with no employer involved',
    (data) => {
      const attachments = getDefaultAttachments()
      const answers = getFullBasicAnswers()
      answers.whoIsTheNotificationFor.answer = data.for
      answers.companyInfo = undefined

      const result = utils.applicationAnswersToXml(answers, attachments)

      expect(result.includes('Fullname Fullname')).toBeTruthy()
      if (data.someoneElse) {
        data.for === WhoIsTheNotificationForEnum.CHILDINCUSTODY
          ? expect(
              result.includes('Some Kid') &&
                !result.includes('Fullername Fullername'),
            ).toBeTruthy()
          : expect(
              result.includes('Fullername Fullername') &&
                !result.includes('Some Kid'),
            ).toBeTruthy()

        data.for === WhoIsTheNotificationForEnum.JURIDICALPERSON
          ? expect(result.includes('juridicalPersonCompany')).toBeTruthy()
          : expect(result.includes('juridicalPersonCompany')).toBeFalsy()
      }
      expect(result.includes('7654321')).toBeTruthy()
      expect(result.includes('1234564321')).toBeTruthy()
      expect(result.includes('1999-09-19')).toBeTruthy()
      expect(result.includes('Somewhere')).toBeTruthy()
      expect(result.includes('InjurcyCertDoc.pdf')).toBeTruthy()
      expect(result.includes('PoliceReportDoc.pdf')).toBeTruthy()

      expect(result.includes('Company EHF')).toBeFalsy()
    },
  )
})

const createMockPartialApplication = (documentId?: number): Application =>
  ({
    externalData: {
      submitApplication: {
        data: documentId
          ? { documentId, sentDocuments: ['hello', 'there'] }
          : undefined,
      },
    },
  } as unknown as Application)

describe('getApplicationDocumentId', () => {
  it('should return a valid application submission document id', () => {
    const expectedId = 5555
    const application = createMockPartialApplication(expectedId)

    const result = utils.getApplicationDocumentId(application)
    expect(result).toEqual(expectedId)
  })

  it('should throw when there is no valid application submission document id', () => {
    const application = createMockPartialApplication(undefined)

    expect(() => utils.getApplicationDocumentId(application)).toThrowError(
      'No documentId found on application',
    )
  })
})

const getDefaultAttachments = (): AccidentNotificationAttachment[] => {
  return [
    {
      content: 'InjurcyCertDocContent',
      attachmentType: AttachmentTypeEnum.INJURY_CERTIFICATE,
      name: 'InjurcyCertDoc.pdf',
      hash: 'InjurcyCertDocHash',
    },
    {
      content: 'PoliceReportDocContent',
      attachmentType: AttachmentTypeEnum.POLICE_REPORT,
      name: 'PoliceReportDoc.pdf',
      hash: 'PoliceReportDocHash',
    },
  ]
}

const getFullBasicAnswers = (): AccidentNotificationAnswers => {
  return {
    applicant: {
      name: 'Fullname Fullname',
      nationalId: '1234564321',
      email: 'mock@mockemail.com',
      phoneNumber: '7654321',
      address: 'Bær 1',
      city: 'Reykjavik',
      postalCode: '101',
    },
    whoIsTheNotificationFor: {
      answer: WhoIsTheNotificationForEnum.ME,
    },
    childInCustody: {
      name: 'Some Kid',
      nationalId: '1234564332',
    },
    injuredPersonInformation: {
      name: 'Fullername Fullername',
      nationalId: '1234564322',
      email: 'mockmock@mockemail.com',
      phoneNumber: '7654322',
      jobTitle: '',
    },
    accidentType: {
      radioButton: AccidentTypeEnum.SPORTS,
    },
    accidentDetails: {
      dateOfAccident: '1999-09-19',
      timeOfAccident: '18:00:00',
      descriptionOfAccident: 'Hurt',
      accidentSymptoms: 'Pain',
      isHealthInsured: 'yes',
      dateOfDoctorVisit: '',
      timeOfDoctorVisit: '',
    },
    homeAccident: {
      address: 'homeAccidentAddress123',
      postalCode: 'homeAccidentAddress123PortalCode100',
      community: 'wtfIsCommunityHere?Kopavogur',
      moreDetails: 'more detail about home accident',
    },
    workAccident: {
      type: WorkAccidentTypeEnum.GENERAL,
      jobTitle: '',
    },
    wasTheAccidentFatal: 'no',
    carAccidentHindrance: 'no',
    'locationAndPurpose?': {
      location: 'Somewhere',
    },
    accidentLocation: {
      answer: StudiesAccidentLocationEnum.OTHER,
    },
    shipLocation: {
      answer: FishermanWorkplaceAccidentShipLocationEnum.SAILINGORFISHING,
    },
    fishingShipInfo: {
      shipName: 'SomeShipName',
      shipCharacters: 'SomeShipCharacters',
      homePort: 'SomeHomePort',
      shipRegisterNumber: 'ShomeShipRegNr123',
    },
    workMachineRadio: 'yes',
    workMachine: {
      descriptionOfMachine: 'description of machine that messed someone up',
    },
    companyInfo: {
      nationalRegistrationId: '7654324321',
      name: 'Company EHF',
    },
    representative: {
      name: 'Some Guy',
      nationalId: '6543214321',
      email: 'rep@mockemail.com',
      phoneNumber: '1111111',
    },
    approveExternalData: false,
    externalData: {
      nationalRegistry: {
        status: 'success',
        data: {
          nationalId: '',
          address: {
            locality: '',
            municipalityCode: '',
            postalCode: '',
            streetAddress: '',
          },
          age: 0,
          citizenship: {
            code: '',
            name: '',
          },
          fullName: '',
        },
        date: '',
      },
      userProfile: {
        data: {
          email: '',
          mobilePhoneNumber: '',
        },
      },
    },
    info: {
      onBehalf: OnBehalf.MYSELF,
    },
    timePassedHindrance: 'yes',
    injuryCertificate: {
      answer: AttachmentsEnum.INJURYCERTIFICATE,
    },
    additionalAttachments: {
      answer: AttachmentsEnum.ADDITIONALLATER,
    },
    attachments: {},
    fatalAccidentUploadDeathCertificateNow: 'yes',
    onPayRoll: {
      answer: 'yes',
    },
    studiesAccident: {
      type: StudiesAccidentTypeEnum.INTERNSHIP,
    },
    juridicalPerson: {
      companyName: 'juridicalPersonCompany',
      companyNationalId: '7777778888',
      companyConfirmation: [],
    },
    powerOfAttorney: {
      type: PowerOfAttorneyUploadEnum.UPLOADLATER,
    },
    reviewApproval: ReviewApprovalEnum.NOTREVIEWED,
  } as unknown as AccidentNotificationAnswers
}
