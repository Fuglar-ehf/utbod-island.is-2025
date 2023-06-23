import { Injectable } from '@nestjs/common'
import groupBy from 'lodash/groupBy'

import { User } from '@island.is/auth-nest-tools'

import { MultiEnvironmentService } from '../shared/services/multi-environment.service'
import { CreateScopeInput } from './dto/create-scope.input'
import { CreateScopeResponse } from './dto/create-scope.response'
import { ScopeInput } from './dto/scope.input'
import { Scope } from './models/scope.model'
import { ScopesPayload } from './dto/scopes.payload'
import { ScopeEnvironment } from './models/scope-environment.model'
import { environments } from '../shared/constants/environments'
import { AdminPatchScopeInput } from './dto/patch-scope.input'
import { PublishScopeInput } from './dto/publish-scope.input'

@Injectable()
export class ScopeService extends MultiEnvironmentService {
  /**
   * Creates a scope for a specific tenant for the given environments
   */
  async createScope(
    user: User,
    input: CreateScopeInput,
  ): Promise<CreateScopeResponse[]> {
    const createdSettledPromises = await Promise.allSettled(
      input.environments.map(async (environment) => {
        return this.adminApiByEnvironmentWithAuth(
          environment,
          user,
        )?.meScopesControllerCreate({
          tenantId: input.tenantId,
          adminCreateScopeDto: {
            name: input.name,
            displayName: [
              {
                value: input.displayName,
                locale: 'is',
              },
            ],
            description: [
              {
                value: input.description,
                locale: 'is',
              },
            ],
          },
        })
      }),
    )

    return this.handleSettledPromises(createdSettledPromises, {
      mapper: (scope, index) => ({
        scopeName: scope.name,
        environment: input.environments[index],
      }),
      prefixErrorMessage: `Failed to create scope ${input.name}`,
    })
  }

  /**
   * Updates a scope for a specific tenant for the given environments
   */
  async updateScope({
    user,
    input: { environments, scopeName, tenantId, ...adminPatchScopeDto },
  }: {
    user: User
    input: AdminPatchScopeInput
  }): Promise<ScopeEnvironment[]> {
    if (Object.keys(adminPatchScopeDto).length === 0) {
      throw new Error('Nothing provided to update')
    }

    const updatedSettledPromises = await Promise.allSettled(
      environments.map(async (environment) => {
        return this.adminApiByEnvironmentWithAuth(
          environment,
          user,
        )?.meScopesControllerUpdate({
          tenantId,
          scopeName,
          adminPatchScopeDto,
        })
      }),
    )

    return this.handleSettledPromises(updatedSettledPromises, {
      mapper: (scope, index) => ({
        ...scope,
        scopeName: scope.name,
        environment: environments[index],
      }),
      prefixErrorMessage: `Failed to update scope ${scopeName}`,
    })
  }

  /**
   * Publishes a scope to a specific environment.
   * First fetches the scope from the source environment.
   * Then creates the scope in the target environment.
   */
  async publishScope(
    user: User,
    input: PublishScopeInput,
  ): Promise<ScopeEnvironment> {
    // Fetch the scope from source environment
    const sourceInput = await this.adminApiByEnvironmentWithAuth(
      input.sourceEnvironment,
      user,
    )
      ?.meScopesControllerFindByTenantIdAndScopeName({
        tenantId: input.tenantId,
        scopeName: input.scopeName,
      })
      ?.catch((error) => this.handleError(error, input.sourceEnvironment))

    if (!sourceInput) {
      throw new Error(`Scope ${input.scopeName} not found`)
    }

    // If the source scope environment exists then create replica environment in the target environment.
    const newScope = await this.adminApiByEnvironmentWithAuth(
      input.targetEnvironment,
      user,
    )?.meScopesControllerCreate({
      tenantId: input.tenantId,
      adminCreateScopeDto: sourceInput,
    })

    if (!newScope) {
      throw new Error(
        `Failed to create scope ${input.scopeName} on ${input.targetEnvironment}`,
      )
    }

    return {
      ...newScope,
      environment: input.targetEnvironment,
    }
  }

  /**
   * Gets all scopes for all available environments for a specific tenant
   */
  async getScopes(user: User, tenantId: string): Promise<ScopesPayload> {
    const scopesSettledPromises = await Promise.allSettled(
      environments.map((environment) =>
        this.adminApiByEnvironmentWithAuth(
          environment,
          user,
        )?.meScopesControllerFindAllByTenantId({
          tenantId,
        }),
      ),
    )

    const scopeEnvironments = this.handleSettledPromises(
      scopesSettledPromises,
      {
        mapper: (scopes, index) =>
          scopes.map(
            (scope) =>
              ({
                ...scope,
                environment: environments[index],
              } as ScopeEnvironment),
          ),
        prefixErrorMessage: `Failed to get scopes by tenantId ${tenantId}`,
      },
    ).flat()

    const groupedScopes = groupBy(scopeEnvironments, 'name')

    const scopeModels: Scope[] = Object.entries(groupedScopes).map(
      ([scopeName, scopes]) => ({
        scopeName,
        environments: scopes,
      }),
    )

    return {
      data: scopeModels,
      totalCount: scopeModels.length,
      pageInfo: {
        hasNextPage: false,
      },
    }
  }

  /**
   * Gets a specific scope by scope name for all available environments
   */
  async getScope(user: User, input: ScopeInput): Promise<Scope> {
    const scopeSettledPromises = await Promise.allSettled(
      environments.map((environment) =>
        this.adminApiByEnvironmentWithAuth(
          environment,
          user,
        )?.meScopesControllerFindByTenantIdAndScopeName(input),
      ),
    )

    const environmentsScopes = this.handleSettledPromises(
      scopeSettledPromises,
      {
        mapper: (scope, index) => ({
          ...scope,
          environment: environments[index],
        }),
        prefixErrorMessage: `Failed to get scope ${input.scopeName}`,
      },
    )

    return {
      scopeName: input.scopeName,
      environments: environmentsScopes,
    }
  }
}
