import { User } from '@island.is/auth-nest-tools'
import { FeatureFlagService } from '@island.is/nest/feature-flags'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Client } from '../clients/models/client.model'
import { IncomingDelegationsCompanyService } from './delegations-incoming-company.service'
import { DelegationsIncomingCustomService } from './delegations-incoming-custom.service'
import { DelegationDTOMapper } from './delegation-dto.mapper'
import { DelegationDTO } from './dto/delegation.dto'
import { MergedDelegationDTO } from './dto/merged-delegation.dto'
import { DelegationsIncomingRepresentativeService } from './delegations-incoming-representative.service'
import { DelegationType } from './types/delegationType'
import { DelegationsIncomingWardService } from './delegations-incoming-ward.service'
import { ApiScope } from '../resources/models/api-scope.model'
import { Op } from 'sequelize'
import { ClientAllowedScope } from '../clients/models/client-allowed-scope.model'

type ClientDelegationInfo = Pick<
  Client,
  | 'supportsCustomDelegation'
  | 'supportsLegalGuardians'
  | 'supportsProcuringHolders'
  | 'supportsPersonalRepresentatives'
  | 'requireApiScopes'
>

export type ApiScopeInfo = Pick<
  ApiScope,
  | 'name'
  | 'enabled'
  | 'grantToLegalGuardians'
  | 'grantToProcuringHolders'
  | 'grantToPersonalRepresentatives'
  | 'allowExplicitDelegationGrant'
  | 'isAccessControlled'
>

/**
 * Service class for incoming delegations.
 * This class supports domain based delegations.
 */
@Injectable()
export class DelegationsIncomingService {
  constructor(
    private featureFlagService: FeatureFlagService,
    @InjectModel(Client)
    private clientModel: typeof Client,
    @InjectModel(ClientAllowedScope)
    private clientAllowedScopeModel: typeof ClientAllowedScope,
    @InjectModel(ApiScope)
    private apiScopeModel: typeof ApiScope,
    private incomingDelegationsCompanyService: IncomingDelegationsCompanyService,
    private delegationsIncomingCustomService: DelegationsIncomingCustomService,
    private delegationsIncomingRepresentativeService: DelegationsIncomingRepresentativeService,
    private delegationsIncomingWardService: DelegationsIncomingWardService,
  ) {}

  async findAllValid(
    user: User,
    domainName?: string,
    otherUser?: string,
  ): Promise<DelegationDTO[]> {
    if (user.actor) {
      throw new BadRequestException(
        'Only supported when the subject is the authenticated user.',
      )
    }

    const delegationPromises = []

    delegationPromises.push(
      this.delegationsIncomingWardService.findAllIncoming(user),
    )

    delegationPromises.push(
      this.incomingDelegationsCompanyService.findAllIncoming(user),
    )

    delegationPromises.push(
      this.delegationsIncomingCustomService.findAllValidIncoming(
        user,
        domainName,
      ),
    )

    delegationPromises.push(
      this.delegationsIncomingRepresentativeService.findAllIncoming(user),
    )

    const delegationSets = await Promise.all(delegationPromises)

    return ([] as DelegationDTO[])
      .concat(...delegationSets)
      .filter(
        (delegation) =>
          delegation.fromNationalId !== user.nationalId &&
          (!otherUser || delegation.fromNationalId === otherUser),
      )
  }

  async findAllAvailable(
    user: User,
    delegationTypes?: DelegationType[],
  ): Promise<MergedDelegationDTO[]> {
    const client = await this.getClientDelegationInfo(user)

    const clientAllowedApiScopes = await this.getClientAllowedApiScopes(user)

    const delegationPromises = []

    if (
      this.isRequested(DelegationType.LegalGuardian, delegationTypes) &&
      (!client || client.supportsLegalGuardians)
    ) {
      delegationPromises.push(
        this.delegationsIncomingWardService
          .findAllIncoming(
            user,
            clientAllowedApiScopes,
            client?.requireApiScopes,
          )
          .then((ds) =>
            ds.map((d) => DelegationDTOMapper.toMergedDelegationDTO(d)),
          ),
      )
    }

    if (
      this.isRequested(DelegationType.ProcurationHolder, delegationTypes) &&
      (!client || client.supportsProcuringHolders)
    ) {
      delegationPromises.push(
        this.incomingDelegationsCompanyService
          .findAllIncoming(
            user,
            clientAllowedApiScopes,
            client?.requireApiScopes,
          )
          .then((ds) =>
            ds.map((d) => DelegationDTOMapper.toMergedDelegationDTO(d)),
          ),
      )
    }

    if (
      this.isRequested(DelegationType.Custom, delegationTypes) &&
      (!client || client.supportsCustomDelegation)
    ) {
      delegationPromises.push(
        this.delegationsIncomingCustomService.findAllAvailableIncoming(
          user,
          clientAllowedApiScopes,
          client?.requireApiScopes,
        ),
      )
    }

    if (
      this.isRequested(
        DelegationType.PersonalRepresentative,
        delegationTypes,
      ) &&
      (!client || client.supportsPersonalRepresentatives)
    ) {
      delegationPromises.push(
        this.delegationsIncomingRepresentativeService
          .findAllIncoming(
            user,
            clientAllowedApiScopes,
            client?.requireApiScopes,
          )
          .then((ds) =>
            ds.map((d) => DelegationDTOMapper.toMergedDelegationDTO(d)),
          ),
      )
    }

    const delegationSets = await Promise.all(delegationPromises)

    const delegations = ([] as MergedDelegationDTO[])
      .concat(...delegationSets)
      .filter((delegation) => delegation.fromNationalId !== user.nationalId)

    const mergedDelegationMap = delegations.reduce(
      (
        acc: Map<string, MergedDelegationDTO>,
        delegation: MergedDelegationDTO,
      ) => {
        const existing = acc.get(delegation.fromNationalId)

        if (existing) {
          existing.types.push(...delegation.types)
        } else {
          acc.set(delegation.fromNationalId, delegation)
        }

        return acc
      },
      new Map(),
    )

    return [...mergedDelegationMap.values()]
  }

  private isRequested(
    type: DelegationType,
    delegationTypes?: DelegationType[],
  ): boolean {
    const hasDelegationTypeFilter =
      delegationTypes && delegationTypes.length > 0

    return !hasDelegationTypeFilter || delegationTypes.includes(type)
  }

  private async getClientDelegationInfo(
    user: User,
  ): Promise<ClientDelegationInfo | null> {
    return this.clientModel.findByPk(user.client, {
      attributes: [
        'supportsLegalGuardians',
        'supportsProcuringHolders',
        'supportsCustomDelegation',
        'supportsPersonalRepresentatives',
        'requireApiScopes',
      ],
    })
  }

  private async getClientAllowedApiScopes(user: User): Promise<ApiScopeInfo[]> {
    if (!user) return []

    const clientAllowedScopes = (
      await this.clientAllowedScopeModel.findAll({
        where: {
          clientId: user.client,
        },
      })
    ).map((s) => s.scopeName)

    return await this.apiScopeModel.findAll({
      where: {
        [Op.and]: [
          { name: { [Op.in]: clientAllowedScopes.map((s) => s) } },
          { enabled: true },
        ],
      },
      attributes: [
        'name',
        'enabled',
        'grantToLegalGuardians',
        'grantToProcuringHolders',
        'grantToPersonalRepresentatives',
        'allowExplicitDelegationGrant',
        'isAccessControlled',
      ],
    })
  }
}
