import { Args, Resolver, Mutation } from '@nestjs/graphql'
import { CommunicationsService } from './communications.service'
import { ContactUsInput } from './dto/contactUs.input'
import { TellUsAStoryInput } from './dto/tellUsAStory.input'
import { CommunicationResponse } from './models/communicationResponse.model'

@Resolver()
export class CommunicationsResolver {
  constructor(private readonly communicationsService: CommunicationsService) {}

  @Mutation(() => CommunicationResponse)
  async contactUs(
    @Args('input') input: ContactUsInput,
  ): Promise<CommunicationResponse> {
    await this.communicationsService.sendEmail(input)
    return {
      sent: true,
    }
  }

  @Mutation(() => CommunicationResponse)
  async tellUsAStory(
    @Args('input') input: TellUsAStoryInput,
  ): Promise<CommunicationResponse> {
    await this.communicationsService.sendEmail(input)
    return {
      sent: true,
    }
  }
}
