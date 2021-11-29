import { uuid } from 'uuidv4'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import {
  DelegationScopeDTO,
  UpdateDelegationScopeDTO,
} from '../entities/dto/delegation-scope.dto'
import { DelegationScope } from '../entities/models/delegation-scope.model'
import { Delegation } from '../entities/models/delegation.model'
import { Op } from 'sequelize'
import { ApiScope } from '../entities/models/api-scope.model'
import { IdentityResource } from '../entities/models/identity-resource.model'
import startOfDay from 'date-fns/startOfDay'

@Injectable()
export class DelegationScopeService {
  constructor(
    @InjectModel(DelegationScope)
    private delegationScopeModel: typeof DelegationScope,
    @InjectModel(ApiScope)
    private apiScopeModel: typeof ApiScope,
    @InjectModel(IdentityResource)
    private identityResourceModel: typeof IdentityResource,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async create(
    delegationId: string,
    delegationScope: DelegationScopeDTO,
  ): Promise<DelegationScope | null> {
    this.logger.debug('Creating new delegation scope')
    const validFrom = startOfDay(new Date())
    return this.delegationScopeModel.create({
      id: uuid(),
      ...delegationScope,
      validFrom,
      delegationId,
    })
  }

  async createMany(
    delegationId: string,
    scopes: UpdateDelegationScopeDTO[],
  ): Promise<any> {
    const validFrom = startOfDay(new Date())
    return this.delegationScopeModel.bulkCreate(
      scopes.map((delegationScope) => ({
        id: uuid(),
        validFrom,
        validTo: delegationScope.validTo
          ? startOfDay(delegationScope.validTo)
          : undefined,
        scopeName:
          delegationScope.type === 'apiScope'
            ? delegationScope.name
            : undefined,
        identityResourceName:
          delegationScope.type === 'identityResource'
            ? delegationScope.name
            : undefined,
        delegationId,
      })),
    )
  }

  async findAll(
    delegationId: string,
    scopeName: string | null = null,
  ): Promise<DelegationScope[] | null> {
    if (scopeName) {
      return this.delegationScopeModel.findAll({
        where: { delegationId: delegationId, scopeName: scopeName },
      })
    }
    return this.delegationScopeModel.findAll({
      where: { delegationId: delegationId },
    })
  }

  async delete(
    delegationId: string,
    scopeName?: string | null,
  ): Promise<number> {
    if (scopeName) {
      return this.delegationScopeModel.destroy({
        where: { delegationId: delegationId, scopeName: scopeName },
      })
    }

    return this.delegationScopeModel.destroy({
      where: { delegationId: delegationId },
    })
  }

  async findAllValidCustomScopesTo(
    toNationalId: string,
    fromNationalId: string,
  ): Promise<DelegationScope[]> {
    const today = startOfDay(new Date())

    return this.delegationScopeModel.findAll({
      where: {
        [Op.and]: [
          { validFrom: { [Op.lte]: today } },
          { validTo: { [Op.or]: [{ [Op.eq]: null }, { [Op.gte]: today }] } },
        ],
      },
      include: [
        {
          model: Delegation,
          where: {
            toNationalId: toNationalId,
            fromNationalId: fromNationalId,
          },
        },
        {
          model: ApiScope,
          where: {
            allowExplicitDelegationGrant: true,
          },
          required: false,
        },
        {
          model: IdentityResource,
          where: {
            allowExplicitDelegationGrant: true,
          },
          required: false,
        },
      ],
    })
  }

  async findAllProcurationScopes(): Promise<string[]> {
    const apiScopes = await this.apiScopeModel.findAll({
      where: {
        grantToProcuringHolders: true,
        alsoForDelegatedUser: false,
      },
    })

    const identityResources = await this.identityResourceModel.findAll({
      where: {
        grantToProcuringHolders: true,
        alsoForDelegatedUser: false,
      },
    })

    return [
      ...apiScopes.map((s) => s.name),
      ...identityResources.map((s) => s.name),
    ]
  }

  async findAllLegalGuardianScopes(): Promise<string[]> {
    const apiScopes = await this.apiScopeModel.findAll({
      where: {
        grantToLegalGuardians: true,
        alsoForDelegatedUser: false,
      },
    })

    const identityResources = await this.identityResourceModel.findAll({
      where: {
        grantToLegalGuardians: true,
        alsoForDelegatedUser: false,
      },
    })

    return [
      ...apiScopes.map((s) => s.name),
      ...identityResources.map((s) => s.name),
    ]
  }

  async findAllAutomaticScopes(): Promise<string[]> {
    const apiScopes = await this.apiScopeModel.findAll({
      where: {
        automaticDelegationGrant: true,
      },
    })

    const identityResources = await this.identityResourceModel.findAll({
      where: {
        automaticDelegationGrant: true,
      },
    })

    return [
      ...apiScopes.map((s) => s.name),
      ...identityResources.map((s) => s.name),
    ]
  }
}
