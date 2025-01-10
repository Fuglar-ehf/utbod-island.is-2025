import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { SchoolsApi, ApplicationsApi, StudentsApi } from '../../gen/fetch/apis'
import {
  Application,
  Program,
  SecondarySchool,
  Student,
} from './secondarySchoolClient.types'

@Injectable()
export class SecondarySchoolClient {
  constructor(
    private readonly applicationsApi: ApplicationsApi,
    private readonly schoolsApi: SchoolsApi,
    private readonly studentsApi: StudentsApi,
  ) {}

  private applicationsApiWithAuth(auth: Auth) {
    return this.applicationsApi.withMiddleware(new AuthMiddleware(auth))
  }

  private schoolsApiWithAuth(auth: Auth) {
    return this.schoolsApi.withMiddleware(new AuthMiddleware(auth))
  }

  private studentsApiWithAuth(auth: Auth) {
    return this.studentsApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getStudentInfo(auth: User): Promise<Student> {
    const studentInfo = await this.studentsApiWithAuth(auth).v1StudentsInfoGet()
    return { isFreshman: studentInfo?.isFreshman || false }
  }

  async getSchools(auth: User): Promise<SecondarySchool[]> {
    const res = await this.schoolsApiWithAuth(auth).v1SchoolsGet({
      rowOffset: undefined,
      fetchSize: undefined,
    })

    return res.map((school) => ({
      id: school.schoolId || '',
      name: school.name || '',
      thirdLanguages:
        school.thirdLanguages?.map((language) => ({
          code: language.code || '',
          name: language.name || '',
        })) || [],
      nordicLanguages:
        school.nordicLanguages?.map((language) => ({
          code: language.code || '',
          name: language.name || '',
        })) || [],
      allowRequestDormitory: school.availableDormitory || false,
    }))
  }

  async getPrograms(
    auth: User,
    schoolId: string,
    isFreshman: boolean,
  ): Promise<Program[]> {
    const res = await this.schoolsApiWithAuth(
      auth,
    ).v1SchoolsSchoolIdProgrammesGet({
      schoolId,
      onlyFreshmenEnabled: isFreshman,
      rowOffset: undefined,
      fetchSize: undefined,
    })

    return res.map((program) => ({
      id: program.id || '',
      nameIs: `${program.title || ''} - ${program.code}`,
      nameEn: `${program.titleEnglish || ''} - ${program.code}`,
      registrationEndDate: program.registryEndDate || new Date(),
    }))
  }

  async validateCanCreate(auth: User): Promise<boolean> {
    const studentInfo = await this.studentsApiWithAuth(auth).v1StudentsInfoGet()
    return !studentInfo?.hasActiveApplication
  }

  async delete(auth: User, externalId: string): Promise<void> {
    return this.applicationsApiWithAuth(auth).v1ApplicationsApplicationIdDelete(
      {
        applicationId: externalId,
      },
    )
  }

  async create(auth: User, application: Application): Promise<string> {
    const applicationBaseDto = {
      applicantNationalId: application.nationalId,
      applicantName: application.name,
      isFreshman: application.isFreshman,
      phoneNumber: application.phone,
      email: application.email,
      placeOfResidence: application.address,
      postCode: application.postalCode,
      municipality: application.city,
      nextOfKin: application.contacts.map((contact) => ({
        nationalId: contact.nationalId,
        phoneNumber: contact.phone,
        name: contact.name,
        email: contact.email,
        address: contact.address,
        postCode: contact.postalCode,
      })),
      speakingLanguage: application.nativeLanguageCode,
      otherInformation: application.otherDescription,
      applicationChoices: application.schools.map((school) => ({
        priority: school.priority,
        schoolId: school.schoolId,
        programmeChoice: school.programs.map((program) => ({
          priority: program.priority,
          programmeId: program.programId,
        })),
        thirdLanguage: school.thirdLanguageCode,
        northernLanguage: school.nordicLanguageCode,
        requestDormitory: school.requestDormitory,
      })),
      attachments: application.attachments,
    }

    const result = await this.applicationsApiWithAuth(auth).v1ApplicationsPost({
      applicationBaseDto,
    })

    return result.id || ''
  }
}
