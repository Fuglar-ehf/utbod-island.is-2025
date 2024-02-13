import { Injectable } from '@nestjs/common'
import {
  ApplicationApi,
  ProgramApi,
  University,
  UniversityApi,
} from '@island.is/clients/university-gateway-api'
import {
  UniversityGatewayGetPogramInput,
  UniversityGatewayProgramsPaginated,
} from './graphql/dto'
import {
  UniversityGatewayProgramDetails,
  UniversityGatewayProgramFilter,
  UniversityGatewayUniversity,
} from './graphql/models'
import {
  DegreeType,
  ModeOfDelivery,
  Season,
  ProgramStatus,
} from '@island.is/university-gateway'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'

@Injectable()
export class UniversityGatewayApi {
  constructor(
    private readonly programApi: ProgramApi,
    private readonly universityApi: UniversityApi,
    private readonly universityApplicationApi: ApplicationApi,
  ) {}

  private universityApplicationApiWithAuth(auth: Auth) {
    return this.universityApplicationApi.withMiddleware(
      new AuthMiddleware(auth),
    )
  }

  async getActivePrograms(): Promise<UniversityGatewayProgramsPaginated> {
    const res = await this.programApi.programControllerGetPrograms({
      active: true,
    })

    return {
      totalCount: res.totalCount,
      pageInfo: res.pageInfo,
      data: res.data.map((item) => ({
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
        modeOfDelivery: item.modeOfDelivery.map((m) =>
          m.modeOfDelivery.toString(),
        ),
      })),
    }
  }

  async getProgramById(
    input: UniversityGatewayGetPogramInput,
  ): Promise<UniversityGatewayProgramDetails> {
    const item = await this.programApi.programControllerGetProgramById({
      id: input.id,
    })

    return {
      id: item.id,
      externalId: item.externalId,
      active: item.active,
      nameIs: item.nameIs,
      nameEn: item.nameEn,
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
      modeOfDelivery: item.modeOfDelivery.map((m) =>
        m.modeOfDelivery.toString(),
      ),
      externalUrlIs: item.externalUrlIs,
      externalUrlEn: item.externalUrlEn,
      admissionRequirementsIs: item.admissionRequirementsIs,
      admissionRequirementsEn: item.admissionRequirementsEn,
      studyRequirementsIs: item.studyRequirementsIs,
      studyRequirementsEn: item.studyRequirementsEn,
      costInformationIs: item.costInformationIs,
      costInformationEn: item.costInformationEn,
      allowException: item.allowException,
      allowThirdLevelQualification: item.allowThirdLevelQualification,
      courses: item.courses.map((c) => ({
        id: c.details.id,
        externalId: c.details.externalId,
        nameIs: c.details.nameIs,
        nameEn: c.details.nameEn,
        credits: c.details.credits,
        descriptionIs: c.details.descriptionIs,
        descriptionEn: c.details.descriptionEn,
        externalUrlIs: c.details.externalUrlIs,
        externalUrlEn: c.details.externalUrlEn,
        requirement: c.requirement.toString(),
        semesterYear: c.semesterYear,
        semesterYearNumber: c.semesterYear
          ? item.startingSemesterYear - c.semesterYear + 1
          : undefined,
        semesterSeason: c.semesterSeason.toString(),
      })),
      extraApplicationFields: item.extraApplicationFields,
    }
  }

  async getUniversities(): Promise<UniversityGatewayUniversity[]> {
    const res = await this.universityApi.universityControllerGetUniversities()
    return res.data
  }

  async getUniversityApplicationById(auth: Auth, id: string) {
    const results = await this.universityApplicationApiWithAuth(
      auth,
    ).universityApplicationControllerGetApplicationById({
      id: id,
    })

    return {
      id: results.id,
      nationalId: results.nationalId,
    }
  }

  async getProgramFilters(): Promise<UniversityGatewayProgramFilter[]> {
    return [
      {
        field: 'applicationStatus',
        options: Object.values(ProgramStatus),
      },
      {
        field: 'degreeType',
        options: Object.values(DegreeType),
      },
      {
        field: 'startingSemesterSeason',
        options: Object.values(Season),
      },
      {
        field: 'modeOfDelivery',
        options: Object.values([
          ModeOfDelivery.ON_SITE,
          ModeOfDelivery.REMOTE,
          ModeOfDelivery.ONLINE,
          ModeOfDelivery.MIXED,
        ]),
      },
      {
        field: 'universityId',
        options: (
          await this.universityApi.universityControllerGetUniversities()
        ).data.map((item: University) => item.id),
      },
    ]
  }
}
