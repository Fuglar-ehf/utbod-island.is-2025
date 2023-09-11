import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import {
  ApplicantChildCustodyInformation,
  ApplicationTypes,
  InstitutionNationalIds,
  NationalRegistryBirthplace,
} from '@island.is/application/types'
import * as kennitala from 'kennitala'
import { TemplateApiError } from '@island.is/nest/problem'
import {
  getChargeItemCodes,
  CitizenshipAnswers,
  SpouseIndividual,
  CitizenIndividual,
  error as errorMessages,
} from '@island.is/application/templates/directorate-of-immigration/citizenship'
import {
  Country,
  CountryOfResidence,
  DirectorateOfImmigrationClient,
  ForeignCriminalRecordFile,
  Passport,
  ResidenceCondition,
  StayAbroad,
  TravelDocumentType,
} from '@island.is/clients/directorate-of-immigration'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import { coreErrorMessages, YES } from '@island.is/application/core'

@Injectable()
export class CitizenshipService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly directorateOfImmigrationClient: DirectorateOfImmigrationClient,
    private readonly nationalRegistryApi: NationalRegistryClientService,
  ) {
    super(ApplicationTypes.CITIZENSHIP)
  }

  async createCharge({ application, auth }: TemplateApiModuleActionProps) {
    try {
      const answers = application.answers as CitizenshipAnswers

      const chargeItemCodes = getChargeItemCodes(answers)

      const result = this.sharedTemplateAPIService.createCharge(
        auth,
        application.id,
        InstitutionNationalIds.UTLENDINGASTOFNUN,
        chargeItemCodes,
      )
      return result
    } catch (exeption) {
      return { id: '', paymentUrl: '' }
    }
  }

  async getResidenceConditions({
    auth,
  }: TemplateApiModuleActionProps): Promise<ResidenceCondition[]> {
    return this.directorateOfImmigrationClient.getCitizenshipResidenceConditions(
      auth,
    )
  }

  async getCountries(): Promise<Country[]> {
    return this.directorateOfImmigrationClient.getCountries()
  }

  async getTravelDocumentTypes(): Promise<TravelDocumentType[]> {
    return this.directorateOfImmigrationClient.getTravelDocumentTypes()
  }

  async getOldCountryOfResidenceList({
    auth,
  }: TemplateApiModuleActionProps): Promise<CountryOfResidence[]> {
    return this.directorateOfImmigrationClient.getOldCountryOfResidenceList(
      auth,
    )
  }

  async getOldStayAbroadList({
    auth,
  }: TemplateApiModuleActionProps): Promise<StayAbroad[]> {
    return this.directorateOfImmigrationClient.getOldStayAbroadList(auth)
  }

  async getOldPassportItem({
    auth,
  }: TemplateApiModuleActionProps): Promise<Passport | undefined> {
    return this.directorateOfImmigrationClient.getOldPassportItem(auth)
  }

  async getOldForeignCriminalRecordFileList({
    auth,
  }: TemplateApiModuleActionProps): Promise<ForeignCriminalRecordFile[]> {
    return this.directorateOfImmigrationClient.getOldForeignCriminalRecordFileList(
      auth,
    )
  }

  async getNationalRegistryIndividual({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<CitizenIndividual | null> {
    const individual = await this.getIndividualDetails(auth.nationalId)
    if (individual)
      individual.residenceInIcelandLastChangeDate =
        await this.getResidenceInIcelandLastChangeDate(auth.nationalId)
    return individual
  }

  private async getIndividualDetails(
    nationalId: string,
  ): Promise<CitizenIndividual | null> {
    // get basic information about indiviual
    const person = await this.nationalRegistryApi.getIndividual(nationalId)

    // get information about indiviual citizenship
    const citizenship = await this.nationalRegistryApi.getCitizenship(
      nationalId,
    )

    // TODOx add back when we have Gervimenn not with IS citizenship
    // // dont allow user to continue if already has icelandic citizenship
    // const citizenshipIceland = 'IS'
    // if (citizenship?.countryCode === citizenshipIceland) {
    //   throw new TemplateApiError(
    //     {
    //       title: errorMessages.alreadyIcelandicCitizen,
    //       summary: errorMessages.alreadyIcelandicCitizen,
    //     },
    //     404,
    //   )
    // }

    // get marital title
    const cohabitationInfo = await this.nationalRegistryApi.getCohabitationInfo(
      nationalId,
    )
    const genderCodeValue =
      person && cohabitationInfo
        ? await this.nationalRegistryApi.getCohabitionCodeValue(
            cohabitationInfo?.cohabitationCode,
            person?.genderCode,
          )
        : null

    return (
      person && {
        nationalId: person.nationalId,
        givenName: person.givenName,
        familyName: person.familyName,
        fullName: person.name,
        age: kennitala.info(person.nationalId).age,
        citizenship: citizenship && {
          code: citizenship.countryCode,
          name: citizenship.countryName,
        },
        address: person.legalDomicile && {
          streetAddress: person.legalDomicile.streetAddress,
          postalCode: person.legalDomicile.postalCode,
          locality: person.legalDomicile.locality,
          city: person.legalDomicile.locality,
          municipalityCode: person.legalDomicile.municipalityNumber,
        },
        genderCode: person.genderCode,
        maritalTitle: {
          code: genderCodeValue?.code,
          description: genderCodeValue?.description,
        },
      }
    )
  }

  private async getResidenceInIcelandLastChangeDate(
    nationalId: string,
  ): Promise<Date | null> {
    // get residence history
    const residenceHistory = await this.nationalRegistryApi.getResidenceHistory(
      nationalId,
    )

    // sort residence history so newest items are first, and if two items have the same date,
    // then the Iceland item will be first
    const countryIceland = 'IS'
    const sortedResidenceHistory = residenceHistory
      .filter((x) => x.dateOfChange)
      .sort((a, b) =>
        a.dateOfChange !== b.dateOfChange
          ? a.dateOfChange! > b.dateOfChange!
            ? -1
            : 1
          : a.country === countryIceland
          ? -1
          : 1,
      )

    // get the oldest change date for Iceland, where user did not move to another
    // country in between
    let lastChangeDate: Date | null = null
    for (let i = 0; i < sortedResidenceHistory.length; i++) {
      if (sortedResidenceHistory[i].country === countryIceland) {
        lastChangeDate = sortedResidenceHistory[i].dateOfChange
      } else {
        break
      }
    }

    if (!lastChangeDate) {
      throw new TemplateApiError(
        {
          title: errorMessages.residenceInIcelandLastChangeDateMissing,
          summary: errorMessages.residenceInIcelandLastChangeDateMissing,
        },
        404,
      )
    }

    return lastChangeDate
  }

  async getNationalRegistrySpouseDetails({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<SpouseIndividual | null> {
    const { nationalId } = auth

    // get cohabitation information
    const cohabitationInfo = await this.nationalRegistryApi.getCohabitationInfo(
      nationalId,
    )

    // get spouse's birthplace
    const spouseBirthplace =
      cohabitationInfo &&
      (await this.getBirthplace(cohabitationInfo.spouseNationalId))

    return (
      cohabitationInfo && {
        nationalId: cohabitationInfo.spouseNationalId,
        name: cohabitationInfo.spouseName,
        maritalStatus: cohabitationInfo.cohabitationCode,
        lastModified: cohabitationInfo.lastModified,
        spouseBirthplace: spouseBirthplace,
        spouse: await this.getIndividualDetails(
          cohabitationInfo.spouseNationalId,
        ),
      }
    )
  }

  private async getBirthplace(
    nationalId: string,
  ): Promise<NationalRegistryBirthplace | null> {
    const birthplace = await this.nationalRegistryApi.getBirthplace(nationalId)

    if (!birthplace?.locality) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.nationalRegistryBirthplaceMissing,
          summary: coreErrorMessages.nationalRegistryBirthplaceMissing,
        },
        404,
      )
    }

    return (
      birthplace && {
        dateOfBirth: birthplace.birthdate,
        location: birthplace.locality,
        municipalityCode: birthplace.municipalityNumber,
      }
    )
  }

  async validateApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    const answers = application.answers as CitizenshipAnswers

    const residenceConditionList =
      await this.directorateOfImmigrationClient.getCitizenshipResidenceConditions(
        auth,
      )

    // throw error in case the residence condition list changed since prerequisite step and
    // user does not fulfill any other condition
    if (
      residenceConditionList.length === 0 &&
      answers.parentInformation?.hasValidParents !== YES &&
      answers.formerIcelander !== YES
    ) {
      throw new TemplateApiError(
        {
          title: errorMessages.noResidenceConditionPossible,
          summary: errorMessages.noResidenceConditionPossible,
        },
        400,
      )
    }
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const { paymentUrl } = application.externalData.createCharge.data as {
      paymentUrl: string
    }
    if (!paymentUrl) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    const isPayment: { fulfilled: boolean } | undefined =
      await this.sharedTemplateAPIService.getPaymentStatus(auth, application.id)

    if (!isPayment?.fulfilled) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    const answers = application.answers as CitizenshipAnswers
    const individual = application.externalData.individual.data as
      | CitizenIndividual
      | undefined
    const nationalRegistryBirthplace = application.externalData
      .nationalRegistryBirthplace.data as NationalRegistryBirthplace | undefined
    const spouseDetails = application.externalData.spouseDetails.data as
      | SpouseIndividual
      | undefined
    const childrenCustodyInformation = application.externalData
      .childrenCustodyInformation.data as
      | ApplicantChildCustodyInformation[]
      | undefined
    const applicantPassport = answers.passport
    const filteredCountriesOfResidence =
      answers.countriesOfResidence?.hasLivedAbroad == YES &&
      answers.countriesOfResidence?.selectedAbroadCountries
        ?.filter((c) => c.wasRemoved !== 'true')
        ?.map((c) => ({
          countryId: parseInt(c.countryId),
        }))
    const filteredStaysAbroad =
      answers.staysAbroad?.hasStayedAbroad == YES &&
      answers.staysAbroad?.selectedAbroadCountries
        ?.filter((s) => s.wasRemoved !== 'true')
        ?.map((s) => ({
          countryId: parseInt(s.countryId),
          dateFrom: s.dateFrom ? new Date(s.dateFrom) : undefined,
          dateTo: s.dateTo ? new Date(s.dateTo) : undefined,
          purpose: s.purpose,
        }))
    const filteredParents =
      answers.parentInformation?.hasValidParents == YES &&
      answers.parentInformation?.parents
        ?.filter((p) => p.nationalId && p.wasRemoved !== 'true')
        ?.map((p) => ({
          nationalId: p.nationalId!,
          givenName: p.givenName,
          familyName: p.familyName,
        }))
    const criminalRecordListFlattened = []
    const criminalRecordList =
      answers.supportingDocuments?.criminalRecordList || []
    for (let i = 0; i < criminalRecordList.length; i++) {
      const countryId = criminalRecordList[i].countryId
      if (countryId) {
        const fileList = criminalRecordList[i].file || []
        for (let j = 0; j < fileList.length; j++) {
          criminalRecordListFlattened.push({
            countryId: parseInt(countryId),
            base64: fileList[j],
          })
        }
      }
    }

    if (!applicantPassport) {
      throw new Error('Ekki er búið að skrá upplýsingar um vegabréf umsækjanda')
    }

    // Submit the application
    await this.directorateOfImmigrationClient.submitApplicationForCitizenship(
      auth,
      {
        selectedChildren: answers.selectedChildren || [],
        isFormerIcelandicCitizen: answers.formerIcelander === YES,
        givenName: individual?.givenName,
        familyName: individual?.familyName,
        fullName: individual?.fullName,
        address: individual?.address?.streetAddress,
        postalCode: individual?.address?.postalCode,
        city: individual?.address?.city,
        email: answers.userInformation?.email,
        phone: answers.userInformation?.phone,
        citizenshipCode: individual?.citizenship?.code,
        residenceInIcelandLastChangeDate:
          individual?.residenceInIcelandLastChangeDate,
        birthCountry: nationalRegistryBirthplace?.location,
        maritalStatusCode: spouseDetails?.maritalStatus,
        dateOfMaritalStatus: spouseDetails?.lastModified,
        spouse: spouseDetails?.nationalId
          ? {
              nationalId: spouseDetails.nationalId!,
              givenName: spouseDetails.spouse?.givenName,
              familyName: spouseDetails.spouse?.familyName,
              birthCountry: spouseDetails.spouseBirthplace?.location,
              citizenshipCode: spouseDetails.spouse?.citizenship?.code,
              address: spouseDetails.spouse?.address?.streetAddress,
              reasonDifferentAddress: answers.maritalStatus?.explanation,
            }
          : undefined,
        parents: filteredParents || [],
        countriesOfResidence: filteredCountriesOfResidence || [],
        staysAbroad: filteredStaysAbroad || [],
        passport: {
          dateOfIssue: new Date(applicantPassport.publishDate),
          dateOfExpiry: new Date(applicantPassport.expirationDate),
          passportNumber: applicantPassport.passportNumber,
          passportTypeId: parseInt(applicantPassport.passportTypeId),
          countryOfIssuerId: parseInt(applicantPassport.countryOfIssuerId),
          file: applicantPassport.file?.map((file) => ({ base64: file })) || [],
        },
        supportingDocuments: {
          birthCertificate: answers.supportingDocuments?.birthCertificate?.map(
            (file) => ({ base64: file }),
          ),
          subsistenceCertificate:
            answers.supportingDocuments?.subsistenceCertificate?.map(
              (file) => ({
                base64: file,
              }),
            ) || [],
          subsistenceCertificateForTown:
            answers.supportingDocuments?.subsistenceCertificateForTown?.map(
              (file) => ({ base64: file }),
            ) || [],
          certificateOfLegalResidenceHistory:
            answers.supportingDocuments?.certificateOfLegalResidenceHistory?.map(
              (file) => ({ base64: file }),
            ) || [],
          icelandicTestCertificate:
            answers.supportingDocuments?.icelandicTestCertificate?.map(
              (file) => ({
                base64: file,
              }),
            ) || [],
          criminalRecordList: criminalRecordListFlattened,
        },
        children:
          childrenCustodyInformation?.map((c) => ({
            nationalId: c.nationalId,
            fullName: c.fullName,
          })) || [],
        childrenPassport:
          answers.childrenPassport?.map((p) => ({
            nationalId: p.nationalId,
            dateOfIssue: new Date(p.publishDate),
            dateOfExpiry: new Date(p.expirationDate),
            passportNumber: p.passportNumber,
            passportTypeId: parseInt(p.passportTypeId),
            countryIdOfIssuer: parseInt(p.countryOfIssuerId),
            file: p.file?.map((file) => ({ base64: file })) || [],
          })) || [],
        childrenSupportingDocuments:
          answers.childrenSupportingDocuments?.map((d) => ({
            nationalId: d.nationalId,
            birthCertificate:
              d.birthCertificate?.map((file) => ({
                base64: file,
              })) || [],
            writtenConsentFromChild:
              d.writtenConsentFromChild?.map((file) => ({
                base64: file,
              })) || [],
            writtenConsentFromOtherParent:
              d.writtenConsentFromOtherParent?.map((file) => ({
                base64: file,
              })) || [],
            custodyDocuments:
              d.custodyDocuments?.map((file) => ({
                base64: file,
              })) || [],
          })) || [],
      },
    )
  }
}
