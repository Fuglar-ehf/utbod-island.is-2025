import request from 'supertest'

import { getRequestMethod, setupApp, TestApp } from '@island.is/testing/nest'
import { User } from '@island.is/auth-nest-tools'
import { FixtureFactory } from '@island.is/services/auth/testing'
import {
  createCurrentUser,
  createNationalRegistryUser,
} from '@island.is/testing/fixtures'
import { DelegationAdminScopes } from '@island.is/auth/scopes'
import addDays from 'date-fns/addDays'
import {
  CreatePaperDelegationDto,
  Delegation,
  DELEGATION_TAG,
  DelegationDelegationType,
  DelegationsIndexService,
  SequelizeConfigService,
  ZENDESK_CUSTOM_FIELDS,
} from '@island.is/auth-api-lib'

import { AppModule } from '../../../app.module'
import { AuthDelegationType } from '@island.is/shared/types'
import { getModelToken } from '@nestjs/sequelize'
import { faker } from '@island.is/shared/mocking'
import { TicketStatus, ZendeskService } from '@island.is/clients/zendesk'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'

const currentUser = createCurrentUser({
  scope: [DelegationAdminScopes.read, DelegationAdminScopes.admin],
})

describe('DelegationAdmin - With authentication', () => {
  let app: TestApp
  let server: request.SuperTest<request.Test>
  let factory: FixtureFactory
  let zendeskService: ZendeskService
  let nationalRegistryApi: NationalRegistryClientService
  let delegationIndexServiceApi: DelegationsIndexService

  beforeEach(async () => {
    app = await setupApp({
      AppModule,
      SequelizeConfigService,
      user: currentUser,
      dbType: 'postgres',
    })

    server = request(app.getHttpServer())
    factory = new FixtureFactory(app)

    zendeskService = app.get(ZendeskService)
    nationalRegistryApi = app.get(NationalRegistryClientService)
    delegationIndexServiceApi = app.get(DelegationsIndexService)

    jest
      .spyOn(delegationIndexServiceApi, 'indexCustomDelegations')
      .mockImplementation(async () => {
        return
      })

    jest
      .spyOn(delegationIndexServiceApi, 'indexGeneralMandateDelegations')
      .mockImplementation(async () => {
        return
      })
  })

  afterEach(async () => {
    await app.cleanUp()
  })

  async function createDelegationAdmin(user?: User) {
    const domain = await factory.createDomain({
      name: 'd1',
      apiScopes: [
        { name: 's1', supportedDelegationTypes: [AuthDelegationType.Custom] },
      ],
    })

    return factory.createCustomDelegation({
      fromNationalId: user?.nationalId ?? '',
      domainName: domain.name,
      scopes: [{ scopeName: 's1' }],
      referenceId: 'ref1',
    })
  }

  describe('GET /delegation-admin', () => {
    it('GET /delegation-admin should return delegations for nationalId', async () => {
      // Arrange
      const delegation = await createDelegationAdmin(currentUser)
      // Act
      const res = await getRequestMethod(
        server,
        'GET',
      )('/delegation-admin').set('X-Query-National-Id', currentUser.nationalId)

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body['outgoing'][0].id).toEqual(delegation.id)
    })
  })

  describe('DELETE /delegation-admin/:delegation', () => {
    it('DELETE /delegation-admin/:delegation should not delete delegation that has no reference id', async () => {
      // Arrange
      const delegationModel = await app.get(getModelToken(Delegation))
      const delegation = await createDelegationAdmin(currentUser)
      // Remove the referenceId
      await delegationModel.update(
        {
          referenceId: null,
        },
        {
          where: {
            id: delegation.id,
          },
        },
      )

      // Act
      const res = await getRequestMethod(
        server,
        'DELETE',
      )(`/delegation-admin/${delegation.id}`)

      // Assert
      expect(res.status).toEqual(204)

      // Assert db
      const deletedDelegation = await delegationModel.findByPk(delegation.id)

      expect(deletedDelegation).not.toBeNull()
    })

    it('DELETE /delegation-admin/:delegation should delete delegation', async () => {
      // Arrange
      const delegation = await createDelegationAdmin(currentUser)

      // Act
      const res = await getRequestMethod(
        server,
        'DELETE',
      )(`/delegation-admin/${delegation.id}`)

      // Assert
      expect(res.status).toEqual(204)

      // Assert db
      const delegationModel = await app.get(getModelToken(Delegation))
      const deletedDelegation = await delegationModel.findByPk(delegation.id)

      expect(deletedDelegation).toBeNull()
    })

    it('DELETE /delegation-admin/:delegation should throw error since id does not exist', async () => {
      // Arrange
      await createDelegationAdmin(currentUser)

      const invalidId = faker.datatype.uuid()
      // Act
      const res = await getRequestMethod(
        server,
        'DELETE',
      )(`/delegation-admin/${invalidId}`)

      // Assert
      expect(res.status).toEqual(204)

      // Assert db
      const delegationModel = await app.get(getModelToken(Delegation))
      const deletedDelegation = await delegationModel.findAll()

      expect(deletedDelegation).not.toBeNull()
    })
  })

  describe('POST /delegation-admin', () => {
    const toNationalId = '0101302399'
    const fromNationalId = '0101307789'

    let zendeskServiceApiSpy: jest.SpyInstance
    let nationalRegistryApiSpy: jest.SpyInstance

    let delegationModel: typeof Delegation
    let delegationDelegationTypeModel: typeof DelegationDelegationType

    beforeEach(async () => {
      delegationModel = await app.get(getModelToken(Delegation))
      delegationDelegationTypeModel = await app.get(
        getModelToken(DelegationDelegationType),
      )

      await factory.createDomain({
        name: 'd1',
        apiScopes: [
          {
            name: 's1',
            supportedDelegationTypes: [
              AuthDelegationType.Custom,
              AuthDelegationType.GeneralMandate,
            ],
          },
        ],
      })

      mockZendeskService(toNationalId, fromNationalId)
      mockNationalRegistryService()
    })

    const mockNationalRegistryService = () => {
      nationalRegistryApiSpy = jest
        .spyOn(nationalRegistryApi, 'getIndividual')
        .mockImplementation(async (id) => {
          const user = createNationalRegistryUser({
            nationalId: id,
          })

          return user ?? null
        })
    }

    const mockZendeskService = (
      toNationalId: string,
      fromNationalId: string,
    ) => {
      zendeskServiceApiSpy = jest
        .spyOn(zendeskService, 'getTicket')
        .mockImplementation((ticketId: string) => {
          return new Promise((resolve) =>
            resolve({
              id: ticketId,
              tags: [DELEGATION_TAG],
              status: TicketStatus.Solved,
              custom_fields: [
                {
                  id: ZENDESK_CUSTOM_FIELDS.DelegationToReferenceId,
                  value: toNationalId,
                },
                {
                  id: ZENDESK_CUSTOM_FIELDS.DelegationFromReferenceId,
                  value: fromNationalId,
                },
              ],
            }),
          )
        })
    }

    afterEach(() => {
      zendeskServiceApiSpy.mockRestore()
      nationalRegistryApiSpy.mockRestore()
    })

    afterAll(() => {
      jest.restoreAllMocks()
      app.cleanUp()
    })

    it('POST /delegation-admin should create delegation', async () => {
      // Arrange
      const delegation: CreatePaperDelegationDto = {
        toNationalId,
        fromNationalId,
        referenceId: 'ref1',
        validTo: addDays(new Date(), 3),
      }

      // Act
      const res = await getRequestMethod(
        server,
        'POST',
      )('/delegation-admin').send(delegation)

      // Assert
      expect(res.status).toEqual(201)
      expect(res.body).toHaveProperty('id')
      expect(res.body.fromNationalId).toEqual(fromNationalId)
      expect(res.body.toNationalId).toEqual(toNationalId)
      expect(res.body.referenceId).toEqual(delegation.referenceId)
      expect(res.body.validTo).toEqual(delegation.validTo?.toISOString())
    })

    it('POST /delegation-admin should create delegation with no expiration date', async () => {
      // Arrange
      const delegation: CreatePaperDelegationDto = {
        toNationalId,
        fromNationalId,
        referenceId: 'ref1',
      }

      // Act
      const res = await getRequestMethod(
        server,
        'POST',
      )('/delegation-admin').send(delegation)

      // Assert
      expect(res.status).toEqual(201)
      expect(res.body).toHaveProperty('id')
      expect(res.body.fromNationalId).toEqual(fromNationalId)
      expect(res.body.toNationalId).toEqual(toNationalId)
      expect(res.body.referenceId).toEqual(delegation.referenceId)
      expect(res.body).not.toHaveProperty('validTo')

      // Assert db
      const createdDelegation = await delegationModel.findByPk(res.body.id)
      const createdDelegationDelegationType =
        await delegationDelegationTypeModel.findOne({
          where: {
            delegationId: res.body.id,
          },
        })

      expect(createdDelegation).not.toBeNull()
      expect(createdDelegationDelegationType).not.toBeNull()
    })

    it('POST /delegation-admin should not create delegation with company national id', async () => {
      // Arrange
      const delegation: CreatePaperDelegationDto = {
        toNationalId: '5005005001',
        fromNationalId,
        referenceId: 'ref1',
      }

      // Act
      const res = await getRequestMethod(
        server,
        'POST',
      )('/delegation-admin').send(delegation)

      // Assert
      expect(res.status).toEqual(400)
    })
  })
})
