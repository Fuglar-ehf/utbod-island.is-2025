import { DynamicModule } from '@nestjs/common'
import fetch from 'isomorphic-fetch'

import {
  Configuration,
  EinstaklingarApi,
  FasteignirApi,
  LyklarApi,
} from '../../gen/fetch'

export interface ModuleConfig {
  xRoadPath: string
  xRoadClient: string
}

export class NationalRegistryModule {
  static register(config: ModuleConfig): DynamicModule {
    const providerConfiguration = new Configuration({
      fetchApi: fetch,
      basePath: config.xRoadPath,
    })

    const exportedApis = [EinstaklingarApi, FasteignirApi, LyklarApi]

    return {
      module: NationalRegistryModule,
      providers: exportedApis.map((Api) => ({
        provide: Api,
        useFactory: () => new Api(providerConfiguration),
      })),
      exports: exportedApis,
    }
  }
}
