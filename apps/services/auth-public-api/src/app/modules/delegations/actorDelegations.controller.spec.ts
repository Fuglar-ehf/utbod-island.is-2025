import { getModelToken } from '@nestjs/sequelize'
import request from 'supertest'

import {
  ApiScope,
  Delegation,
  DelegationDTO,
  DelegationScope,
  DelegationType,
} from '@island.is/auth-api-lib'
import { AuthScope } from '@island.is/auth/scopes'
import {
  createCurrentUser,
  createNationalRegistryUser,
} from '@island.is/testing/fixtures'
import { TestApp } from '@island.is/testing/nest'

import { createClient, createDelegation } from '../../../../test/fixtures'
import {
  Scopes,
  setupWithAuth,
  setupWithoutAuth,
  setupWithoutPermission,
} from '../../../../test/setup'
import { TestEndpointOptions } from '../../../../test/types'
import { expectMatchingObject, getRequestMethod } from '../../../../test/utils'
import {
  PersonalRepresentative,
  PersonalRepresentativeRight,
  PersonalRepresentativeRightType,
  PersonalRepresentativeType,
} from '@island.is/auth-api-lib/personal-representative'

const today = new Date('2021-11-12')
const client = createClient({ clientId: '@island.is/webapp' })
const user = createCurrentUser({
  nationalId: '1122334455',
  scope: [AuthScope.actorDelegations, Scopes[0].name],
  client: client.clientId,
})
const userName = 'Tester Tests'
const nationalRegistryUser = createNationalRegistryUser({
  kennitala: '6677889900',
})

beforeAll(() => {
  jest.useFakeTimers('modern').setSystemTime(today.getTime())
})

describe('ActorDelegationsController', () => {
  describe('with auth', () => {
    let app: TestApp
    let server: request.SuperTest<request.Test>
    let delegationModel: typeof Delegation
    let apiScopeModel: typeof ApiScope

    beforeAll(async () => {
      // TestApp setup with auth and database
      app = await setupWithAuth({
        user,
        userName,
        nationalRegistryUser,
        client: {
          props: client,
          scopes: Scopes.slice(0, 4).map((s) => s.name),
        },
      })
      server = request(app.getHttpServer())

      // Get reference on Delegation and ApiScope models to seed DB
      delegationModel = app.get<typeof Delegation>(getModelToken(Delegation))
      apiScopeModel = app.get<typeof ApiScope>(getModelToken(ApiScope))
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    afterEach(async () => {
      await delegationModel.destroy({
        where: {},
        cascade: true,
        truncate: true,
        force: true,
      })
    })

    describe('GET /actor/delegations', () => {
      const path = '/v1/actor/delegations'
      const query = '?direction=incoming'

      it('should return only valid delegations', async () => {
        // Arrange
        const models = await delegationModel.bulkCreate(
          [
            createDelegation({
              fromNationalId: nationalRegistryUser.kennitala,
              toNationalId: user.nationalId,
              scopes: [Scopes[0].name],
              today,
            }),
            createDelegation({
              fromNationalId: nationalRegistryUser.kennitala,
              toNationalId: user.nationalId,
              scopes: [Scopes[1].name],
              today,
              expired: true,
            }),
          ],
          {
            include: [{ model: DelegationScope, as: 'delegationScopes' }],
          },
        )
        const expectedModel = models[0].toDTO()

        // Act
        const res = await server.get(`${path}${query}`)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toHaveLength(1)
        expectMatchingObject(res.body[0], expectedModel)
      })

      it('should return only delegations with scopes the client has access to', async () => {
        // Arrange
        const expectedModel = (
          await delegationModel.create(
            createDelegation({
              fromNationalId: nationalRegistryUser.kennitala,
              toNationalId: user.nationalId,
              scopes: [Scopes[0].name, Scopes[5].name],
              today,
            }),
            {
              include: [{ model: DelegationScope, as: 'delegationScopes' }],
            },
          )
        ).toDTO()
        // The expected model should not contain the scope from the other org
        expectedModel.scopes = expectedModel.scopes?.filter(
          (s) => s.scopeName === Scopes[0].name,
        )

        // Act
        const res = await server.get(`${path}${query}`)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toHaveLength(1)
        expectMatchingObject(res.body[0], expectedModel)
      })

      it('should return no delegation when the client does not have access to any scope', async () => {
        // Arrange
        await delegationModel.create(
          createDelegation({
            fromNationalId: nationalRegistryUser.kennitala,
            toNationalId: user.nationalId,
            scopes: [Scopes[5].name],
            today,
          }),
          {
            include: [{ model: DelegationScope, as: 'delegationScopes' }],
          },
        )

        // Act
        const res = await server.get(`${path}${query}`)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toHaveLength(0)
      })

      it('should return 400 BadRequest if required query paramter is missing', async () => {
        // Act
        const res = await server.get(path)

        // Assert
        expect(res.status).toEqual(400)
        expect(res.body).toMatchObject({
          status: 400,
          type: 'https://httpstatuses.com/400',
          title: 'Bad Request',
          detail:
            "'direction' can only be set to incoming for the /actor alias",
        })
      })

      it('should not return delegation when all the scopes are no longer allowed for delegation', async () => {
        // Arrange
        await delegationModel.create(
          createDelegation({
            fromNationalId: nationalRegistryUser.kennitala,
            toNationalId: user.nationalId,
            scopes: [Scopes[1].name],
            today,
          }),
          {
            include: [{ model: DelegationScope, as: 'delegationScopes' }],
          },
        )
        // Disable the scope for delegation after it has been used in delegation
        await apiScopeModel.update(
          { allowExplicitDelegationGrant: false } as ApiScope,
          { where: { name: Scopes[1].name } },
        )
        const expectedModels: DelegationDTO[] = []

        // Act
        const res = await server.get(`${path}${query}`)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toHaveLength(0)
        expectMatchingObject(res.body, expectedModels)

        // Clean up
        await apiScopeModel.update(
          { allowExplicitDelegationGrant: true } as ApiScope,
          { where: { name: Scopes[1].name } },
        )
      })

      it('should not return scopes in delegation that are no longer allowed for delegation', async () => {
        // Arrange
        const model = (
          await delegationModel.create(
            createDelegation({
              fromNationalId: nationalRegistryUser.kennitala,
              toNationalId: user.nationalId,
              scopes: [Scopes[0].name, Scopes[2].name],
              today,
            }),
            {
              include: [{ model: DelegationScope, as: 'delegationScopes' }],
            },
          )
        ).toDTO()
        const scope = model.scopes?.find(
          ({ scopeName }) => scopeName === Scopes[0].name,
        )
        const expectedModels: DelegationDTO[] = [
          {
            ...model,
            scopes: scope ? [scope] : undefined,
          },
        ]

        // Act
        const res = await server.get(`${path}${query}`)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toHaveLength(1)
        expectMatchingObject(res.body, expectedModels)
      })

      describe('when user is a personal representative with one representee', () => {
        let prModel: typeof PersonalRepresentative
        let prRightsModel: typeof PersonalRepresentativeRight
        let prRightTypeModel: typeof PersonalRepresentativeRightType
        let prTypeModel: typeof PersonalRepresentativeType

        let response: request.Response
        let body: DelegationDTO[]

        beforeAll(async () => {
          prTypeModel = app.get<typeof PersonalRepresentativeType>(
            'PersonalRepresentativeTypeRepository',
          )
          prModel = app.get<typeof PersonalRepresentative>(
            'PersonalRepresentativeRepository',
          )
          prRightTypeModel = app.get<typeof PersonalRepresentativeRightType>(
            'PersonalRepresentativeRightTypeRepository',
          )
          prRightsModel = app.get<typeof PersonalRepresentativeRight>(
            'PersonalRepresentativeRightRepository',
          )

          const prType = await prTypeModel.create({
            code: 'prTypeCode',
            name: 'prTypeName',
            description: 'prTypeDescription',
          })

          const pr = await prModel.create({
            nationalIdPersonalRepresentative: user.nationalId,
            nationalIdRepresentedPerson: nationalRegistryUser.kennitala,
            personalRepresentativeTypeCode: prType.code,
            contractId: '1',
            externalUserId: '1',
          })

          const prRightType = await prRightTypeModel.create({
            code: 'prRightType',
            description: 'prRightTypeDescription',
          })

          await prRightsModel.create({
            rightTypeCode: prRightType.code,
            personalRepresentativeId: pr.id,
          })

          response = await server.get(`${path}${query}`)
          body = response.body
        })

        it('should have a an OK return status', () => {
          expect(response.status).toEqual(200)
        })

        it('should return a single entity', () => {
          expect(body.length).toEqual(1)
        })

        it('should have the nationalId of the user as the representer', () => {
          expect(
            body.some((d) => d.toNationalId === user.nationalId),
          ).toBeTruthy()
        })

        it('should have the nationalId of the correct representee', () => {
          expect(
            body.some(
              (d) => d.fromNationalId === nationalRegistryUser.kennitala,
            ),
          ).toBeTruthy()
        })

        it('should have the name of the correct representee', () => {
          expect(
            body.some((d) => d.fromName === nationalRegistryUser.nafn),
          ).toBeTruthy()
        })

        it('should have the delegation type claim of PersonalRepresentative', () => {
          expect(
            body.some((d) => d.type === DelegationType.PersonalRepresentative),
          ).toBeTruthy()
        })

        afterAll(async () => {
          await prRightsModel.destroy({
            where: {},
            cascade: true,
            truncate: true,
            force: true,
          })
          await prRightTypeModel.destroy({
            where: {},
            cascade: true,
            truncate: true,
            force: true,
          })
          await prModel.destroy({
            where: {},
            cascade: true,
            truncate: true,
            force: true,
          })
          await prTypeModel.destroy({
            where: {},
            cascade: true,
            truncate: true,
            force: true,
          })
        })
      })
    })
  })

  describe('without auth and permission', () => {
    it.each`
      method   | endpoint
      ${'GET'} | ${'/v1/actor/delegations'}
    `(
      '$method $endpoint should return 401 when user is not authenticated',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const app = await setupWithoutAuth()
        const server = request(app.getHttpServer())

        // Act
        const res = await getRequestMethod(server, method)(endpoint)

        // Assert
        expect(res.status).toEqual(401)
        expect(res.body).toMatchObject({
          status: 401,
          type: 'https://httpstatuses.com/401',
          title: 'Unauthorized',
        })

        // CleanUp
        app.cleanUp()
      },
    )

    it.each`
      method   | endpoint
      ${'GET'} | ${'/v1/actor/delegations'}
    `(
      '$method $endpoint should return 403 Forbidden when user does not have the correct scope',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const app = await setupWithoutPermission()
        const server = request(app.getHttpServer())

        // Act
        const res = await getRequestMethod(server, method)(endpoint)

        // Assert
        expect(res.status).toEqual(403)
        expect(res.body).toMatchObject({
          status: 403,
          type: 'https://httpstatuses.com/403',
          title: 'Forbidden',
          detail: 'Forbidden resource',
        })

        // CleanUp
        app.cleanUp()
      },
    )
  })
})
