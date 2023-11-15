import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { UniversityGatewayApi } from '../universityGateway.service'
import { UniversityGatewayUniversity } from './models'
import { Loader } from '@island.is/nest/dataloader'
import { OrganizationLogoLoader } from '@island.is/cms'
import type { LogoUrl, OrganizationLogoDataLoader } from '@island.is/cms'

@Resolver(UniversityGatewayUniversity)
export class UniversityResolver {
  constructor(private readonly universityGatewayApi: UniversityGatewayApi) {}

  @Query(() => [UniversityGatewayUniversity])
  universityGatewayUniversities() {
    return this.universityGatewayApi.getUniversities()
  }

  @ResolveField('contentfulLogoUrl', () => String, { nullable: true })
  async resolveContentfulLogoUrl(
    @Loader(OrganizationLogoLoader)
    organizationLogoLoader: OrganizationLogoDataLoader,
    @Parent() university: UniversityGatewayUniversity,
  ): Promise<LogoUrl> {
    return organizationLogoLoader.load(university.contentfulKey)
  }
}
