import { logger } from '@island.is/logging'
import * as Soap from 'soap'

export class SoapClient {
  static async generateClient(
    baseUrl: string,
    host: string,
  ): Promise<Soap.Client | null> {
    const promise = new Promise<Soap.Client>((resolve) => {
      Soap.createClient(
        `${baseUrl}/islws/service.asmx?WSDL`,
        {
          // eslint-disable-next-line
          wsdl_headers: { Host: host },
        },
        (error, client) => {
          if (client) {
            client.setEndpoint(`${baseUrl}/islws/service.asmx`)
            client.addHttpHeader('Host', host)
            resolve(client)
          } else {
            logger.error('NationalRegistry connection failed : ', error)
            resolve(client)
          }
        },
      )
    })
    return promise
  }
}
