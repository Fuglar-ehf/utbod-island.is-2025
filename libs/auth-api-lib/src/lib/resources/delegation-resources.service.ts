import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { NoContentException } from '@island.is/nest/problem'

import { ApiScopeTreeDTO } from './dto/api-scope-tree.dto'
import { ApiScopeGroup } from './models/api-scope-group.model'
import { ApiScope } from './models/api-scope.model'
import { Domain } from './models/domain.model'
import { ResourceTranslationService } from './resource-translation.service'

@Injectable()
export class DelegationResourcesService {
  constructor(
    @InjectModel(ApiScope)
    private apiScopeModel: typeof ApiScope,
    @InjectModel(Domain)
    private domainModel: typeof Domain,
    private resourceTranslationService: ResourceTranslationService,
  ) {}

  async findAllDomains(language?: string): Promise<Domain[]> {
    const domains = await this.domainModel.findAll()

    if (language) {
      return this.resourceTranslationService.translateDomains(domains, language)
    }

    return domains
  }

  async findOneDomain(domainName: string, language?: string): Promise<Domain> {
    const domain = await this.domainModel.findByPk(domainName)

    if (!domain) {
      throw new NoContentException()
    }

    if (language) {
      return this.resourceTranslationService.translateDomain(domain, language)
    }

    return domain
  }

  async findScopes(domainName: string, language?: string): Promise<ApiScope[]> {
    const scopes = await this.apiScopeModel.findAll({
      where: {
        domainName,
        allowExplicitDelegationGrant: true,
        enabled: true,
      },
      include: [ApiScopeGroup],
      order: [
        ['group_id', 'ASC NULLS FIRST'],
        ['order', 'ASC'],
      ],
    })

    if (language) {
      await this.resourceTranslationService.translateApiScopes(scopes, language)
    }

    return scopes
  }

  async findScopeTree(
    domainName: string,
    language?: string,
  ): Promise<ApiScopeTreeDTO[]> {
    const scopes = await this.findScopes(domainName, language)

    const groupChildren = new Map<string, ApiScopeTreeDTO[]>()
    const scopeTree: Array<ApiScope | ApiScopeGroup> = []

    for (const scope of scopes) {
      if (scope.group) {
        let children = groupChildren.get(scope.group.name)
        if (!children) {
          scopeTree.push(scope.group)
          children = []
          groupChildren.set(scope.group.name, children)
        }
        children.push(new ApiScopeTreeDTO(scope))
      } else {
        scopeTree.push(scope)
      }
    }

    return scopeTree
      .sort((a, b) => a.order - b.order)
      .map((node) => ({
        ...new ApiScopeTreeDTO(node),
        children: groupChildren.get(node.name),
      }))
  }
}
