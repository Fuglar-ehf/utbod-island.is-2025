import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import {
  ApplicationTypes,
  NationalRegistryIndividual,
} from '@island.is/application/types'

import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import { mapStringToEnum } from '@island.is/university-gateway'
import {
  ProgramApi,
  UniversityApi,
  ApplicationApi,
  CreateApplicationDtoModeOfDeliveryEnum,
} from '@island.is/clients/university-gateway-api'

import { UniversityAnswers } from '@island.is/application/templates/university'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'

@Injectable()
export class UniversityService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly nationalRegistryApi: NationalRegistryClientService,
    private readonly programApi: ProgramApi,
    private readonly universityApi: UniversityApi,
    private readonly universityApplicationApi: ApplicationApi,
  ) {
    super(ApplicationTypes.UNIVERSITY)
  }

  private universityApplicationApiWithAuth(auth: Auth) {
    return this.universityApplicationApi.withMiddleware(
      new AuthMiddleware(auth),
    )
  }

  async getUniversities({ application, auth }: TemplateApiModuleActionProps) {
    const res = await this.universityApi.universityControllerGetUniversities()
    return res.data
  }

  async getPrograms({ application, auth }: TemplateApiModuleActionProps) {
    const res = await this.programApi.programControllerGetPrograms({
      active: true,
    })

    return res.data.map((item) => ({
      active: item.active,
      id: item.id,
      externalId: item.externalId,
      nameIs: item.nameIs,
      nameEn: item.nameEn,
      specializationExternalId: item.specializationExternalId,
      specializationNameIs: item.specializationNameIs,
      specializationNameEn: item.specializationNameEn,
      universityId: item.universityId,
      universityContentfulKey: item.universityDetails.contentfulKey,
      departmentNameIs: item.departmentNameIs,
      departmentNameEn: item.departmentNameEn,
      startingSemesterYear: item.startingSemesterYear,
      startingSemesterSeason: item.startingSemesterSeason.toString(),
      applicationStartDate: item.applicationStartDate,
      applicationEndDate: item.applicationEndDate,
      schoolAnswerDate: item.schoolAnswerDate,
      studentAnswerDate: item.studentAnswerDate,
      degreeType: item.degreeType.toString(),
      degreeAbbreviation: item.degreeAbbreviation,
      credits: item.credits,
      descriptionIs: item.descriptionIs,
      descriptionEn: item.descriptionEn,
      durationInYears: item.durationInYears,
      costPerYear: item.costPerYear,
      iscedCode: item.iscedCode,
      modeOfDelivery: item.modeOfDelivery,
    }))
  }

  async addSchoolAcceptance({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    return
  }

  async validateApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    return
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const answers = application.answers as UniversityAnswers
    const userFromAnswers = answers.userInformation
    const externalData = application.externalData
    const nationalRegistryUser = externalData.individual
      .data as NationalRegistryIndividual
    const user = {
      givenName: nationalRegistryUser.givenName || '',
      middleName: '',
      familyName: nationalRegistryUser.familyName || '',
      genderCode: nationalRegistryUser.genderCode,
      citizenshipCode: nationalRegistryUser.citizenship?.code || '',
      streetAddress: nationalRegistryUser.address?.streetAddress || '',
      postalCode: nationalRegistryUser.address?.postalCode || '',
      city: nationalRegistryUser.address?.city || '', // TODO what to use then?
      municipalityCode: nationalRegistryUser.address?.municipalityCode || '',
      countryCode: '', // TODO get this from residenceHistory in dataProvider
      email: userFromAnswers.email,
      phone: userFromAnswers.phone,
    }

    const createApplicationDto = {
      createApplicationDto: {
        applicationId: application.id,
        universityId: answers.programInformation.university,
        programId: answers.programInformation.program,
        modeOfDelivery: mapStringToEnum(
          answers.programInformation.modeOfDelivery,
          CreateApplicationDtoModeOfDeliveryEnum,
        ),
        applicant: user,
        educationList: answers.educationDetails.map((education) => {
          return {
            schoolName: education.school,
            degree: education.degreeLevel,
          }
        }),
        workExperienceList: [],
        extraFieldList: [],
      },
    }
    await this.universityApplicationApiWithAuth(
      auth,
    ).universityApplicationControllerCreateApplication(createApplicationDto)
  }
}
