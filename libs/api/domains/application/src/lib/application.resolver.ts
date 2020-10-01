import { Args, Query, Resolver, Mutation } from '@nestjs/graphql'
import { ApplicationService } from './application.service'
import { Application } from './application.model'
import { GetApplicationsByTypeInput } from './dto/getApplicationsByType.input'
import { GetApplicationInput } from './dto/getApplication.input'
import { CreateApplicationInput } from './dto/createApplication.input'
import { UpdateApplicationInput } from './dto/updateApplication.input'
import { UpdateApplicationExternalDataInput } from './dto/updateApplicationExternalData.input'
import { AddAttachmentInput } from './dto/addAttachment.input'
import { DeleteAttachmentInput } from './dto/deleteAttachment.input'
import { SubmitApplicationInput } from './dto/submitApplication.input'
import { GetApplicationsByUserInput } from './dto/getApplicationByUser.input'

@Resolver()
export class ApplicationResolver {
  constructor(private applicationService: ApplicationService) {}

  @Query(() => Application, { nullable: true })
  async getApplication(
    @Args('input') input: GetApplicationInput,
  ): Promise<Application> {
    return this.applicationService.findOne(input.id)
  }

  @Query(() => [Application], { nullable: true })
  async getApplicationsByType(
    @Args('input') input: GetApplicationsByTypeInput,
  ): Promise<Application[] | null> {
    return this.applicationService.findAllByType(input.typeId)
  }

  @Query(() => [Application], { nullable: true })
  async getApplicationsByApplicant(
    @Args('input') input: GetApplicationsByUserInput,
  ): Promise<Application[] | null> {
    return this.applicationService.findAllByApplicant(input)
  }

  @Query(() => [Application], { nullable: true })
  async getApplicationsByAssignee(
    @Args('input') input: GetApplicationsByUserInput,
  ): Promise<Application[] | null> {
    return this.applicationService.findAllByAssignee(input)
  }

  @Mutation(() => Application, { nullable: true })
  async createApplication(
    @Args('input') input: CreateApplicationInput,
  ): Promise<Application> {
    return this.applicationService.create(input)
  }

  @Mutation(() => Application, { nullable: true })
  async updateApplication(
    @Args('input') input: UpdateApplicationInput,
  ): Promise<Application> {
    return this.applicationService.update(input)
  }

  @Mutation(() => Application, { nullable: true })
  updateApplicationExternalData(
    @Args('input') input: UpdateApplicationExternalDataInput,
  ): Promise<Application | void> {
    return this.applicationService.updateExternalData(input)
  }

  @Mutation(() => Application, { nullable: true })
  async addAttachment(
    @Args('input') input: AddAttachmentInput,
  ): Promise<Application> {
    return this.applicationService.addAttachment(input)
  }

  @Mutation(() => Application, { nullable: true })
  async deleteAttachment(
    @Args('input') input: DeleteAttachmentInput,
  ): Promise<Application> {
    return this.applicationService.deleteAttachment(input)
  }

  @Mutation(() => Application, { nullable: true })
  async submitApplication(
    @Args('input') input: SubmitApplicationInput,
  ): Promise<Application> {
    return this.applicationService.submitApplication(input)
  }
}
