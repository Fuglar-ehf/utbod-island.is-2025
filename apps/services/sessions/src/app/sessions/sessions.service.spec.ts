import { Job } from 'bull'

import { createNationalId } from '@island.is/testing/fixtures'
import { TestApp } from '@island.is/testing/nest'

import { FixtureFactory } from '../../../test/fixture.factory'
import { setupWithoutAuth } from '../../../test/setup'
import { Session } from '../sessions/session.model'
import { SessionsService } from './sessions.service'

const mockSession = {
  id: '1',
  actorNationalId: createNationalId(),
  subjectNationalId: createNationalId(),
  clientId: 'clientId',
  timestamp: new Date(),
  //userAgent:
  // 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
  ip: '127.0.0.1',
} as Session

describe('SessionsService', () => {
  let app: TestApp
  let sessionsService: SessionsService
  let factory: FixtureFactory

  beforeAll(async () => {
    app = await setupWithoutAuth()
    factory = new FixtureFactory(app)

    sessionsService = app.get(SessionsService)
  })

  beforeEach(async () => {
    await factory.get(Session).destroy({
      where: {},
      cascade: true,
      truncate: true,
      force: true,
    })
  })

  it.each`
    session        | userAgent                                                                                                                  | device
    ${mockSession} | ${'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'} | ${'Chrome (Mac OS)'}
    ${mockSession} | ${'Chrome/109.0.0.0'}                                                                                                      | ${'Chrome'}
    ${mockSession} | ${'Macintosh; Intel Mac OS X 10_15_7'}                                                                                     | ${'Mac OS'}
    ${mockSession} | ${'Bogus User Agent'}                                                                                                      | ${null}
  `(
    'should create session with matching user agent parsing',
    async ({ session, userAgent, device }) => {
      // Act
      await sessionsService.create({
        ...session,
        userAgent,
      })

      // Assert
      const sessions = await factory.get(Session).findAll()
      expect(sessions).toHaveLength(1)
      expect(sessions[0]).toMatchObject({
        ...session,
        device,
      })
    },
  )
})
