import { Injectable, Inject } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApolloError } from '@apollo/client'
import { handle4xx } from '../../utils/errorHandler'
import {
  FormApplicantTypesApi,
  FormApplicantTypesControllerCreateRequest,
  FormApplicantTypesControllerDeleteRequest,
  FormApplicantTypesControllerUpdateRequest,
} from '@island.is/clients/form-system'
import {
  CreateApplicantInput,
  DeleteApplicantInput,
  UpdateApplicantInput,
} from '../../dto/applicant.input'
import { Applicant } from '../../models/applicant.model'

@Injectable()
export class ApplicantsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private formApplicantTypesApi: FormApplicantTypesApi,
  ) {}

  // eslint-disable-next-line
  handleError(error: any, errorDetail?: string): ApolloError | null {
    const err = {
      error: JSON.stringify(error),
      category: 'forms-service',
    }
    this.logger.error(errorDetail || 'Error in applicants service', err)

    throw new ApolloError(error.message)
  }

  private applicantsApiWithAuth(auth: User) {
    return this.formApplicantTypesApi.withMiddleware(new AuthMiddleware(auth))
  }

  async createApplicant(
    auth: User,
    input: CreateApplicantInput,
  ): Promise<Applicant> {
    const response = await this.applicantsApiWithAuth(auth)
      .formApplicantTypesControllerCreate(
        input as FormApplicantTypesControllerCreateRequest,
      )
      .catch((e) =>
        handle4xx(e, this.handleError, 'failed to create applicant'),
      )

    if (!response || response instanceof ApolloError) {
      return {}
    }
    return response as Applicant
  }

  async deleteApplicant(
    auth: User,
    input: DeleteApplicantInput,
  ): Promise<void> {
    const response = await this.applicantsApiWithAuth(auth)
      .formApplicantTypesControllerDelete(
        input as FormApplicantTypesControllerDeleteRequest,
      )
      .catch((e) =>
        handle4xx(e, this.handleError, 'failed to delete applicant'),
      )

    if (!response || response instanceof ApolloError) {
      return
    }
    return response
  }

  async updateApplicant(
    auth: User,
    input: UpdateApplicantInput,
  ): Promise<void> {
    const response = await this.applicantsApiWithAuth(auth)
      .formApplicantTypesControllerUpdate(
        input as FormApplicantTypesControllerUpdateRequest,
      )
      .catch((e) =>
        handle4xx(e, this.handleError, 'failed to update applicant'),
      )

    if (!response || response instanceof ApolloError) {
      return
    }
    return response
  }
}
