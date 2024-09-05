import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { User } from '@island.is/auth-nest-tools'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import {
  AuthDelegationProvider,
  AuthDelegationType,
} from '@island.is/shared/types'
import { isDefined } from '@island.is/shared/utils'

import { ClientAllowedScope } from '../clients/models/client-allowed-scope.model'
import { ClientDelegationType } from '../clients/models/client-delegation-type.model'
import { Client } from '../clients/models/client.model'
import { ApiScopeDelegationType } from '../resources/models/api-scope-delegation-type.model'
import { ApiScope } from '../resources/models/api-scope.model'
import { UNKNOWN_NAME } from './constants/names'
import { DelegationDTOMapper } from './delegation-dto.mapper'
import { DelegationProviderService } from './delegation-provider.service'
import { IncomingDelegationsCompanyService } from './delegations-incoming-company.service'
import { DelegationsIncomingCustomService } from './delegations-incoming-custom.service'
import { DelegationsIncomingRepresentativeService } from './delegations-incoming-representative.service'
import { DelegationsIncomingWardService } from './delegations-incoming-ward.service'
import { DelegationsIndexService } from './delegations-index.service'
import { DelegationDTO } from './dto/delegation.dto'
import { MergedDelegationDTO } from './dto/merged-delegation.dto'

import type { Logger } from '@island.is/logging'
type ClientDelegationInfo = Pick<
  Client,
  'supportedDelegationTypes' | 'requireApiScopes'
>

export type ApiScopeInfo = Pick<
  ApiScope,
  'name' | 'supportedDelegationTypes' | 'isAccessControlled'
>

interface FindAvailableInput {
  user: User
  delegationTypes?: AuthDelegationType[]
  requestedScopes?: string[]
  otherUser?: string
}

/**
 * Service class for incoming delegations.
 * This class supports domain based delegations.
 */
@Injectable()
export class DelegationsIncomingService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    protected readonly logger: Logger,
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
    private delegationsIndexService: DelegationsIndexService,
    private delegationProviderService: DelegationProviderService,
    private nationalRegistryClient: NationalRegistryClientService,
    private readonly featureFlagService: FeatureFlagService,
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

    // Index incoming delegations
    void this.delegationsIndexService
      .indexDelegations(user)
      .catch((error) => this.logger.error('Failed to index delegations', error))

    const delegationPromises = []

    delegationPromises.push(
      this.delegationsIncomingWardService.findAllIncoming(user),
    )

    delegationPromises.push(
      this.incomingDelegationsCompanyService.findAllIncoming(user),
    )

    delegationPromises.push(
      this.delegationsIncomingCustomService.findAllValidIncoming({
        nationalId: user.nationalId,
        domainName,
      }),
    )

    delegationPromises.push(
      this.delegationsIncomingRepresentativeService.findAllIncoming({
        nationalId: user.nationalId,
      }),
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

  async findAllAvailable({
    user,
    delegationTypes,
    otherUser,
  }: FindAvailableInput): Promise<MergedDelegationDTO[]> {
    const client = await this.getClientDelegationInfo(user)
    if (!client?.supportedDelegationTypes) return []

    const types: AuthDelegationType[] = client.supportedDelegationTypes
      .filter(
        (dt) =>
          !delegationTypes ||
          delegationTypes.includes(dt.delegationType as AuthDelegationType),
      )
      .map((t) => t.delegationType as AuthDelegationType)

    if (types.length == 0) return []

    const providers = await this.delegationProviderService.findProviders(types)

    const clientAllowedApiScopes: ApiScopeInfo[] =
      await this.getClientAllowedApiScopes(user)

    const delegationPromises = []

    if (providers.includes(AuthDelegationProvider.NationalRegistry)) {
      delegationPromises.push(
        this.delegationsIncomingWardService
          .findAllIncoming(
            user,
            clientAllowedApiScopes,
            client.requireApiScopes,
          )
          .then((ds) =>
            ds.map((d) => DelegationDTOMapper.toMergedDelegationDTO(d)),
          ),
      )
    }

    if (providers.includes(AuthDelegationProvider.CompanyRegistry)) {
      delegationPromises.push(
        this.incomingDelegationsCompanyService
          .findAllIncoming(
            user,
            clientAllowedApiScopes,
            client.requireApiScopes,
          )
          .then((ds) =>
            ds.map((d) => DelegationDTOMapper.toMergedDelegationDTO(d)),
          ),
      )
    }

    if (providers.includes(AuthDelegationProvider.Custom)) {
      delegationPromises.push(
        this.delegationsIncomingCustomService.findAllAvailableIncoming(
          user,
          clientAllowedApiScopes,
          client.requireApiScopes,
        ),
      )
    }

    if (
      providers.includes(AuthDelegationProvider.PersonalRepresentativeRegistry)
    ) {
      delegationPromises.push(
        this.delegationsIncomingRepresentativeService
          .findAllIncoming({
            nationalId: user.nationalId,
            clientAllowedApiScopes,
            requireApiScopes: client.requireApiScopes,
          })
          .then((ds) =>
            ds.map((d) => DelegationDTOMapper.toMergedDelegationDTO(d)),
          ),
      )
    }

    if (
      providers.includes(AuthDelegationProvider.DistrictCommissionersRegistry)
    ) {
      const isLegalRepresentativeDelegationEnabled =
        await this.featureFlagService.getValue(
          Features.isLegalRepresentativeDelegationEnabled,
          true,
          user,
        )
      if (isLegalRepresentativeDelegationEnabled) {
        delegationPromises.push(
          this.getAvailableDistrictCommissionersRegistryDelegations(
            user,
            types,
            clientAllowedApiScopes,
            client.requireApiScopes,
          ),
        )
      }
    }

    const delegationSets = await Promise.all(delegationPromises)

    let delegations = ([] as MergedDelegationDTO[])
      .concat(...delegationSets)
      .filter((delegation) => delegation.fromNationalId !== user.nationalId)

    if (delegationTypes) {
      delegations = delegations.filter((d) =>
        delegationTypes.some((t) => d.types.includes(t)),
      )
    }

    if (otherUser) {
      delegations = delegations.filter((d) => d.fromNationalId === otherUser)
    }

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

  private async getAvailableDistrictCommissionersRegistryDelegations(
    user: User,
    types: AuthDelegationType[],
    clientAllowedApiScopes: ApiScopeInfo[],
    requireApiScopes?: boolean,
  ): Promise<MergedDelegationDTO[]> {
    const records =
      await this.delegationsIndexService.getAvailableDistrictCommissionersRegistryRecords(
        user,
        types,
        clientAllowedApiScopes,
        requireApiScopes,
      )
    const merged = records.map((d) =>
      DelegationDTOMapper.recordToMergedDelegationDTO(d),
    )

    const persons = (
      await Promise.all(
        merged.map((d) =>
          this.nationalRegistryClient
            .getIndividual(d.fromNationalId)
            .catch((error) => error),
        ),
      )
    )
      .filter(this.isNotError)
      .filter(isDefined)
      .map((individual) => ({
        nationalId: individual.nationalId,
        name: individual.name ?? UNKNOWN_NAME,
      }))

    merged.forEach((d) => {
      const person = persons.find((p) => p.nationalId === d.fromNationalId)
      if (person) {
        d.fromName = person.name
      }
    })

    return merged
  }

  /**
   * Checks if item is not an instance of Error
   */
  private isNotError<T>(item: T | Error): item is T {
    return item instanceof Error === false
  }

  private getClientDelegationInfo(
    user: User,
  ): Promise<ClientDelegationInfo | null> {
    return this.clientModel.findOne({
      where: { clientId: user.client, enabled: true },
      include: {
        model: ClientDelegationType,
        required: true,
      },
      attributes: ['requireApiScopes'],
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
        name: clientAllowedScopes,
        enabled: true,
      },
      include: {
        model: ApiScopeDelegationType,
        required: true,
      },
      attributes: ['name', 'isAccessControlled'],
    })
  }
}
