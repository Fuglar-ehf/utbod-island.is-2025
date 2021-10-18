import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import {
  PartyApplicationService,
  PARTY_APPLICATION_SERVICE_OPTIONS,
  DEFAULT_CLOSED_DATE,
} from './party-application.service'
import {
  Configuration as endorsementConfig,
  EndorsementListApi,
} from './gen/fetch'

export class PartyApplicationModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: PartyApplicationModule,
      imports: [SharedTemplateAPIModule.register(config)],
      providers: [
        PartyApplicationService,
        {
          provide: EndorsementListApi,
          useFactory: async () =>
            new EndorsementListApi(
              new endorsementConfig({
                fetchApi: fetch,
                basePath: config.partyApplication.endorsementsApiBasePath,
              }),
            ),
        },
        {
          provide: PARTY_APPLICATION_SERVICE_OPTIONS,
          useFactory: () => config.partyApplication.options,
        },
        {
          provide: DEFAULT_CLOSED_DATE,
          useValue: config.partyLetter.defaultClosedDate,
        },
      ],
      exports: [PartyApplicationService],
    }
  }
}
