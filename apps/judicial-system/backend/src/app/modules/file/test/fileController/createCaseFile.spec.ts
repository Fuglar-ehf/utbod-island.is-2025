import { uuid } from 'uuidv4'

import { BadRequestException } from '@nestjs/common'

import {
  CaseFileState,
  indictmentCases,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { randomDate } from '../../../../test'
import { Case } from '../../../case'
import { CreateFileDto } from '../../dto/createFile.dto'
import { CaseFile } from '../../models/file.model'
import { createTestingFileModule } from '../createTestingFileModule'

interface Then {
  result: CaseFile
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  createCaseFile: CreateFileDto,
  theCase: Case,
) => Promise<Then>

describe('FileController - Create case file', () => {
  let mockFileModel: typeof CaseFile
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { fileModel, fileController } = await createTestingFileModule()

    mockFileModel = fileModel

    givenWhenThen = async (
      caseId: string,
      createCaseFile: CreateFileDto,
      theCase: Case,
    ): Promise<Then> => {
      const then = {} as Then

      await fileController
        .createCaseFile(caseId, theCase, createCaseFile)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe.each([...restrictionCases, ...investigationCases])(
    'case file created for %s case',
    (type) => {
      const caseId = uuid()
      const theCase = { id: caseId, type } as Case
      const uuId = uuid()
      const createCaseFile: CreateFileDto = {
        type: 'text/plain',
        key: `uploads/${caseId}/${uuId}/test.txt`,
        size: 99,
      }
      const fileId = uuid()
      const timeStamp = randomDate()
      const caseFile = {
        type: 'text/plain',
        key: `uploads/${caseId}/${uuId}/test.txt`,
        size: 99,
        id: fileId,
        created: timeStamp,
        modified: timeStamp,
      }
      let then: Then

      beforeEach(async () => {
        const mockCreate = mockFileModel.create as jest.Mock
        mockCreate.mockResolvedValueOnce(caseFile)

        then = await givenWhenThen(caseId, createCaseFile, theCase)
      })

      it('should create a case file in the database', () => {
        expect(mockFileModel.create).toHaveBeenCalledWith({
          type: 'text/plain',
          state: CaseFileState.STORED_IN_RVG,
          key: `uploads/${caseId}/${uuId}/test.txt`,
          size: 99,
          caseId,
          name: 'test.txt',
        })
      })

      it('should return a case file', () => {
        expect(then.result).toBe(caseFile)
      })
    },
  )

  describe.each(indictmentCases)('case file created for %s case', (type) => {
    const caseId = uuid()
    const theCase = { id: caseId, type } as Case
    const uuId = uuid()
    const createCaseFile: CreateFileDto = {
      type: 'text/plain',
      key: `indictments/${caseId}/${uuId}/test.txt`,
      size: 99,
    }
    const fileId = uuid()
    const timeStamp = randomDate()
    const caseFile = {
      type: 'text/plain',
      key: `indictments/${caseId}/${uuId}/test.txt`,
      size: 99,
      id: fileId,
      created: timeStamp,
      modified: timeStamp,
    }
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockFileModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce(caseFile)

      then = await givenWhenThen(caseId, createCaseFile, theCase)
    })

    it('should create a case file in the database', () => {
      expect(mockFileModel.create).toHaveBeenCalledWith({
        type: 'text/plain',
        state: CaseFileState.STORED_IN_RVG,
        key: `indictments/${caseId}/${uuId}/test.txt`,
        size: 99,
        caseId,
        name: 'test.txt',
      })
    })

    it('should return a case file', () => {
      expect(then.result).toBe(caseFile)
    })
  })

  describe('malformed key', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const uuId = `-${uuid()}`
    const createCaseFile: CreateFileDto = {
      type: 'text/plain',
      key: `uploads/${caseId}/${uuId}/test.txt`,
      size: 99,
    }
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, createCaseFile, theCase)
    })

    it('should throw bad gateway exception', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe(
        `uploads/${caseId}/${uuId}/test.txt is not a valid key for case ${caseId}`,
      )
    })
  })

  describe('database insert fails', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const uuId = uuid()
    const createCaseFile: CreateFileDto = {
      type: 'text/plain',
      key: `uploads/${caseId}/${uuId}/test.txt`,
      size: 99,
    }
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockFileModel.create as jest.Mock
      mockCreate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, createCaseFile, theCase)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
