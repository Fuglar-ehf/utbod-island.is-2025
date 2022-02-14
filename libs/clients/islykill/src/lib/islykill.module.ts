import fs from 'fs'
import { DynamicModule } from '@nestjs/common'

import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { logger } from '@island.is/logging'

import { Configuration, IslyklarApi } from '../../gen/fetch'

export interface IslykillApiModuleConfig {
  cert: string
  passphrase: string
  basePath: string
}

export class IslykillApiModule {
  static async register(
    config: IslykillApiModuleConfig,
  ): Promise<DynamicModule> {
    function lykillError(errorMsg: any) {
      logger.error(errorMsg)
    }

    let pfx: Buffer | undefined
    try {
      if (!config.cert) {
        throw Error('IslykillApiModule certificate not provided')
      }
      const data = await fs.promises.readFile(config.cert, {
        encoding: 'base64',
      })

      pfx = Buffer.from(data, 'base64')
    } catch (err) {
      lykillError(err)
    }

    if (!config.passphrase) {
      logger.error('IslykillApiModule secret not provided.')
    }
    const passphrase = config.passphrase

    return {
      module: IslykillApiModule,
      providers: [
        {
          provide: IslyklarApi,
          useFactory: () =>
            new IslyklarApi(
              new Configuration({
                basePath: config.basePath,
                fetchApi: createEnhancedFetch({
                  name: 'clients-islykill',
                  clientCertificate: pfx && {
                    pfx,
                    passphrase,
                  },
                }),
              }),
            ),
        },
      ],
      exports: [IslyklarApi],
    }
  }
}
