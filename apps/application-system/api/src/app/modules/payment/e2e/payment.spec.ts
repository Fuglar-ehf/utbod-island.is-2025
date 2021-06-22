import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'
import { ApplicationScope } from '@island.is/auth/scopes'

import { setup } from '../../../../../test/setup'
import { PaymentAPI } from '@island.is/clients/payment'

let app: INestApplication

class MockPaymentApi {
  async createCharge() {
    return {
      user4: 'user4',
      receptionID: 'receptionid',
    }
  }
}

const nationalId = '1234564321'
let server: request.SuperTest<request.Test>

beforeAll(async () => {
  app = await setup({
    override: (builder) => {
      builder
        .overrideProvider(PaymentAPI)
        .useClass(MockPaymentApi)
        .overrideGuard(IdsUserGuard)
        .useValue(
          new MockAuthGuard({
            nationalId,
            scope: [ApplicationScope.read, ApplicationScope.write],
          }),
        )
        .compile()
    },
  })

  server = request(app.getHttpServer())
})

describe('Application system payments API', () => {
  // Creating a new application
  it(`POST /application/96b5237b-6896-4154-898d-d8feb01d3dcd/payment should create a payment object`, async () => {
    // Act
    const response = await server
      .post('/applications/96b5237b-6896-4154-898d-d8feb01d3dcd/payment')
      .expect(201)

    // Assert
    expect(response.body.paymentUrl).toBeTruthy()
  })

  // Should fail creating payment due to bad application ID.
  it(`POST /application/96b5237b/payment should fail creating a payment object`, async () => {
    // Act
    const response = await server
      .post('/applications/96b5237b/payment')
      .expect(400)

    // Assert
    expect(response.body.paymentUrl).toBeFalsy()
  })

  // Not finding the application - when trying to get application payment status.
  it(`GET /application/1234567890/payment-status should return not found - bad applicationID`, async () => {
    const response = await server
      .get('/applications/1234567890/payment-status')
      .expect(400)

    expect(response.body.fulfilled).toBeFalsy
  })

  // Getting the payment status
  it(`GET /application/96b5237b-6896-4154-898d-d8feb01d3dcd/payment-status should get payment fulfilled status`, async () => {
    const response = await server
      .get('/applications/96b5237b-6896-4154-898d-d8feb01d3dcd/payment-status')
      .send({
        applicationId: '96b5237b-6896-4154-898d-d8feb01d3dcd',
      })
      .expect(200)
    expect(true).toBeTruthy()
  })

  // Sets the payment status to paid.
  it(`POST /application/32eee126-6b7f-4fca-b9a0-a3618b3e42bf/payment/6b11dc9f-a694-440e-b3dd-7163b5f34815 should update payment fulfilled`, async () => {
    const response = await server
      .post(
        '/applications/32eee126-6b7f-4fca-b9a0-a3618b3e42bf/payment/6b11dc9f-a694-440e-b3dd-7163b5f34815',
      )
      .send({
        applicationId: '32eee126-6b7f-4fca-b9a0-a3618b3e42bf',
        id: '6b11dc9f-a694-440e-b3dd-7163b5f34815',
        callback: {
          receptionID: '1234567890',
          chargeItemSubject: 'Very nice subject',
          status: 'paid',
        },
      })
      .expect(201)
    expect(null).toBeFalsy()
  })

  // Fails to set the payment status to paid.
  it(`POST /application/32eee126-6b7f-4fca-b9a0-a3618b3e42bf/payment/failed-request should update payment fulfilled`, async () => {
    const response = await server
      .post(
        '/applications/32eee126-6b7f-4fca-b9a0-a3618b3e42bf/payment/failed-request',
      )
      .send({
        applicationId: '32eee126-6b7f-4fca-b9a0-a3618b3e42bf',
        id: '6b11dc9f-a694-440e-b3dd-7163b5f34815',
        callback: {
          receptionID: '1234567890',
          chargeItemSubject: 'nice subject.. not',
          status: 'paid',
        },
      })
      .expect(400)
    expect(null).toBeFalsy()
  })

  // TODO: Validate that an application that is in a state that should be pruned
  // is not listed when (mocked) Date.now > application.pruneAt
})
