import DataLoader from 'dataloader'
import { Injectable } from '@nestjs/common'

import { NestDataLoader } from '@island.is/nest/dataloader'
import { CmsContentfulService } from '../cms.contentful.service'

type LogoUrl = string | null

export type OrganizationLogoByReferenceIdDataLoader = DataLoader<
  string,
  LogoUrl,
  string
>

@Injectable()
export class OrganizationLogoByReferenceIdLoader
  implements NestDataLoader<string, LogoUrl>
{
  constructor(private readonly cmsContentfulService: CmsContentfulService) {}

  async loadOrganizationLogo(
    organizationTitles: readonly string[],
  ): Promise<Array<LogoUrl>> {
    const organizationLogos =
      await this.cmsContentfulService.getOrganizationLogos(
        organizationTitles as string[],
        true,
      )

    return organizationLogos
  }

  generateDataLoader(): OrganizationLogoByReferenceIdDataLoader {
    return new DataLoader((keys) => this.loadOrganizationLogo(keys))
  }
}
