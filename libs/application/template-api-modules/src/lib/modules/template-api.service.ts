import { Injectable } from '@nestjs/common'

import { ApplicationTypes } from '@island.is/application/core'

import { TemplateApiModuleActionProps } from '../types'

import { ParentalLeaveService, ReferenceTemplateService } from './templates'

interface ApplicationApiAction {
  templateId: string
  type: string
  props: TemplateApiModuleActionProps
}

interface PerformActionEvent {
  response: Error | string
}

type PerformActionResult = [boolean, PerformActionEvent?]

@Injectable()
export class TemplateAPIService {
  constructor(
    private readonly parentalLeaveService: ParentalLeaveService,
    private readonly referenceTemplateService: ReferenceTemplateService,
  ) {}

  private async tryRunningActionOnService(
    service: ReferenceTemplateService | ParentalLeaveService,
    action: ApplicationApiAction,
  ): Promise<PerformActionResult> {
    // No index signature with a parameter of type 'string' was found on type
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    if (typeof service[action.type] === 'function') {
      try {
        // No index signature with a parameter of type 'string' was found on type
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        const response = await service[action.type](action.props)

        return [true, { response }]
      } catch (e) {
        return [false, { response: e }]
      }
    }

    return [false, { response: new Error('invalid action') }]
  }

  async performAction(
    action: ApplicationApiAction,
  ): Promise<PerformActionResult> {
    switch (action.templateId) {
      case ApplicationTypes.EXAMPLE:
        return this.tryRunningActionOnService(
          this.referenceTemplateService,
          action,
        )
      case ApplicationTypes.PARENTAL_LEAVE:
        return this.tryRunningActionOnService(this.parentalLeaveService, action)
    }

    return [false]
  }
}
