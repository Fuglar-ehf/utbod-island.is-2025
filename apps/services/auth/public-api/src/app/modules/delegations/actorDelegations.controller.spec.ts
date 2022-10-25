import { getModelToken } from '@nestjs/sequelize'
import request from 'supertest'
import times from 'lodash/times'

import {
  Client,
  DEFAULT_DOMAIN,
  Delegation,
  DelegationDTO,
  DelegationScope,
  DelegationType,
  PersonalRepresentative,
  PersonalRepresentativeRight,
  PersonalRepresentativeRightType,
  PersonalRepresentativeType,
} from '@island.is/auth-api-lib'
import { AuthScope } from '@island.is/auth/scopes'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import {
  ResponseSimple,
  RskProcuringClient,
} from '@island.is/clients/rsk/procuring'
import {
  createCurrentUser,
  createNationalId,
  createNationalRegistryUser,
} from '@island.is/testing/fixtures'
import { TestApp } from '@island.is/testing/nest'
import { NationalRegistryClientPerson } from '@island.is/shared/types'
import { createDelegation } from '@island.is/services/auth/testing'

import { createClient } from '../../../../test/fixtures'
import {
  Scopes,
  setupWithAuth,
  setupWithoutAuth,
  setupWithoutPermission,
} from '../../../../test/setup'
import { TestEndpointOptions } from '../../../../test/types'
import {
  expectMatchingObject,
  getRequestMethod,
  getFakeName,
  createDelegationModels,
  findExpectedDelegationModels,
} from '../../../../test/utils'

const swapNames = (
  nationalRegistryUsers: NationalRegistryClientPerson[],
  fromNationalId: string,
) =>
  nationalRegistryUsers.find((nru) => nru.nationalId === fromNationalId)
    ?.name ?? ''

function updateDelegationFromNameToPersonName(
  delegations: DelegationDTO[] | DelegationDTO,
  nationalRegistryUsers: NationalRegistryClientPerson[],
) {
  if (Array.isArray(delegations)) {
    return delegations.map((delegation) => ({
      ...delegation,
      fromName: swapNames(nationalRegistryUsers, delegation.fromNationalId),
    }))
  }

  return {
    ...delegations,
    fromName: swapNames(nationalRegistryUsers, delegations.fromNationalId),
  }
}

const today = new Date('2021-11-12')
const client = createClient({
  clientId: '@island.is/webapp',
  supportsCustomDelegation: true,
  supportsLegalGuardians: true,
  supportsProcuringHolders: true,
  supportsPersonalRepresentatives: true,
})

const user = createCurrentUser({
  nationalId: createNationalId('person'),
  scope: [AuthScope.actorDelegations, Scopes[0].name],
  client: client.clientId,
})
const userName = 'Tester Tests'
const nationalRegistryUser = createNationalRegistryUser()

const mockDelegations = {
  incoming: createDelegation({
    fromNationalId: nationalRegistryUser.nationalId,
    toNationalId: user.nationalId,
    scopes: [Scopes[0].name],
    today,
  }),
  // This is used implicitly
  expiredIncoming: createDelegation({
    fromNationalId: createNationalId('person'),
    toNationalId: user.nationalId,
    scopes: [Scopes[1].name],
    today,
    expired: true,
  }),
  incomingWithOtherDomain: createDelegation({
    fromNationalId: createNationalId('person'),
    toNationalId: user.nationalId,
    scopes: [Scopes[0].name, Scopes[5].name],
    today,
  }),
  incomingOnlyOtherDomain: createDelegation({
    fromNationalId: createNationalId('person'),
    toNationalId: user.nationalId,
    scopes: [Scopes[5].name],
    today,
  }),
  incomingWithNoAllowed: createDelegation({
    fromNationalId: createNationalId('person'),
    toNationalId: user.nationalId,
    scopes: [Scopes[2].name],
    today,
  }),
  incomingBothValidAndNotAllowed: createDelegation({
    fromNationalId: createNationalId('person'),
    toNationalId: user.nationalId,
    scopes: [Scopes[0].name, Scopes[2].name],
    today,
  }),
}

beforeAll(() => {
  jest.useFakeTimers().setSystemTime(today.getTime())
})

describe('ActorDelegationsController', () => {
  describe('with auth', () => {
    let app: TestApp
    let server: request.SuperTest<request.Test>
    let delegationModel: typeof Delegation
    let clientModel: typeof Client
    let nationalRegistryApi: NationalRegistryClientService

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

      // Get reference on Delegation and Client models to seed DB
      delegationModel = app.get<typeof Delegation>(getModelToken(Delegation))
      clientModel = app.get<typeof Client>(getModelToken(Client))
      nationalRegistryApi = app.get(NationalRegistryClientService)
    })

    beforeEach(() => {
      return clientModel.update(
        {
          supportsCustomDelegation: true,
          supportsLegalGuardians: true,
          supportsProcuringHolders: true,
          supportsPersonalRepresentatives: true,
        },
        { where: { clientId: client.clientId } },
      )
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
      let nationalRegistryApiSpy: jest.SpyInstance
      const path = '/v1/actor/delegations'
      const query = '?direction=incoming'
      const deceasedNationalIds = times(3, () => createNationalId('person'))
      const nationalRegistryUsers = [
        nationalRegistryUser,
        ...Object.values(mockDelegations).map((delegation) =>
          createNationalRegistryUser({
            nationalId: delegation.fromNationalId,
          }),
        ),
        ...times(10, () =>
          createNationalRegistryUser({
            name: getFakeName(),
            nationalId: createNationalId('person'),
          }),
        ),
      ]

      beforeAll(async () => {
        nationalRegistryApiSpy = jest
          .spyOn(nationalRegistryApi, 'getIndividual')
          .mockImplementation(async (id) => {
            if (deceasedNationalIds.includes(id)) {
              return null
            }

            const user = nationalRegistryUsers.find((u) => u?.nationalId === id)

            return user ?? null
          })
      })

      it('should return only valid delegations', async () => {
        // Arrange
        await createDelegationModels(
          delegationModel,
          Object.values(mockDelegations),
        )
        const expectedModels = await findExpectedDelegationModels(
          delegationModel,
          [
            mockDelegations.incoming.id,
            mockDelegations.incomingBothValidAndNotAllowed.id,
            mockDelegations.incomingWithOtherDomain.id,
          ],
          [Scopes[0].name],
        )

        // Act
        const res = await server.get(`${path}${query}`)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toHaveLength(3)
        expectMatchingObject(
          res.body,
          updateDelegationFromNameToPersonName(
            expectedModels,
            nationalRegistryUsers,
          ),
        )
      })

      it('should return only delegations with scopes the client has access to', async () => {
        // Arrange
        await createDelegationModels(delegationModel, [
          mockDelegations.incomingWithOtherDomain,
        ])
        const expectedModel = await findExpectedDelegationModels(
          delegationModel,
          mockDelegations.incomingWithOtherDomain.id,
          [Scopes[0].name],
        )

        // Act
        const res = await server.get(`${path}${query}`)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toHaveLength(1)
        expectMatchingObject(
          res.body[0],
          updateDelegationFromNameToPersonName(
            expectedModel,
            nationalRegistryUsers,
          ),
        )
      })

      it('should return custom delegations when the delegationTypes filter has custom type', async () => {
        // Arrange
        await createDelegationModels(delegationModel, [
          mockDelegations.incomingWithOtherDomain,
        ])
        const expectedModel = await findExpectedDelegationModels(
          delegationModel,
          mockDelegations.incomingWithOtherDomain.id,
          [Scopes[0].name],
        )

        // Act
        const res = await server.get(
          `${path}${query}&delegationTypes=${DelegationType.Custom}`,
        )

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toHaveLength(1)
        expectMatchingObject(
          res.body[0],
          updateDelegationFromNameToPersonName(
            expectedModel,
            nationalRegistryUsers,
          ),
        )
      })

      it('should return custom delegations and not deceased delegations, when the delegationTypes filter is custom type', async () => {
        // Arrange
        await createDelegationModels(delegationModel, [
          mockDelegations.incoming,
          createDelegation({
            fromNationalId: deceasedNationalIds[0],
            toNationalId: user.nationalId,
            scopes: [Scopes[0].name],
            today,
          }),
          createDelegation({
            fromNationalId: deceasedNationalIds[1],
            toNationalId: user.nationalId,
            scopes: [Scopes[0].name],
            today,
          }),
        ])

        // We expect the first model to be returned, but not the second or third since they are tied to a deceased person
        const expectedModel = await findExpectedDelegationModels(
          delegationModel,
          mockDelegations.incoming.id,
          [Scopes[0].name],
        )

        // Act
        const res = await server.get(
          `${path}${query}&delegationTypes=${DelegationType.Custom}`,
        )

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toHaveLength(1)
        expectMatchingObject(
          res.body[0],
          updateDelegationFromNameToPersonName(
            expectedModel,
            nationalRegistryUsers,
          ),
        )

        // Verify
        const expectedModifyedModels = await delegationModel.findAll({
          where: {
            toNationalId: user.nationalId,
          },
          include: [
            {
              model: DelegationScope,
              as: 'delegationScopes',
            },
          ],
        })

        expect(expectedModifyedModels.length).toEqual(1)
      })

      it('should return delegations when the delegationTypes filter is empty', async () => {
        // Arrange
        await createDelegationModels(delegationModel, [
          mockDelegations.incomingWithOtherDomain,
        ])
        const expectedModel = await findExpectedDelegationModels(
          delegationModel,
          mockDelegations.incomingWithOtherDomain.id,
          [Scopes[0].name],
        )

        // Act
        const res = await server.get(`${path}${query}&delegationTypes=`)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toHaveLength(1)
        expectMatchingObject(
          res.body[0],
          updateDelegationFromNameToPersonName(
            expectedModel,
            nationalRegistryUsers,
          ),
        )
      })

      it('should not return custom delegations when the delegationTypes filter does not include custom type', async () => {
        // Arrange
        await createDelegationModels(delegationModel, [
          mockDelegations.incomingWithOtherDomain,
        ])

        // Act
        const res = await server.get(
          `${path}${query}&delegationTypes=${DelegationType.ProcurationHolder}`,
        )

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toHaveLength(0)
      })

      it('should return no delegation when the client does not have access to any scope', async () => {
        // Arrange
        await createDelegationModels(delegationModel, [
          mockDelegations.incomingOnlyOtherDomain,
        ])

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
          type: 'https://httpstatuses.org/400',
          title: 'Bad Request',
          detail:
            "'direction' can only be set to incoming for the /actor alias",
        })
      })

      it('should not return delegation with no scope longer allowed for delegation', async () => {
        // Arrange
        await createDelegationModels(delegationModel, [
          mockDelegations.incomingWithNoAllowed,
        ])
        const expectedModels: DelegationDTO[] = []

        // Act
        const res = await server.get(`${path}${query}`)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toHaveLength(0)
        expectMatchingObject(
          res.body,
          updateDelegationFromNameToPersonName(
            expectedModels,
            nationalRegistryUsers,
          ),
        )
      })

      it('should not return delegation when client does not support custom delegations', async () => {
        // Arrange
        await createDelegationModels(delegationModel, [
          mockDelegations.incoming,
        ])
        await clientModel.update(
          { supportsCustomDelegation: false },
          { where: { clientId: client.clientId } },
        )
        const expectedModels: DelegationDTO[] = []

        // Act
        const res = await server.get(`${path}${query}`)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toHaveLength(0)
        expectMatchingObject(
          res.body,
          updateDelegationFromNameToPersonName(
            expectedModels,
            nationalRegistryUsers,
          ),
        )
      })

      it('should not return scopes in delegation that are no longer allowed for delegation', async () => {
        // Arrange
        await createDelegationModels(delegationModel, [
          mockDelegations.incomingBothValidAndNotAllowed,
        ])
        const expectedModels = await findExpectedDelegationModels(
          delegationModel,
          [mockDelegations.incomingBothValidAndNotAllowed.id],
          [Scopes[0].name],
        )

        // Act
        const res = await server.get(`${path}${query}`)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toHaveLength(1)
        expectMatchingObject(
          res.body,
          updateDelegationFromNameToPersonName(
            expectedModels,
            nationalRegistryUsers,
          ),
        )
      })

      describe('with legal guardian delegations', () => {
        let getForsja: jest.SpyInstance
        beforeAll(() => {
          const client = app.get(NationalRegistryClientService)
          getForsja = jest
            .spyOn(client, 'getCustodyChildren')
            .mockResolvedValue([nationalRegistryUser.nationalId])
        })

        afterAll(() => {
          getForsja.mockRestore()
        })

        it('should return delegations', async () => {
          // Arrange
          const expectedDelegation = {
            fromName: nationalRegistryUser.name,
            fromNationalId: nationalRegistryUser.nationalId,
            provider: 'thjodskra',
            toNationalId: user.nationalId,
            type: 'LegalGuardian',
          }
          // Act
          const res = await server.get(`${path}${query}`)

          // Assert
          expect(res.status).toEqual(200)
          expect(res.body).toHaveLength(1)
          expect(res.body[0]).toEqual(expectedDelegation)
        })

        it('should not return delegations when client does not support legal guardian delegations', async () => {
          // Arrange
          await clientModel.update(
            { supportsLegalGuardians: false },
            { where: { clientId: client.clientId } },
          )

          // Act
          const res = await server.get(`${path}${query}`)

          // Assert
          expect(res.status).toEqual(200)
          expect(res.body).toHaveLength(0)
        })

        it('should return a legal guardian delegation since the type is included in the delegationTypes filter', async () => {
          // Act
          const res = await server.get(
            `${path}${query}&delegationTypes=${DelegationType.Custom}&delegationTypes=${DelegationType.LegalGuardian}`,
          )

          // Assert
          expect(res.status).toEqual(200)
          expect(res.body).toHaveLength(1)
          expect(res.body[0].type).toEqual(DelegationType.LegalGuardian)
        })

        it('should not return a legal guardian delegation since the type is not included in the delegationTypes filter', async () => {
          // Act
          const res = await server.get(
            `${path}${query}&delegationTypes=${DelegationType.Custom}`,
          )

          // Assert
          expect(res.status).toEqual(200)
          expect(res.body).toHaveLength(0)
        })
      })

      describe('with procuring delegations', () => {
        let getSimple: jest.SpyInstance
        beforeAll(() => {
          const client = app.get(RskProcuringClient)
          getSimple = jest.spyOn(client, 'getSimple').mockResolvedValue({
            companies: [
              {
                nationalId: nationalRegistryUser.nationalId,
                name: nationalRegistryUser.name,
              },
            ],
          } as ResponseSimple)
        })

        afterAll(() => {
          getSimple.mockRestore()
        })

        it('should return delegations', async () => {
          // Arrange
          const expectedDelegation = {
            fromName: nationalRegistryUser.name,
            fromNationalId: nationalRegistryUser.nationalId,
            provider: 'fyrirtaekjaskra',
            toNationalId: user.nationalId,
            type: 'ProcurationHolder',
          }
          // Act
          const res = await server.get(`${path}${query}`)

          // Assert
          expect(res.status).toEqual(200)
          expect(res.body).toHaveLength(1)
          expect(res.body[0]).toEqual(expectedDelegation)
        })

        it('should not return delegations when client does not support procuring holder delegations', async () => {
          // Arrange
          await clientModel.update(
            { supportsProcuringHolders: false },
            { where: { clientId: client.clientId } },
          )

          // Act
          const res = await server.get(`${path}${query}`)

          // Assert
          expect(res.status).toEqual(200)
          expect(res.body).toHaveLength(0)
        })

        it('should return a procuring holder delegation since the type is included in the delegationTypes filter', async () => {
          // Act
          const res = await server.get(
            `${path}${query}&delegationTypes=${DelegationType.Custom}&delegationTypes=${DelegationType.ProcurationHolder}&delegationTypes=${DelegationType.PersonalRepresentative}`,
          )

          // Assert
          expect(res.status).toEqual(200)
          expect(res.body).toHaveLength(1)
          expect(res.body[0].type).toEqual(DelegationType.ProcurationHolder)
        })

        it('should not return a procuring holder delegation since the type is not included in the delegationTypes filter', async () => {
          // Act
          const res = await server.get(
            `${path}${query}&delegationTypes=${DelegationType.Custom}&delegationTypes=${DelegationType.LegalGuardian}&delegationTypes=${DelegationType.PersonalRepresentative}`,
          )

          // Assert
          expect(res.status).toEqual(200)
          expect(res.body).toHaveLength(0)
        })
      })

      describe('when user is a personal representative with one representee', () => {
        let prModel: typeof PersonalRepresentative
        let prRightsModel: typeof PersonalRepresentativeRight
        let prRightTypeModel: typeof PersonalRepresentativeRightType
        let prTypeModel: typeof PersonalRepresentativeType

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
            nationalIdRepresentedPerson: nationalRegistryUser.nationalId,
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
        })

        describe('when fetched', () => {
          let response: request.Response
          let body: DelegationDTO[]

          beforeAll(async () => {
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
                (d) => d.fromNationalId === nationalRegistryUser.nationalId,
              ),
            ).toBeTruthy()
          })

          it('should have the name of the correct representee', () => {
            expect(
              body.some((d) => d.fromName === nationalRegistryUser.name),
            ).toBeTruthy()
          })

          it('should have the delegation type claim of PersonalRepresentative', () => {
            expect(
              body.some(
                (d) => d.type === DelegationType.PersonalRepresentative,
              ),
            ).toBeTruthy()
          })
        })

        it('should not return delegations when client does not support personal representative delegations', async () => {
          // Prepare
          await clientModel.update(
            { supportsPersonalRepresentatives: false },
            { where: { clientId: client.clientId } },
          )

          // Act
          const res = await server.get(`${path}${query}`)

          // Assert
          expect(res.status).toEqual(200)
          expect(res.body).toHaveLength(0)
        })

        it('should return a personal representative delegation since the type is included in the delegationTypes filter', async () => {
          // Act
          const res = await server.get(
            `${path}${query}&delegationTypes=${DelegationType.Custom}&delegationTypes=${DelegationType.ProcurationHolder}&delegationTypes=${DelegationType.PersonalRepresentative}`,
          )

          // Assert
          expect(res.status).toEqual(200)
          expect(res.body).toHaveLength(1)
          expect(res.body[0].type).toEqual(
            DelegationType.PersonalRepresentative,
          )
        })

        it('should not return a personal representative delegation since the type is not included in the delegationTypes filter', async () => {
          // Act
          const res = await server.get(
            `${path}${query}&delegationTypes=${DelegationType.Custom}&delegationTypes=${DelegationType.LegalGuardian}&delegationTypes=${DelegationType.ProcurationHolder}`,
          )

          // Assert
          expect(res.status).toEqual(200)
          expect(res.body).toHaveLength(0)
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

      it('should only return delegations in the default domain', async () => {
        // Arrange
        const delegations = [
          createDelegation({
            fromNationalId: nationalRegistryUser.nationalId,
            toNationalId: user.nationalId,
            scopes: [Scopes[0].name],
            today,
            domainName: 'someotherdomain',
          }),
          createDelegation({
            fromNationalId: nationalRegistryUser.nationalId,
            toNationalId: user.nationalId,
            scopes: [Scopes[0].name],
            today,
            domainName: DEFAULT_DOMAIN,
          }),
        ]
        await createDelegationModels(delegationModel, delegations)

        const models = await findExpectedDelegationModels(delegationModel, [
          delegations[1].id,
        ])
        const expectedModel = models[0]

        // Act
        const res = await server.get(`${path}${query}`)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toHaveLength(1)
        expectMatchingObject(
          res.body[0],
          updateDelegationFromNameToPersonName(
            expectedModel,
            nationalRegistryUsers,
          ),
        )
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
          type: 'https://httpstatuses.org/401',
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
          type: 'https://httpstatuses.org/403',
          title: 'Forbidden',
          detail: 'Forbidden resource',
        })

        // CleanUp
        app.cleanUp()
      },
    )
  })
})
