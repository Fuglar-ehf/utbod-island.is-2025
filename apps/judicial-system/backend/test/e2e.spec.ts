import * as request from 'supertest'

import { INestApplication } from '@nestjs/common'

import {
  Case as TCase,
  CaseState,
  CaseTransition,
  CaseCustodyProvisions,
  CaseCustodyRestrictions,
  CaseAppealDecision,
  CaseGender,
  User as TUser,
  CaseDecision,
  NotificationType,
  CaseType,
  UserRole,
  AccusedPleaDecision,
} from '@island.is/judicial-system/types'
import { ACCESS_TOKEN_COOKIE_NAME } from '@island.is/judicial-system/consts'
import { SharedAuthService } from '@island.is/judicial-system/auth'

import { setup } from './setup'
import { User } from '../src/app/modules/user'
import { Case } from '../src/app/modules/case/models'
import {
  Notification,
  SendNotificationResponse,
} from '../src/app/modules/notification/models'

jest.setTimeout(20000)

let app: INestApplication
let prosecutor: TUser
let prosecutorAuthCookie: string
let judge: TUser
let judgeAuthCookie: string
let admin: TUser
let adminAuthCookie: string

interface CCase extends TCase {
  prosecutorId: string
  judgeId: string
  parentCaseId: string
}

beforeAll(async () => {
  app = await setup()

  const sharedAuthService = await app.resolve(SharedAuthService)

  prosecutor = (await request(app.getHttpServer()).get('/api/user/0000000000'))
    .body
  prosecutorAuthCookie = sharedAuthService.signJwt(prosecutor)

  judge = (await request(app.getHttpServer()).get('/api/user/2222222222')).body
  judgeAuthCookie = sharedAuthService.signJwt(judge)

  admin = (await request(app.getHttpServer()).get('/api/user/3333333333')).body
  adminAuthCookie = sharedAuthService.signJwt(admin)
})

const minimalCaseData = {
  policeCaseNumber: 'Case Number',
  accusedNationalId: '0101010000',
}

const remainingCreateCaseData = {
  accusedName: 'Accused Name',
  accusedAddress: 'Accused Address',
  accusedGender: CaseGender.OTHER,
  defenderName: 'Defender Name',
  defenderEmail: 'Defender Email',
  court: 'Court',
}

function remainingProsecutorCaseData() {
  return {
    arrestDate: '2020-09-08T08:00:00.000Z',
    requestedCourtDate: '2020-09-08T11:30:00.000Z',
    requestedCustodyEndDate: '2020-09-29T12:00:00.000Z',
    otherDemands: 'Other Demands',
    lawsBroken: 'Broken Laws',
    custodyProvisions: [
      CaseCustodyProvisions._95_1_A,
      CaseCustodyProvisions._99_1_B,
    ],
    requestedCustodyRestrictions: [
      CaseCustodyRestrictions.ISOLATION,
      CaseCustodyRestrictions.MEDIA,
    ],
    requestedOtherRestrictions: 'Requested Other Restrictions',
    caseFacts: 'Case Facts',
    legalArguments: 'Legal Arguments',
    comments: 'Comments',
    prosecutorId: prosecutor.id,
  }
}

function remainingJudgeCaseData() {
  return {
    courtCaseNumber: 'Court Case Number',
    courtDate: '2020-09-29T13:00:00.000Z',
    courtRoom: '201',
    courtStartTime: '2020-09-29T13:00:00.000Z',
    courtEndTime: '2020-09-29T14:00:00.000Z',
    courtAttendees: 'Court Attendees',
    policeDemands: 'Police Demands',
    courtDocuments: ['Þingskjal 1', 'Þingskjal 2'],
    accusedPleaDecision: AccusedPleaDecision.ACCEPT,
    accusedPleaAnnouncement: 'Accused Plea',
    litigationPresentations: 'Litigation Presentations',
    ruling: 'Ruling',
    decision: CaseDecision.ACCEPTING,
    custodyEndDate: '2020-09-28T12:00:00.000Z',
    custodyRestrictions: [CaseCustodyRestrictions.MEDIA],
    otherRestrictions: 'Other Restrictions',
    accusedAppealDecision: CaseAppealDecision.APPEAL,
    accusedAppealAnnouncement: 'Accused Appeal Announcement',
    prosecutorAppealDecision: CaseAppealDecision.ACCEPT,
    prosecutorAppealAnnouncement: 'Prosecutor Appeal Announcement',
    judgeId: judge.id,
  }
}

function getProsecutorCaseData(
  fullCreateCaseData: boolean,
  otherProsecutorCaseData: boolean,
) {
  let data = minimalCaseData
  if (fullCreateCaseData) {
    data = { ...data, ...remainingCreateCaseData }
  }
  if (otherProsecutorCaseData) {
    data = { ...data, ...remainingProsecutorCaseData() }
  }
  return data
}

function getJudgeCaseData() {
  return remainingJudgeCaseData()
}

function getCaseData(
  fullCreateCaseData = false,
  otherProsecutorCaseData = false,
  judgeCaseData = false,
) {
  let data = getProsecutorCaseData(fullCreateCaseData, otherProsecutorCaseData)
  if (judgeCaseData) {
    data = { ...data, ...getJudgeCaseData() }
  }

  return data as CCase
}

function userToTUser(user: User) {
  return ({
    ...user,
    created: user.created && user.created.toISOString(),
    modified: user.modified && user.modified.toISOString(),
  } as unknown) as TUser
}

function caseToCCase(dbCase: Case) {
  const theCase = dbCase.toJSON() as Case

  return ({
    ...theCase,
    created: theCase.created && theCase.created.toISOString(),
    modified: theCase.modified && theCase.modified.toISOString(),
    arrestDate: theCase.arrestDate && theCase.arrestDate.toISOString(),
    requestedCourtDate:
      theCase.requestedCourtDate && theCase.requestedCourtDate.toISOString(),
    requestedCustodyEndDate:
      theCase.requestedCustodyEndDate &&
      theCase.requestedCustodyEndDate.toISOString(),
    prosecutor: theCase.prosecutor && userToTUser(theCase.prosecutor),
    courtDate: theCase.courtDate && theCase.courtDate.toISOString(),
    courtStartTime:
      theCase.courtStartTime && theCase.courtStartTime.toISOString(),
    courtEndTime: theCase.courtEndTime && theCase.courtEndTime.toISOString(),
    custodyEndDate:
      theCase.custodyEndDate && theCase.custodyEndDate.toISOString(),
    judge: theCase.judge && userToTUser(theCase.judge),
  } as unknown) as CCase
}

function expectUsersToMatch(userOne: TUser, userTwo: TUser) {
  expect(userOne?.id).toBe(userTwo?.id)
  expect(userOne?.created).toBe(userTwo?.created)
  expect(userOne?.modified).toBe(userTwo?.modified)
  expect(userOne?.nationalId).toBe(userTwo?.nationalId)
  expect(userOne?.name).toBe(userTwo?.name)
  expect(userOne?.title).toBe(userTwo?.title)
  expect(userOne?.mobileNumber).toBe(userTwo?.mobileNumber)
  expect(userOne?.email).toBe(userTwo?.email)
  expect(userOne?.role).toBe(userTwo?.role)
  expect(userOne?.institution).toBe(userTwo?.institution)
  expect(userOne?.active).toBe(userTwo?.active)
}

function expectCasesToMatch(caseOne: CCase, caseTwo: CCase) {
  expect(caseOne.id).toBe(caseTwo.id)
  expect(caseOne.created).toBe(caseTwo.created)
  expect(caseOne.modified).toBe(caseTwo.modified)
  expect(caseOne.type).toBe(caseTwo.type)
  expect(caseOne.state).toBe(caseTwo.state)
  expect(caseOne.policeCaseNumber).toBe(caseTwo.policeCaseNumber)
  expect(caseOne.accusedNationalId).toBe(caseTwo.accusedNationalId)
  expect(caseOne.accusedName || null).toBe(caseTwo.accusedName || null)
  expect(caseOne.accusedAddress || null).toBe(caseTwo.accusedAddress || null)
  expect(caseOne.accusedGender || null).toBe(caseTwo.accusedGender || null)
  expect(caseOne.defenderName || null).toBe(caseTwo.defenderName || null)
  expect(caseOne.defenderEmail || null).toBe(caseTwo.defenderEmail || null)
  expect(caseOne.court || null).toBe(caseTwo.court || null)
  expect(caseOne.arrestDate || null).toBe(caseTwo.arrestDate || null)
  expect(caseOne.requestedCourtDate || null).toBe(
    caseTwo.requestedCourtDate || null,
  )
  expect(caseOne.requestedCustodyEndDate || null).toBe(
    caseTwo.requestedCustodyEndDate || null,
  )
  expect(caseOne.otherDemands || null).toBe(caseTwo.otherDemands || null)
  expect(caseOne.lawsBroken || null).toBe(caseTwo.lawsBroken || null)
  expect(caseOne.custodyProvisions || null).toStrictEqual(
    caseTwo.custodyProvisions || null,
  )
  expect(caseOne.requestedCustodyRestrictions || null).toStrictEqual(
    caseTwo.requestedCustodyRestrictions || null,
  )
  expect(caseOne.requestedOtherRestrictions || null).toBe(
    caseTwo.requestedOtherRestrictions || null,
  )
  expect(caseOne.caseFacts || null).toBe(caseTwo.caseFacts || null)
  expect(caseOne.legalArguments || null).toBe(caseTwo.legalArguments || null)
  expect(caseOne.comments || null).toBe(caseTwo.comments || null)
  expect(caseOne.prosecutorId || null).toBe(caseTwo.prosecutorId || null)
  expectUsersToMatch(caseOne.prosecutor, caseTwo.prosecutor)
  expect(caseOne.courtCaseNumber || null).toBe(caseTwo.courtCaseNumber || null)
  expect(caseOne.courtDate || null).toBe(caseTwo.courtDate || null)
  expect(caseOne.courtRoom || null).toBe(caseTwo.courtRoom || null)
  expect(caseOne.courtStartTime || null).toBe(caseTwo.courtStartTime || null)
  expect(caseOne.courtEndTime || null).toBe(caseTwo.courtEndTime || null)
  expect(caseOne.courtAttendees || null).toBe(caseTwo.courtAttendees || null)
  expect(caseOne.policeDemands || null).toBe(caseTwo.policeDemands || null)
  expect(caseOne.courtDocuments || null).toStrictEqual(
    caseTwo.courtDocuments || null,
  )
  expect(caseOne.accusedPleaDecision || null).toBe(
    caseTwo.accusedPleaDecision || null,
  )
  expect(caseOne.accusedPleaAnnouncement || null).toBe(
    caseTwo.accusedPleaAnnouncement || null,
  )
  expect(caseOne.litigationPresentations || null).toBe(
    caseTwo.litigationPresentations || null,
  )
  expect(caseOne.ruling || null).toBe(caseTwo.ruling || null)
  expect(caseOne.decision || null).toBe(caseTwo.decision || null)
  expect(caseOne.custodyEndDate || null).toBe(caseTwo.custodyEndDate || null)
  expect(caseOne.custodyRestrictions || null).toStrictEqual(
    caseTwo.custodyRestrictions || null,
  )
  expect(caseOne.otherRestrictions || null).toBe(
    caseTwo.otherRestrictions || null,
  )
  expect(caseOne.accusedAppealDecision || null).toBe(
    caseTwo.accusedAppealDecision || null,
  )
  expect(caseOne.accusedAppealAnnouncement || null).toBe(
    caseTwo.accusedAppealAnnouncement || null,
  )
  expect(caseOne.prosecutorAppealDecision || null).toBe(
    caseTwo.prosecutorAppealDecision || null,
  )
  expect(caseOne.prosecutorAppealAnnouncement || null).toBe(
    caseTwo.prosecutorAppealAnnouncement || null,
  )
  expect(caseOne.judgeId || null).toBe(caseTwo.judgeId || null)
  expectUsersToMatch(caseOne.judge, caseTwo.judge)
  expect(caseOne.parentCaseId || null).toBe(caseTwo.parentCaseId || null)
  expect(caseOne.parentCase || null).toStrictEqual(caseTwo.parentCase || null)
}

describe('User', () => {
  it('GET /api/user/:nationalId should get the user', async () => {
    const nationalId = '2222222222'
    let dbUser: TUser

    await User.findOne({
      where: { nationalId },
    })
      .then((value) => {
        dbUser = userToTUser(value.toJSON() as User)

        return request(app.getHttpServer())
          .get(`/api/user/${nationalId}`)
          .send()
          .expect(200)
      })
      .then((response) => {
        const apiUser = response.body

        expectUsersToMatch(apiUser, dbUser)
      })
  })

  it('POST /api/user should create a user', async () => {
    const data = {
      nationalId: '1234567890',
      name: 'The User',
      title: 'The Title',
      mobileNumber: '1234567',
      email: 'user@dmr.is',
      role: UserRole.JUDGE,
      institution: 'The Institution',
      active: true,
    }
    let apiUser: TUser

    await User.destroy({
      where: {
        national_id: data.nationalId, // eslint-disable-line @typescript-eslint/camelcase
      },
    })
      .then(() => {
        return request(app.getHttpServer())
          .post('/api/user')
          .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${adminAuthCookie}`)
          .send(data)
          .expect(201)
      })
      .then((response) => {
        apiUser = response.body

        // Check the response
        expectUsersToMatch(apiUser, {
          ...data,
          id: apiUser.id || 'FAILURE',
          created: apiUser.created || 'FAILURE',
          modified: apiUser.modified || 'FAILURE',
        })

        // Check the data in the database
        return User.findOne({
          where: { id: apiUser.id },
        })
      })
      .then((value) => {
        expectUsersToMatch(userToTUser(value.toJSON() as User), apiUser)
      })
  })

  it('PUT /api/user/:id should update fields of a user by id', async () => {
    const nationalId = '0987654321'
    const data = {
      name: 'The Modified User',
      title: 'The Modified Title',
      mobileNumber: '7654321',
      email: 'modifieduser@dmr.is',
      role: UserRole.PROSECUTOR,
      institution: 'The Modified Institution',
      active: false,
    }
    let dbUser: TUser
    let apiUser: TUser

    await User.destroy({
      where: {
        national_id: nationalId, // eslint-disable-line @typescript-eslint/camelcase
      },
    })
      .then(() => {
        return User.create({
          nationalId: nationalId,
          name: 'The User',
          title: 'The Title',
          mobileNumber: '1234567',
          email: 'user@dmr.is',
          role: UserRole.JUDGE,
          institution: 'The Institution',
          active: true,
        })
      })
      .then((value) => {
        dbUser = userToTUser(value.toJSON() as User)

        return request(app.getHttpServer())
          .put(`/api/user/${dbUser.id}`)
          .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${adminAuthCookie}`)
          .send(data)
          .expect(200)
      })
      .then((response) => {
        apiUser = response.body

        // Check the response
        expect(apiUser.modified).not.toBe(dbUser.modified)
        expectUsersToMatch(apiUser, {
          ...data,
          id: dbUser.id || 'FAILURE',
          created: dbUser.created || 'FAILURE',
          modified: apiUser.modified,
          nationalId: dbUser.nationalId || 'FAILURE',
        } as TUser)

        // Check the data in the database
        return User.findOne({
          where: { id: apiUser.id },
        })
      })
      .then((newValue) => {
        expectUsersToMatch(userToTUser(newValue.toJSON() as User), apiUser)
      })
  })
})

describe('Case', () => {
  it('POST /api/case should create a case', async () => {
    const data = {
      ...getCaseData(true),
      type: CaseType.CUSTODY,
    }
    let apiCase: CCase

    await request(app.getHttpServer())
      .post('/api/case')
      .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${prosecutorAuthCookie}`)
      .send(data)
      .expect(201)
      .then((response) => {
        apiCase = response.body

        // Check the response
        expectCasesToMatch(apiCase, {
          ...data,
          id: apiCase.id || 'FAILURE',
          created: apiCase.created || 'FAILURE',
          modified: apiCase.modified || 'FAILURE',
          state: CaseState.NEW,
          prosecutorId: prosecutor.id,
        })

        // Check the data in the database
        return Case.findOne({
          where: { id: apiCase.id },
        })
      })
      .then((value) => {
        expectCasesToMatch(caseToCCase(value), apiCase)
      })
  })

  it('POST /api/case with required fields should create a case', async () => {
    const data = {
      ...getCaseData(),
      type: CaseType.CUSTODY,
    }
    let apiCase: CCase

    await request(app.getHttpServer())
      .post('/api/case')
      .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${prosecutorAuthCookie}`)
      .send(data)
      .expect(201)
      .then((response) => {
        apiCase = response.body

        // Check the response
        expectCasesToMatch(apiCase, {
          ...data,
          id: apiCase.id || 'FAILURE',
          created: apiCase.created || 'FAILURE',
          modified: apiCase.modified || 'FAILURE',
          state: CaseState.NEW,
          prosecutorId: prosecutor.id,
        })

        // Check the data in the database
        return Case.findOne({
          where: { id: apiCase.id },
        })
      })
      .then((value) => {
        expectCasesToMatch(caseToCCase(value), apiCase)
      })
  })

  it('PUT /api/case/:id should update prosecutor fields of a case by id', async () => {
    const data = getCaseData(true, true)
    let dbCase: CCase
    let apiCase: CCase

    await Case.create(getCaseData())
      .then((value) => {
        dbCase = caseToCCase(value)

        return request(app.getHttpServer())
          .put(`/api/case/${dbCase.id}`)
          .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${prosecutorAuthCookie}`)
          .send(data)
          .expect(200)
      })
      .then((response) => {
        apiCase = response.body

        // Check the response
        expect(apiCase.modified).not.toBe(dbCase.modified)
        expectCasesToMatch(apiCase, {
          ...data,
          id: dbCase.id || 'FAILURE',
          created: dbCase.created || 'FAILURE',
          modified: apiCase.modified,
          type: CaseType.CUSTODY,
          state: dbCase.state || 'FAILURE',
        } as CCase)

        // Check the data in the database
        return Case.findOne({
          where: { id: apiCase.id },
        })
      })
      .then((newValue) => {
        expectCasesToMatch(caseToCCase(newValue), apiCase)
      })
  })

  it('PUT /api/case/:id should update judge fields of a case by id', async () => {
    const judgeCaseData = getJudgeCaseData()
    let dbCase: CCase
    let apiCase: CCase

    await Case.create(getCaseData())
      .then((value) => {
        dbCase = caseToCCase(value)

        return request(app.getHttpServer())
          .put(`/api/case/${dbCase.id}`)
          .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${judgeAuthCookie}`)
          .send(judgeCaseData)
          .expect(200)
      })
      .then((response) => {
        apiCase = response.body

        // Check the response
        expect(apiCase.modified).not.toBe(dbCase.modified)
        expectCasesToMatch(apiCase, {
          ...dbCase,
          modified: apiCase.modified,
          ...judgeCaseData,
        } as CCase)

        // Check the data in the database
        return Case.findOne({
          where: { id: apiCase.id },
        })
      })
      .then((newValue) => {
        expectCasesToMatch(caseToCCase(newValue), apiCase)
      })
  })

  it('Put /api/case/:id/state should transition case to a new state', async () => {
    let dbCase: CCase
    let apiCase: CCase

    await Case.create({
      ...getCaseData(true, true, true),
      state: CaseState.RECEIVED,
    })
      .then((value) => {
        dbCase = caseToCCase(value)

        const data = {
          modified: value.modified.toISOString(),
          transition: CaseTransition.ACCEPT,
        }

        return request(app.getHttpServer())
          .put(`/api/case/${value.id}/state`)
          .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${judgeAuthCookie}`)
          .send(data)
          .expect(200)
      })
      .then((response) => {
        apiCase = response.body

        // Check the response
        expect(apiCase.modified).not.toBe(dbCase.modified)
        expect(apiCase.state).not.toBe(dbCase.state)
        expectCasesToMatch(apiCase, {
          ...dbCase,
          modified: apiCase.modified,
          state: CaseState.ACCEPTED,
        })

        // Check the data in the database
        return Case.findOne({
          where: { id: apiCase.id },
          include: [
            { model: User, as: 'prosecutor' },
            { model: User, as: 'judge' },
          ],
        })
      })
      .then((value) => {
        expectCasesToMatch(caseToCCase(value), {
          ...apiCase,
          prosecutor,
          judge,
        })
      })
  })

  it('Get /api/cases should get all cases', async () => {
    await Case.create(getCaseData())
      .then(() => Case.create(getCaseData()))
      .then(() =>
        request(app.getHttpServer())
          .get(`/api/cases`)
          .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${judgeAuthCookie}`)
          .send()
          .expect(200),
      )
      .then((response) => {
        // Check the response - should have at least two cases
        expect(response.body.length).toBeGreaterThanOrEqual(2)
      })
  })

  it('GET /api/case/:id should get a case by id', async () => {
    let dbCase: CCase

    await Case.create(getCaseData(true, true, true))
      .then((value) => {
        dbCase = caseToCCase(value)

        return request(app.getHttpServer())
          .get(`/api/case/${dbCase.id}`)
          .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${judgeAuthCookie}`)
          .send()
          .expect(200)
      })
      .then((response) => {
        // Check the response
        expectCasesToMatch(response.body, {
          ...dbCase,
          prosecutor,
          judge,
        })
      })
  })

  it('POST /api/case/:id/signature should request a signature for a case', async () => {
    await Case.create({
      ...getCaseData(true, true, true),
      state: CaseState.REJECTED,
    })
      .then(async (value) =>
        request(app.getHttpServer())
          .post(`/api/case/${value.id}/signature`)
          .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${judgeAuthCookie}`)
          .expect(201),
      )
      .then(async (response) => {
        // Check the response
        expect(response.body.controlCode).toBe('0000')
        expect(response.body.documentToken).toBe('DEVELOPMENT')
      })
  })

  it('GET /api/case/:id/signature should confirm a signature for a case', async () => {
    await Case.create({
      ...getCaseData(true, true, true),
      state: CaseState.ACCEPTED,
      judgeId: judge.id,
    })
      .then((value) =>
        request(app.getHttpServer())
          .get(`/api/case/${value.id}/signature`)
          .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${judgeAuthCookie}`)
          .query({ documentToken: 'DEVELOPMENT' })
          .expect(200),
      )
      .then(async (response) => {
        // Check the response
        expect(response.body).not.toBeNull()
        expect(response.body.documentSigned).toBe(true)
        expect(response.body.code).toBeUndefined()
        expect(response.body.message).toBeUndefined()
      })
  })

  it('POST /api/case/:id/extend should extend case', async () => {
    let dbCase: CCase

    await Case.create(getCaseData(true, true, true))
      .then((value) => {
        dbCase = caseToCCase(value)

        return request(app.getHttpServer())
          .post(`/api/case/${dbCase.id}/extend`)
          .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${prosecutorAuthCookie}`)
          .expect(201)
      })
      .then(async (response) => {
        // Check the response
        const apiCase = response.body

        // Check the response
        expectCasesToMatch(apiCase, {
          id: apiCase.id || 'FAILURE',
          created: apiCase.created || 'FAILURE',
          modified: apiCase.modified || 'FAILURE',
          type: dbCase.type,
          state: CaseState.NEW,
          policeCaseNumber: dbCase.policeCaseNumber,
          accusedNationalId: dbCase.accusedNationalId,
          accusedName: dbCase.accusedName,
          accusedAddress: dbCase.accusedAddress,
          accusedGender: dbCase.accusedGender,
          court: dbCase.court,
          lawsBroken: dbCase.lawsBroken,
          custodyProvisions: dbCase.custodyProvisions,
          requestedCustodyRestrictions: dbCase.requestedCustodyRestrictions,
          caseFacts: dbCase.caseFacts,
          legalArguments: dbCase.legalArguments,
          parentCaseId: dbCase.id,
        } as CCase)
      })
  })
})

function dbNotificationToNotification(dbNotification: Notification) {
  const notification = dbNotification.toJSON() as Notification

  return ({
    ...notification,
    created: notification.created && notification.created.toISOString(),
  } as unknown) as Notification
}

describe('Notification', () => {
  it('POST /api/case/:id/notification should send a notification', async () => {
    let dbCase: Case
    let apiSendNotificationResponse: SendNotificationResponse

    await Case.create({
      type: CaseType.CUSTODY,
      policeCaseNumber: 'Case Number',
      accusedNationalId: '0101010000',
    })
      .then((value) => {
        dbCase = value

        return request(app.getHttpServer())
          .post(`/api/case/${dbCase.id}/notification`)
          .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${prosecutorAuthCookie}`)
          .send({ type: NotificationType.HEADS_UP })
          .expect(201)
      })
      .then((response) => {
        apiSendNotificationResponse = response.body

        // Check the response
        expect(apiSendNotificationResponse.notificationSent).toBe(true)
        expect(apiSendNotificationResponse.notification.id).toBeTruthy()
        expect(apiSendNotificationResponse.notification.created).toBeTruthy()
        expect(apiSendNotificationResponse.notification.caseId).toBe(dbCase.id)
        expect(apiSendNotificationResponse.notification.type).toBe(
          NotificationType.HEADS_UP,
        )
        expect(apiSendNotificationResponse.notification.condition).toBeNull()
        expect(apiSendNotificationResponse.notification.recipients).toBe(
          `[{"success":true}]`,
        )

        // Check the data in the database
        return Notification.findOne({
          where: { id: response.body.notification.id },
        })
      })
      .then((value) => {
        expect(value.id).toBe(apiSendNotificationResponse.notification.id)
        expect(value.created.toISOString()).toBe(
          apiSendNotificationResponse.notification.created,
        )
        expect(value.type).toBe(apiSendNotificationResponse.notification.type)
        expect(value.condition).toBe(
          apiSendNotificationResponse.notification.condition,
        )
        expect(value.recipients).toBe(
          apiSendNotificationResponse.notification.recipients,
        )
      })
  })

  it('GET /api/case/:id/notifications should get all notifications by case id', async () => {
    let dbCase: Case
    let dbNotification: Notification

    await Case.create({
      type: CaseType.CUSTODY,
      policeCaseNumber: 'Case Number',
      accusedNationalId: '0101010000',
    })
      .then((value) => {
        dbCase = value

        return Notification.create({
          caseId: dbCase.id,
          type: NotificationType.HEADS_UP,
          message: 'Test Message',
        })
      })
      .then((value) => {
        dbNotification = value

        return request(app.getHttpServer())
          .get(`/api/case/${dbCase.id}/notifications`)
          .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${prosecutorAuthCookie}`)
          .expect(200)
      })
      .then((response) => {
        // Check the response
        expect(response.body).toStrictEqual([
          dbNotificationToNotification(dbNotification),
        ])
      })
  })
})
