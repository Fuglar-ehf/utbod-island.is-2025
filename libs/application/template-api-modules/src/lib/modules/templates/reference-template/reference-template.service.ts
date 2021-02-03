import { Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

import {
  generateApplicationApprovedEmail,
  generateAssignApplicationEmail,
} from './emailGenerators'

@Injectable()
export class ReferenceTemplateService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async sendApplication({ application }: TemplateApiModuleActionProps) {
    console.log('Running sendApplication from ReferenceTemplate api module')

    console.log('\t-waiting for fake delay')
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log('\t\tdone')

    console.log('\t-sending application')
    await this.sharedTemplateAPIService.sendEmail(
      generateApplicationApprovedEmail,
      application,
    )
    console.log('\t\tdone')
  }
}
