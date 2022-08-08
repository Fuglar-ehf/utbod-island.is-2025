import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { MailchimpSubscribeResponse } from './models/mailchimpSubscribeResponse.model'
import { MailchimpSubscribeInput } from './dto/mailchimpSubscribe.input'
import axios from 'axios'
import { CmsContentfulService } from '@island.is/cms'
import { Injectable } from '@nestjs/common'
import { Category } from './mailchimp.types'

@Resolver()
@Injectable()
export class MailchimpResolver {
  constructor(private readonly cmsContentfulService: CmsContentfulService) {}

  @Mutation(() => MailchimpSubscribeResponse)
  async mailchimpSubscribe(
    @Args('input') input: MailchimpSubscribeInput,
  ): Promise<MailchimpSubscribeResponse> {
    const mailingListSignupSlice = await this.cmsContentfulService.getMailingListSignupSlice(
      {
        id: input.signupID,
      },
    )
    const url = mailingListSignupSlice?.signupUrl ?? ''

    if (!url.includes('{{EMAIL}}')) {
      return {
        subscribed: false,
      }
    }

    const selectedCategories = mailingListSignupSlice?.categories
      ? (JSON.parse(
          mailingListSignupSlice?.categories,
        ) as Category[]).filter((category, idx) =>
          input.categories?.includes(idx),
        )
      : []

    const populatedUrl = url
      .replace('{{EMAIL}}', input.email)
      .replace('{{NAME}}', input.name ?? '')
      .replace('{{TOGGLE}}', input.toggle ? 'Yes' : 'No')
      .replace(
        '{{CATEGORIES}}',
        selectedCategories.map((category) => `${category.name}=1`).join('&'),
      )

    return axios
      .get(populatedUrl)
      .then((response) => ({
        subscribed: true,
      }))
      .catch((err) => ({
        subscribed: false,
      }))
  }
}
