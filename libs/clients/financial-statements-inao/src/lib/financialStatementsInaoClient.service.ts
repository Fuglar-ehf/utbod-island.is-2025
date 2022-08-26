import { createEnhancedFetch } from '@island.is/clients/middlewares'
import type { ConfigType } from '@island.is/nest/config'

import { Inject, Injectable } from '@nestjs/common'

import { FinancialStatementsInaoClientConfig } from './financialStatementsInao.config'
import type { Client, Election } from './types'

@Injectable()
export class FinancialStatementsInaoClientService {
  constructor(
    @Inject(FinancialStatementsInaoClientConfig.KEY)
    private config: ConfigType<typeof FinancialStatementsInaoClientConfig>,
  ) {}

  basePath = this.config.basePath

  fetch = createEnhancedFetch({
    name: 'financialStatementsInao-odata',
    autoAuth: {
      issuer: this.config.issuer,
      clientId: this.config.clientId,
      clientSecret: this.config.clientSecret,
      scope: [this.config.scope],
      mode: 'token',
      tokenEndpoint: this.config.tokenEndpoint,
    },
  })

  async getClientTypes(): Promise<Client[] | null> {
    const url = `${this.basePath}/GlobalOptionSetDefinitions(Name='star_clienttypechoice')`
    const response = await this.fetch(url)
    const data = await response.json()

    if (!data || !data.Options) return null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clientTypes: Client[] = data.Options.map((x: any) => {
      return {
        value: x.Value,
        label: x.Label.UserLocalizedLabel.Label,
      }
    })

    return clientTypes
  }

  async getClientType(typeCode: string): Promise<Client | null> {
    const clientTypes = await this.getClientTypes()

    const found = clientTypes?.filter((x) => x.label === typeCode)

    if (found && found.length > 0) {
      return found[0]
    }
    return null
  }

  async getUserClientType(nationalId: string): Promise<Client | null> {
    const select = '$select=star_nationalid, star_name, star_type'
    const filter = `$filter=star_nationalid eq '${encodeURIComponent(
      nationalId,
    )}'`
    const url = `${this.basePath}/star_clients?${select}&${filter}`
    const response = await this.fetch(url)
    const data = await response.json()

    if (!data || !data.value) return null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const typeValue = data.value.map((x: any) => {
      return x.star_type
    })

    if (!typeValue) {
      return null
    }

    const clientTypes = await this.getClientTypes()

    const found = clientTypes?.filter((x) => x.value === typeValue[0])

    if (found && found.length > 0) {
      return found[0]
    }
    return null
  }

  async getElections(): Promise<Election[] | null> {
    const url = `${this.basePath}/star_elections`
    const response = await this.fetch(url)
    const data = await response.json()

    if (!data || !data.value) return null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const elections: Election[] = data.value.map((x: any) => {
      return <Election>{
        electionId: x.star_electionid,
        name: x.star_name,
        electionDate: new Date(x.star_electiondate),
      }
    })

    return elections
  }
}
