import { uuid } from 'uuidv4'
import fetch from 'node-fetch'

import type { Logger } from '@island.is/logging'
import { NotificationType } from '@island.is/judicial-system/types'
import {
  CaseMessage,
  CaseFileMessage,
  MessageService,
  MessageType,
  PoliceCaseMessage,
  DefendantMessage,
} from '@island.is/judicial-system/message'

import { appModuleConfig } from '../app.config'
import { MessageHandlerService } from '../messageHandler.service'
import { InternalDeliveryService } from '../internalDelivery.service'

jest.mock('@island.is/logging')
jest.mock('node-fetch')

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = (message: CaseMessage) => Promise<Then>

describe('MessageHandlerService - Handle message', () => {
  const config = appModuleConfig()
  const logger = ({ debug: jest.fn() } as unknown) as Logger
  const userId = uuid()
  const caseId = uuid()
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const mockFetch = (fetch as unknown) as jest.Mock
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({ delivered: true }),
    })

    givenWhenThen = async (message: CaseMessage) => {
      const messageHandlerService = new MessageHandlerService(
        (undefined as unknown) as MessageService,
        new InternalDeliveryService(config, logger),
        config,
        logger,
      )
      const then = {} as Then

      try {
        then.result = await messageHandlerService.handleMessage(message)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('deliver prosecutor to court', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.DELIVER_PROSECUTOR_TO_COURT,
        userId,
        caseId,
      })
    })

    it('should deliver prosecutor to court', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/deliverProsecutorToCourt`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
          body: JSON.stringify({ userId }),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('deliver defendant to court', () => {
    const defendantId = uuid()
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.DELIVER_DEFENDANT_TO_COURT,
        userId,
        caseId,
        defendantId,
      } as DefendantMessage)
    })

    it('should deliver defendant to court', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/defendant/${defendantId}/deliverToCourt`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
          body: JSON.stringify({ userId }),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('deliver case file to court', () => {
    const caseFileId = uuid()
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.DELIVER_CASE_FILE_TO_COURT,
        userId,
        caseId,
        caseFileId,
      } as CaseFileMessage)
    })

    it('should deliver case file to court', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/file/${caseFileId}/deliverToCourt`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
          body: JSON.stringify({ userId }),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('deliver case files record to court', () => {
    const policeCaseNumber = uuid()
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.DELIVER_CASE_FILES_RECORD_TO_COURT,
        userId,
        caseId,
        policeCaseNumber,
      } as PoliceCaseMessage)
    })

    it('should deliver case files record to court', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/deliverCaseFilesRecordToCourt/${policeCaseNumber}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
          body: JSON.stringify({ userId }),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('deliver request to court', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.DELIVER_REQUEST_TO_COURT,
        userId,
        caseId,
      })
    })

    it('should deliver request to court', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/deliverRequestToCourt`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
          body: JSON.stringify({ userId }),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('deliver court record to court', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.DELIVER_COURT_RECORD_TO_COURT,
        userId,
        caseId,
      })
    })

    it('should deliver court record to court', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/deliverCourtRecordToCourt`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
          body: JSON.stringify({ userId }),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('deliver signed ruling to court', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.DELIVER_SIGNED_RULING_TO_COURT,
        userId,
        caseId,
      })
    })

    it('should deliver signed ruling to court', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/deliverSignedRulingToCourt`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
          body: JSON.stringify({ userId }),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('deliver case to police', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.DELIVER_CASE_TO_POLICE,
        userId,
        caseId,
      })
    })

    it('should deliver case to police', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/deliverCaseToPolice`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
          body: JSON.stringify({ userId }),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('archive case file', () => {
    const caseFileId = uuid()
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.ARCHIVE_CASE_FILE,
        userId,
        caseId,
        caseFileId,
      } as CaseFileMessage)
    })

    it('should archive case file', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/file/${caseFileId}/archive`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
          body: JSON.stringify({ userId }),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('send heads up notification', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.SEND_HEADS_UP_NOTIFICATION,
        userId,
        caseId,
      })
    })

    it('should send a heads up notification', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/notification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
          body: JSON.stringify({ type: NotificationType.HEADS_UP, userId }),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('send ready for court notification', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.SEND_READY_FOR_COURT_NOTIFICATION,
        userId,
        caseId,
      })
    })

    it('should send a ready for court notification', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/notification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
          body: JSON.stringify({
            type: NotificationType.READY_FOR_COURT,
            userId,
          }),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('send received by court notification', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.SEND_RECEIVED_BY_COURT_NOTIFICATION,
        userId,
        caseId,
      })
    })

    it('should send a received by court notification', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/notification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
          body: JSON.stringify({
            type: NotificationType.RECEIVED_BY_COURT,
            userId,
          }),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('send defendants not updated at court notification', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.SEND_DEFENDANTS_NOT_UPDATED_AT_COURT_NOTIFICATION,
        userId,
        caseId,
      })
    })

    it('should send a defendants not updated at court notification', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/notification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
          body: JSON.stringify({
            type: NotificationType.DEFENDANTS_NOT_UPDATED_AT_COURT,
            userId,
          }),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('send ruling notification', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.SEND_RULING_NOTIFICATION,
        userId,
        caseId,
      })
    })

    it('should send a ruling notification', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/notification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
          body: JSON.stringify({ type: NotificationType.RULING, userId }),
        },
      )
      expect(then.result).toBe(true)
    })
  })
})
